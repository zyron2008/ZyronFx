import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { ArrowRight, BookOpen, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Seo from '@/components/Seo';

const ActionCard = ({ title, description, icon, gradient, path, delay }) => {
  const Icon = icon;
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10, boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.3)' }}
      className="relative rounded-3xl p-8 overflow-hidden group text-white cursor-pointer bg-black/30 backdrop-blur-xl border border-white/10"
      onClick={() => navigate(path)}
    >
      <div className={`absolute -top-12 -right-12 w-36 h-36 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out ${gradient} opacity-20`}></div>
      <div className="relative z-10">
        <div className={`inline-block p-4 rounded-2xl mb-4 ${gradient}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-base text-white/70 mb-6">{description}</p>
        <div className="flex items-center text-sm font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
          Explore <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

const DashboardPage = () => {
  const { profile } = useAuth();
  
  const greetingName = profile?.full_name?.split(' ')[0] || profile?.email?.split('@')[0] || 'Market Reader';
  const hasMentorshipAccess = profile?.has_mentorship_access || profile?.role === 'admin';

  return (
    <>
      <Seo 
        title="Dashboard" 
        description="Your centralized hub for elite trading tools and resources. Access your tools and mentorship program." 
      />
      <div className="min-h-screen w-full">
        <Header />
        <main className="pt-24">
          <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 sm:p-8 text-center bg-transparent">
            <motion.div
              className="w-full max-w-5xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight"
              >
                Welcome back, <span className="capitalize text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-900">{greetingName}</span>!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-12"
              >
                Your centralized hub for elite trading tools and resources. What would you like to do today?
              </motion.p>
              
              <div className={`w-full max-w-4xl mx-auto grid grid-cols-1 ${hasMentorshipAccess ? 'md:grid-cols-2' : ''} gap-8 ${!hasMentorshipAccess ? 'md:max-w-sm' : ''}`}>
                <ActionCard
                  title="Trading Tools"
                  description="Access your suite of powerful trading analysis tools."
                  icon={Wrench}
                  gradient="bg-gradient-to-br from-blue-500 to-teal-500"
                  path="/tools"
                  delay={0.5}
                />
                {hasMentorshipAccess && (
                  <ActionCard
                    title="Mentorship Program"
                    description="Accelerate your journey with personalized guidance."
                    icon={BookOpen}
                    gradient="bg-gradient-to-br from-pink-500 to-purple-600"
                    path="/mentorship"
                    delay={0.6}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;