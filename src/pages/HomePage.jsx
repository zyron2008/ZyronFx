import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, BarChart, Shield, Youtube, Send, Facebook } from 'lucide-react';
import Seo from '@/components/Seo';
import HeroImage from '@/components/HeroImage';

const SocialIcon = ({ icon: Icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors"
  >
    <Icon className="w-6 h-6" />
  </a>
);

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Seo 
        title="Profitix Academy" 
        description="Elevate your trading with powerful analytics and institutional-grade tools. Join a community dedicated to mastering the markets." 
      />
      <div className="min-h-screen w-full overflow-hidden relative">
        <header className="absolute top-0 left-0 right-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://i.imageupload.app/ff82f4c309a3a7811e2d.png" 
                  alt="PROFITIX Logo" 
                  className="h-10 w-10 object-contain" 
                />
                <span className="font-anton text-2xl font-bold text-white tracking-wider">PROFITIX</span>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={() => navigate('/login')} variant="ghost" className="text-white hover:bg-white/10 hidden sm:inline-flex">
                  Member Login
                </Button>
                <Button onClick={() => navigate('/signup')} className="bg-brand-pink text-primary-foreground font-semibold transform hover:scale-105 transition-transform hover:bg-pink-700">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-20">
          <section className="min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-4xl"
            >
              <div className="mb-8">
                <HeroImage />
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
                PROFITIX ACADEMY
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Elevate your trading with powerful analytics and institutional-grade tools. Join a community dedicated to mastering the markets.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-10 flex justify-center"
              >
                <Button
                  onClick={() => navigate('/signup')}
                  size="lg"
                  className="text-lg font-semibold bg-brand-white text-primary-foreground shadow-lg shadow-blue-800/20 transform hover:scale-105 transition-transform duration-300 hover:bg-blue-700"
                >
                  Join Community <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </section>

          <section id="about" className="py-20 px-4 bg-black/20 backdrop-blur-lg">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-4xl font-bold text-white mb-4">About Us</h2>
                <p className="text-gray-300 mb-6">
                  Whitespace is more than just a platform; it's a thriving community of traders committed to excellence. We provide the tools, knowledge, and support network needed to navigate the complexities of financial markets successfully.
                </p>
                <p className="text-gray-300 mb-8">
                  For a deeper dive into our mission, exclusive content, and to become a core part of our community, check out our Patreon.
                </p>
                <Button 
                  onClick={() => window.open('https://www.patreon.com/cw/WHITESPACE905', '_blank')}
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  Explore our Patreon <Shield className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="bg-black/30 border border-white/10 rounded-xl p-8"
              >
                <div className="grid grid-cols-2 gap-8 text-center">
                    <div className="text-center">
                      <Zap className="mx-auto w-10 h-10 text-brand-sky-blue mb-2" />
                      <h4 className="text-xl font-bold text-white">Real-Time Data</h4>
                      <p className="text-sm text-gray-400">Live feeds, calendars, and sentiment analysis.</p>
                    </div>
                    <div className="text-center">
                      <BarChart className="mx-auto w-10 h-10 text-brand-sky-blue mb-2" />
                      <h4 className="text-xl font-bold text-white">Advanced Tools</h4>
                      <p className="text-sm text-gray-400">Macro analysis, volatility, and rate trackers.</p>
                    </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        
        <footer className="relative z-20 py-8 px-4 border-t border-white/10 bg-black/20 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Profitix Academy of Bussiness Education. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <SocialIcon icon={Youtube} href="https://www.youtube.com/@WhitespaceTradingCommunity" />
              <SocialIcon icon={Facebook} href="https://www.facebook.com/people/WhiteSpace_Forex/" />
              <SocialIcon icon={Send} href="https://wa.link/e5ot27" />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;