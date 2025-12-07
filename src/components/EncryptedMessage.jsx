import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck } from 'lucide-react';

const EncryptedMessage = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      toast({
        title: (
          <div className="flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5 text-green-400" />
            <span className="font-bold text-white">Protected Content</span>
          </div>
        ),
        description: "This site is encrypted for security.",
        className: 'bg-black/50 backdrop-blur-lg border-green-500/50 text-white',
      });
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [toast]);

  return null;
};

export default EncryptedMessage;