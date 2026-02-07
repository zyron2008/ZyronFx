import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { ArrowRight, BarChart3, Calendar, Percent, Rss, TrendingUp, Zap, Lock } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

const ToolCard = ({ title, icon, gradient, isUnlocked, link }) => {
  const Icon = icon;
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isUnlocked) {
      if (link.startsWith('/')) {
        navigate(link);
      } else if (link !== '#') {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        toast({
          title: "🚧 Feature In Progress",
          description: "This tool is not yet implemented. Please check back later!",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You do not have access to this tool. Please contact an admin.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: isUnlocked ? -10 : 0, boxShadow: isUnlocked ? '0 20px 30px -10px rgba(0, 0, 0, 0.3)' : 'none' }}
      className={`relative rounded-3xl p-8 overflow-hidden group text-white bg-black/30 backdrop-blur-xl border border-white/10 ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={handleClick}
    >
      <div className={`absolute -top-12 -right-12 w-36 h-36 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out ${gradient} opacity-20`}></div>
      <div className="relative z-10">
        <div className={`inline-block p-4 rounded-2xl mb-4 ${gradient}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        {isUnlocked ? (
          <div className="flex items-center text-sm font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
            Open Tool <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </div>
        ) : (
          <div className="flex items-center text-sm font-semibold opacity-70">
            <Lock className="w-4 h-4 mr-2" /> Locked
          </div>
        )}
      </div>
      {!isUnlocked && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl flex items-center justify-center">
          <Lock className="w-12 h-12 text-white/50" />
        </div>}
    </motion.div>
  );
};

const ToolsPage = () => {
  const { profile } = useAuth();
  const tools = [
    { id: 'feed', title: 'NewsFeed', icon: Rss, gradient: 'bg-gradient-to-br from-pink-500 to-purple-600', accessKey: 'access_feed', link: '/tools/feed' },
    { id: 'economic-calendar', title: 'Economic Calendar', icon: Calendar, gradient: 'bg-gradient-to-br from-blue-500 to-teal-500', accessKey: 'access_economic_calendar', link: '/tools/economic-calendar' },
    { id: 'market-sentiment', title: 'Market Sentiment', icon: TrendingUp, gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600', accessKey: 'access_market_sentiment', link: '/tools/market-sentiment' },
    { id: 'macro-analysis', title: 'Macro Analysis', icon: BarChart3, gradient: 'bg-gradient-to-br from-red-500 to-orange-500', accessKey: 'access_macro_analysis', link: '/tools/macro-analysis' },
    { id: 'interest-rates', title: 'Interest Rates', icon: Percent, gradient: 'bg-gradient-to-br from-green-500 to-lime-500', accessKey: 'access_interest_rates', link: '/tools/interest-rates' },
    { id: 'implied-volatility', title: 'Implied Volatility', icon: Zap, gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500', accessKey: 'access_implied_volatility', link: '/tools/implied-volatility' },
  ];

  return (
    <div className="min-h-screen w-full bg-grid-pattern">
      <Header />
      <main className="pt-24">
        <div className="flex flex-col items-center justify-center p-4 sm:p-8 text-center bg-transparent">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight"
          >
            Trading Tools
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-12"
          >
            Access your suite of powerful trading analysis tools.
          </motion.p>
          
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <ToolCard
                key={tool.id} 
                title={tool.title} 
                icon={tool.icon} 
                gradient={tool.gradient}
                isUnlocked={profile?.[tool.accessKey]}
                link={tool.link}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ToolsPage;
