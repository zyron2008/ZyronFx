import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Send, Loader2 } from 'lucide-react';
import Seo from '@/components/Seo';

const ContactPage = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [name, setName] = useState(profile?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !message) {
            toast({ title: 'Incomplete Form', description: 'Please fill out all fields.', variant: 'destructive' });
            return;
        }
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([{ name, email, message }]);

            if (error) {
                throw error;
            }

            toast({ title: 'Message Sent!', description: "We've received your message and will get back to you soon." });
            setMessage('');

        } catch (error) {
            toast({ title: 'Error', description: `Could not send message: ${error.message}`, variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Seo 
                title="Contact Us" 
                description="Have a question or feedback? Send us a message and we'll get back to you soon." 
            />
            <div className="min-h-screen">
                <Header />
                <main className="pt-32 p-4 sm:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
                            <h1 className="text-4xl font-bold text-white mb-2 text-center">Contact Us</h1>
                            <p className="text-center text-gray-400 mb-8">Have a question or feedback? Let us know!</p>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input 
                                            id="name" 
                                            type="text" 
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea 
                                        id="message" 
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder="Your message..."
                                        rows={5}
                                    />
                                </div>
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90 transition-opacity">
                                    {isSubmitting ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                                    ) : (
                                        <><Send className="mr-2 h-4 w-4" /> Send Message</>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default ContactPage;