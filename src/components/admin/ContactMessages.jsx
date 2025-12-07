import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Inbox, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const { toast } = useToast();
  const { session } = useAuth();

  const fetchMessages = useCallback(async () => {
    if (!session) return;
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setMessages(data);
    } catch (error) {
      toast({ title: 'Error fetching messages', description: error.message, variant: 'destructive' });
    } finally {
      setLoadingMessages(false);
    }
  }, [toast, session]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
      <h3 className="text-2xl font-semibold text-white mb-4 flex items-center"><Inbox className="mr-2" />Contact Messages</h3>
      {loadingMessages ? <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {messages.length === 0 ? <p className="text-gray-400">No messages yet.</p> : messages.map(msg => (
            <div key={msg.id} className="bg-black/20 p-4 rounded-xl border border-white/10">
              <p className="font-semibold text-white">{msg.name} <span className="text-sm text-gray-400 break-all">({msg.email})</span></p>
              <p className="text-sm text-gray-300 mt-2 break-words">{msg.message}</p>
              <p className="text-xs text-gray-500 mt-2 text-right">{new Date(msg.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;