import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Wrench, BookOpen, MessageSquare, Shield, LogOut, X, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const NavItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center space-x-2 ${
        isActive ? 'text-white' : 'text-gray-300 hover:text-white'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-4 h-4" />
      <span>{item.label}</span>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white/10 rounded-full -z-10"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const MobileMenu = ({ navItems, onNavigate, onLogout, onClose }) => {
  const menuVariants = {
    hidden: { opacity: 0, y: '-100%' },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0, y: '-100%', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + i * 0.07, ease: 'easeOut' },
    }),
  };
  
  const allNavItems = [
      ...navItems,
      { id: 'settings', label: 'Profile Settings', icon: Settings, path: '/profile-settings' },
  ];

  return (
    <motion.div
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-background/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center"
    >
      <button onClick={onClose} className="absolute top-5 right-5 text-gray-300 hover:text-white">
        <X size={32} />
      </button>
      <nav className="flex flex-col items-center space-y-6">
        {allNavItems.map((item, i) => (
          <motion.button
            key={item.id}
            custom={i}
            variants={itemVariants}
            onClick={() => onNavigate(item.path)}
            className="text-2xl font-semibold text-gray-200 hover:text-white hover:scale-105 transition-transform"
          >
            {item.label}
          </motion.button>
        ))}
        <motion.div custom={allNavItems.length} variants={itemVariants}>
          <button
            onClick={onLogout}
            className="mt-8 flex items-center space-x-2 px-4 py-2 rounded-md text-lg font-medium text-pink-400 hover:text-pink-300 bg-white/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </motion.div>
      </nav>
    </motion.div>
  );
};

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };
  
  const handleProfileSettings = () => {
    navigate('/profile-settings');
  }

  const baseNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'tools', label: 'Tools', icon: Wrench, path: '/tools' },
  ];

  const navItems = [...baseNavItems];
  if (profile?.has_mentorship_access || profile?.role === 'admin') {
      navItems.push({ id: 'mentorship', label: 'Mentorship', icon: BookOpen, path: '/mentorship' });
  }

  navItems.push({ id: 'contact', label: 'Contact Us', icon: MessageSquare, path: '/contact' });

  if (profile?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin', icon: Shield, path: '/admin' });
  }

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const getInitials = (name) => {
    if (!name || name.trim() === '') return user?.email?.charAt(0).toUpperCase() || 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };
  
  return (
    <>
      <header className="sticky top-4 left-0 right-0 z-40 mx-auto max-w-6xl">
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                <img 
                  src="https://i.imageupload.app/ff82f4c309a3a7811e2d.png" 
                  alt="PROFITIX ACADMEY" 
                  className="h-8 w-8 object-contain" 
                />
                <span className="text-xl font-anton text-white tracking-wider">PROFITIX</span>
              </motion.div>

              <nav className="hidden md:flex items-center space-x-1 bg-black/20 p-1 rounded-full border border-white/10">
                {navItems.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={location.pathname === item.path || (item.id === 'tools' && location.pathname.startsWith('/tools/'))}
                    onClick={() => handleNavigate(item.path)}
                  />
                ))}
              </nav>

              <div className="flex items-center space-x-4">
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block focus:outline-none">
                       <Avatar className="h-9 w-9 border-2 border-white/20 hover:border-brand-pink transition-colors">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                        <AvatarFallback className="bg-gray-800 text-white font-bold">
                          {getInitials(profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-black/50 backdrop-blur-xl border-white/10 text-white" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{profile?.full_name || 'User'}</p>
                        <p className="text-xs leading-none text-gray-400">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={handleProfileSettings} className="cursor-pointer focus:bg-white/10 focus:text-white">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10"/>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-pink-400 focus:bg-pink-500/20 focus:text-pink-300">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="md:hidden">
                  <button onClick={() => setIsMenuOpen(true)} className="text-gray-300 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            navItems={navItems}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onClose={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;