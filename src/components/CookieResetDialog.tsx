import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CookieResetDialogProps {
  children: React.ReactNode;
}

export const CookieResetDialog: React.FC<CookieResetDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleResetCookies = () => {
    // Reset all cookie related localStorage items
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('allowAnalytics');
    localStorage.removeItem('allowYouTube');
    
    // Close dialog
    setOpen(false);
    
    // Reload the page to homepage
    window.location.href = '/';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Reset Cookie Preferences</DialogTitle>
          <DialogDescription className="text-gray-300">
            This will reset all your cookie preferences and reload the page. You will be asked again to choose your cookie preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleResetCookies}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Reset Cookies
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
