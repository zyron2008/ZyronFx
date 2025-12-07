import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, CornerDownLeft, AlertTriangle } from 'lucide-react';
import { useChat } from 'ai/react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();
  
  const { messages, input, handleInputChange, handleSubmit, error, isLoading } = useChat({
    api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    onError: (err) => {
      let description = "An unexpected error occurred. Please try again.";
      try {
        const parsedError = JSON.parse(err.message);
        if (parsedError.error) {
          description = parsedError.error;
        }
      } catch (e) {
        // Not a JSON error, use the original message if it's not too technical
        if (err.message) {
            description = err.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: "AI Chat Error",
        description: description,
      });
    },
  });

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const cardVariants = {
    closed: { opacity: 0, y: 50, scale: 0.9, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    open: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleOpen}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-pink-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/30"
      >
        <Bot size={32} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={cardVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed bottom-28 right-8 z-50 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-black/30 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-blue-500/20 border border-white/10 flex flex-col overflow-hidden"
          >
            <header className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Bot className="text-blue-400" />
                <h2 className="font-bold text-lg text-white">AI Assistant</h2>
              </div>
              <button onClick={toggleOpen} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </header>

            <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
              {messages.length === 0 && !isLoading && (
                 <div className="text-center text-gray-400 text-sm mt-8">
                  <p>Ask me anything about trading, market analysis, or how to use the tools on this platform.</p>
                 </div>
              )}
              {error && (
                <div className="flex items-start gap-3 text-red-400 bg-red-500/10 p-3 rounded-lg">
                  <AlertTriangle size={20} className="mt-1" />
                  <div>
                    <p className="font-bold">Chatbot Error</p>
                    <p className="text-sm">{error.message}</p>
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                  {m.role !== 'user' && <Bot className="w-6 h-6 flex-shrink-0 text-blue-400" />}
                  <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none'}`}>
                    <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3">
                   <Bot className="w-6 h-6 flex-shrink-0 text-blue-400" />
                   <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-2xl bg-white/10 text-gray-200 rounded-bl-none">
                     <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-0"></span>
                       <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></span>
                       <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></span>
                     </div>
                   </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
              <div className="relative">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask the AI..."
                  className="w-full bg-transparent border border-white/20 rounded-xl pl-4 pr-12 py-2 text-white placeholder:text-gray-500 focus:ring-blue-400 focus:ring-2 focus:outline-none"
                  disabled={!!error}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed" disabled={isLoading || !input || !!error}>
                  <Send size={20} />
                </button>
              </div>
               <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">Press <CornerDownLeft size={12}/> to send.</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;