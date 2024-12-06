'use client'
import { useState, useEffect, useCallback } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import ChevronDownIcon from '@/svgs/ChevronDownIcon'
import FlagIcon from '@/svgs/FlagIcon'
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

// Add type declaration for google translate
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

interface UserSettings {
  darkMode: boolean;
  language: string;
}

export const Translate = () => {
  const { user } = useUser()
  const [mounted, setMounted] = useState(false);
  const [localSettings, setLocalSettings] = useState<UserSettings>({
    darkMode: false,
    language: 'english'
  });

  const userSettings = useQuery(api.settings.fetchSettings, { 
    userId: user?.id ?? "" 
  });

  const saveSettings = useMutation(api.settings.saveSettings);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userSettings');
      if (saved) {
        setLocalSettings(JSON.parse(saved));
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user?.id && userSettings) {
      const newSettings = {
        darkMode: userSettings.darkMode,
        language: userSettings.language
      };
      setLocalSettings(newSettings);
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
    }
  }, [userSettings, user?.id]);

  const initializeGoogleTranslate = useCallback(() => {
    removeGoogleTranslate();

    // Set the cookie for Turkish translation
    document.cookie = 'googtrans=/en/tr';
    document.cookie = `googtrans=/en/tr;domain=.${window.location.hostname}`;
    document.cookie = `googtrans=/en/tr;domain=${window.location.hostname}`;

    // Create and add the script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;

    // Define the initialization function
    window.googleTranslateElementInit = function() {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'tr',
        autoDisplay: false,
        layout: window.google.translate.TranslateElement.InlineLayout.NO_IFRAME
      });
    };

    // Add script to document
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (localSettings.language === 'turkish') {
      initializeGoogleTranslate();
    } else {
      removeGoogleTranslate();
    }
  }, [localSettings.language, initializeGoogleTranslate]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...localSettings, ...newSettings };
    setLocalSettings(updatedSettings);
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    
    if (user?.id) {
      try {
        await saveSettings({
          userId: user.id,
          darkMode: updatedSettings.darkMode,
          language: updatedSettings.language
        });
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    // First update settings in both localStorage and database
    const updatedSettings = { ...localSettings, language: newLanguage };
    setLocalSettings(updatedSettings);
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    
    if (user?.id) {
      try {
        await saveSettings({
          userId: user.id,
          darkMode: updatedSettings.darkMode,
          language: newLanguage
        });
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }

    if (newLanguage === 'english') {
      // Clear Google Translate cookies
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    } else if (newLanguage === 'turkish') {
      // Set Turkish translation cookie
      document.cookie = 'googtrans=/en/tr';
      document.cookie = `googtrans=/en/tr;domain=.${window.location.hostname}`;
      document.cookie = `googtrans=/en/tr;domain=${window.location.hostname}`;
    }

    // Reload the page for both languages
    window.location.reload();
  };

  const removeGoogleTranslate = () => {
    // Remove cookies
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;

    // Remove elements
    const elements = document.querySelectorAll('.goog-te-banner-frame, .skiptranslate, script[src*="translate.google"]');
    elements.forEach(el => el.remove());

    // Reset body
    document.body.style.top = '';
    document.body.classList.remove('translated-ltr');
    document.body.classList.remove('translated-rtl');

    // Reload the page to clear the translation
    if (window.location.hash === '#googtrans(en|tr)') {
      window.location.hash = '';
      window.location.reload();
    }
  };

  const displayLanguage = mounted ? (localSettings.language === 'english' ? 'English' : 'Türkçe') : 'English';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-primary-foreground transition-colors">
        <span>{displayLanguage}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('turkish')}>
          <div className="flex items-center gap-2">
            <FlagIcon className="h-4 w-4" />
            <span>Türkçe</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('english')}>
          <div className="flex items-center gap-2">
            <FlagIcon className="h-4 w-4" />
            <span>English</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
