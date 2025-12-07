import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase as customSupabaseClient } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const signOutCallback = useCallback(async () => {
    const { error } = await customSupabaseClient.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }
    // onAuthStateChange will handle state clearing and navigation
    return { error };
  }, [toast, navigate]);

  const fetchProfile = useCallback(async (user) => {
    if (user) {
      let { data, error } = await customSupabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Profile Error",
          description: "Could not fetch user profile.",
        });
        setProfile(null);
        return null;
      }

      if (data) {
        let profileUpdates = {};
        let needsUpdate = false;

        if (data.has_mentorship_access && data.mentorship_access_expires_at && new Date() > new Date(data.mentorship_access_expires_at)) {
          profileUpdates.has_mentorship_access = false;
          profileUpdates.mentorship_access_expires_at = null;
          needsUpdate = true;
          toast({
            title: "Mentorship Access Expired",
            description: "Your access to the mentorship program has expired.",
          });
        }
        
        const tools = [
          { accessKey: 'access_feed', expiryKey: 'access_feed_expires_at', name: 'Feed' },
          { accessKey: 'access_economic_calendar', expiryKey: 'access_economic_calendar_expires_at', name: 'Economic Calendar' },
          { accessKey: 'access_market_sentiment', expiryKey: 'access_market_sentiment_expires_at', name: 'Market Sentiment' },
          { accessKey: 'access_macro_analysis', expiryKey: 'access_macro_analysis_expires_at', name: 'Macro Analysis' },
          { accessKey: 'access_interest_rates', expiryKey: 'access_interest_rates_expires_at', name: 'Interest Rates' },
          { accessKey: 'access_implied_volatility', expiryKey: 'access_implied_volatility_expires_at', name: 'Implied Volatility' },
        ];

        tools.forEach(tool => {
          if (data[tool.accessKey] && data[tool.expiryKey] && new Date() > new Date(data[tool.expiryKey])) {
            profileUpdates[tool.accessKey] = false;
            profileUpdates[tool.expiryKey] = null;
            needsUpdate = true;
            toast({
              title: "Tool Access Expired",
              description: `Your access to the ${tool.name} tool has expired.`,
            });
          }
        });

        if (needsUpdate) {
          const { data: updatedProfile, error: updateError } = await customSupabaseClient
            .from('profiles')
            .update(profileUpdates)
            .eq('id', user.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error expiring access:', updateError);
          } else {
            data = updatedProfile;
          }
        }
      }
      
      setProfile(data);
      return data;

    } else {
      setProfile(null);
      return null;
    }
  }, [toast]);

  const handleSession = useCallback(async (currentSession) => {
    setSession(currentSession);
    const currentUser = currentSession?.user ?? null;
    setUser(currentUser);
    await fetchProfile(currentUser);
    setLoading(false);
  }, [fetchProfile]);
  
  useEffect(() => {
    setLoading(true);
    customSupabaseClient.auth.getSession().then(({ data: { session } }) => {
      handleSession(session).finally(() => setLoading(false));
    });

    const { data: { subscription } } = customSupabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') {
          handleSession(session);
        } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'PASSWORD_RECOVERY') {
          handleSession(session);
        } else if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
          setUser(null);
          setProfile(null);
          setSession(null);
          navigate('/', { replace: true });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession, navigate]);

  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.status !== 'approved' && profile.role !== 'admin') {
        signOutCallback().then(() => {
          navigate('/login?status=pending', { replace: true });
        });
        return;
      }
      if (profile.must_change_password) {
        navigate('/change-password', { replace: true });
      } else {
        const publicRoutes = ['/', '/login', '/signup'];
        if (publicRoutes.includes(window.location.pathname)) {
            navigate('/dashboard', { replace: true });
        }
      }
    } else if (!loading && !user) {
      const privateRoutesPrefixes = ['/dashboard', '/admin', '/tools', '/contact', '/mentorship', '/profile-settings', '/mentorship-access', '/change-password'];
      if(privateRoutesPrefixes.some(prefix => window.location.pathname.startsWith(prefix))){
           navigate('/', { replace: true });
      }
    }
  }, [user, profile, loading, navigate, signOutCallback]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await customSupabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }
    
    if (data.user && data.session) {
      try {
        await customSupabaseClient.functions.invoke('sign-out-user-sessions', {
          body: { userId: data.user.id },
          headers: { Authorization: `Bearer ${data.session.access_token}` },
        });
      } catch (e) {
        console.warn("Could not sign out other sessions:", e.message);
      }
      
      const { data: revalidatedData, error: revalidatedError } = await customSupabaseClient.auth.signInWithPassword({ email, password });
      if (revalidatedError) {
          return { error: revalidatedError };
      }
      handleSession(revalidatedData.session);
      return { data: revalidatedData, error: null };
    }
    
    return { data, error: null };
  }, [handleSession]);
  
  const refreshProfile = useCallback(() => {
    if (user) {
      return fetchProfile(user);
    }
    return Promise.resolve(null);
  }, [user, fetchProfile]);

  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    signIn,
    signOut: signOutCallback,
    refreshProfile,
    supabase: customSupabaseClient,
  }), [user, profile, session, loading, signIn, signOutCallback, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};