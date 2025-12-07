import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Calendar, Percent, Rss, TrendingUp, Zap } from 'lucide-react';

const Card = ({ title, icon, onClick, delay, gradient }) => {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -10, boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.3)' }}
      className={`relative rounded-xl p-6 cursor-pointer overflow-hidden group ${gradient} text-white`}
      onClick={onClick}
    >
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
      <div className="relative z-10">
        <Icon className="w-12 h-12 mb-4 opacity-80" />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-center text-sm font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
          Open Tool <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = ({ setActiveTab }) => {
  const tools = [
    { id: 'feed', title: 'NewsFeed', icon: Rss, gradient: 'bg-gradient-to-br from-pink-500 to-purple-600' },
    { id: 'economic-calendar', title: 'Economic Calendar', icon: Calendar, gradient: 'bg-gradient-to-br from-blue-500 to-teal-500' },
    { id: 'market-sentiment', title: 'Market Sentiment', icon: TrendingUp, gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600' },
    { id: 'macro-analysis', title: 'Macro Analysis', icon: BarChart3, gradient: 'bg-gradient-to-br from-red-500 to-orange-500' },
    { id: 'interest-rates', title: 'Interest Rates', icon: Percent, gradient: 'bg-gradient-to-br from-green-500 to-lime-500' },
    { id: 'implied-volatility', title: 'Implied Volatility', icon: Zap, gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 sm:p-8 text-center bg-transparent">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight"
      >
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-300">Profitix</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-12"
      >
        Your centralized hub for elite trading tools. Dive into the data, master the markets.
      </motion.p>
      
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <Card 
            key={tool.id} 
            title={tool.title} 
            icon={tool.icon} 
            onClick={() => setActiveTab(tool.id)}
            delay={0.3 + index * 0.1}
            gradient={tool.gradient}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;