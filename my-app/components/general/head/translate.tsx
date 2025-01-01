'use client'
import { useState, useEffect, useCallback } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import ChevronDownIcon from '@/svgs/ChevronDownIcon'
import FlagIcon from '@/svgs/FlagIcon'
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter, usePathname } from 'next/navigation'

// Add type declaration for google translate
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: (() => void) | undefined;
  }
}

interface UserSettings {
  darkMode: boolean;
  language: string;
}

export const Translate = () => {
  const router = useRouter();
  const pathname = usePathname();
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

  const removeGoogleTranslate = () => {
    try {
      // Remove cookies
      const domain = window.location.hostname;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;

      // Clear the translate element instead of removing it
      const translateElement = document.getElementById('google_translate_element');
      if (translateElement) {
        translateElement.innerHTML = '';
      }

      // Safely remove other Google Translate elements
      const elementsToRemove = [
        '.goog-te-banner-frame',
        '.skiptranslate',
        '#\\:1\\.container',
        '#goog-gt-tt',
        '.goog-te-menu-frame',
        '.VIpgJd-ZVi9od-l4eHX-hSRGPd'
      ];

      elementsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          try {
            el.remove(); // Using the safer remove() method
          } catch (e) {
            console.warn(`Failed to remove element: ${selector}`, e);
          }
        });
      });

      // Remove scripts and links
      ['script', 'link'].forEach(tagName => {
        const elements = document.querySelectorAll(`${tagName}[src*="translate.google"], ${tagName}[href*="translate.google"]`);
        elements.forEach(el => {
          try {
            el.remove();
          } catch (e) {
            console.warn(`Failed to remove ${tagName}`, e);
          }
        });
      });

      // Reset body styles
      if (document.body) {
        document.body.style.removeProperty('top');
        document.body.style.removeProperty('position');
        document.body.classList.remove('translated-ltr');
        document.body.classList.remove('translated-rtl');
      }

      // Remove iframes
      const iframes = document.getElementsByTagName('iframe');
      Array.from(iframes).forEach(iframe => {
        if (iframe.src.includes('translate.google')) {
          try {
            iframe.remove();
          } catch (e) {
            console.warn('Failed to remove translate iframe', e);
          }
        }
      });
    } catch (error) {
      console.error('Error removing Google Translate:', error);
    }
  };

  // Add router change handling
  useEffect(() => {
    // Clean up translation when pathname changes
    removeGoogleTranslate();
    
    // Reinitialize if needed
    if (localSettings.language === 'turkish') {
      const timer = setTimeout(() => {
        initializeGoogleTranslate();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, localSettings.language]);

  const initializeGoogleTranslate = useCallback(() => {
    try {
      // Clean up first
      removeGoogleTranslate();

      // Get or create the translate element
      let translateElement = document.getElementById('google_translate_element');
      if (!translateElement) {
        translateElement = document.createElement('div');
        translateElement.id = 'google_translate_element';
        translateElement.style.display = 'none';
        document.body.appendChild(translateElement);
      } else {
        translateElement.innerHTML = '';
      }

      // Set the cookies for Turkish translation
      const domain = window.location.hostname;
      document.cookie = 'googtrans=/en/tr; path=/';
      document.cookie = `googtrans=/en/tr; path=/; domain=${domain}`;
      document.cookie = `googtrans=/en/tr; path=/; domain=.${domain}`;

      // Define the initialization function
      window.googleTranslateElementInit = function() {
        try {
          const translate = new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'tr',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.NO_IFRAME
          }, 'google_translate_element');
        } catch (error) {
          console.error('Failed to initialize Google Translate:', error);
        }
      };

      // Remove any existing scripts first
      document.querySelectorAll('script[src*="translate.google"]').forEach(script => script.remove());

      // Add the new script
      const script = document.createElement('script');
      script.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&_=${Date.now()}`;
      script.async = true;
      script.onerror = () => console.error('Failed to load Google Translate script');
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error initializing Google Translate:', error);
    }
  }, []);

  // Modify the cleanup effect to be more thorough
  useEffect(() => {
    const cleanup = () => {
      try {
        removeGoogleTranslate();
        
        // Additional cleanup for any remaining elements
        const selectors = [
          '.goog-te-spinner-pos',
          '.goog-tooltip',
          '.goog-tooltip-content',
          '.goog-te-menu-value',
          '.goog-te-gadget',
          'link[href*="translate.googleapis.com"]'
        ];
        
        selectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            try {
              el.remove();
            } catch (e) {
              // Ignore removal errors
            }
          });
        });

        // Clear any translation-related styles
        const style = document.createElement('style');
        style.textContent = `
          .goog-te-banner-frame, .skiptranslate, #goog-gt-tt, .goog-te-spinner-pos {
            display: none !important;
          }
          body {
            top: 0px !important;
            position: static !important;
          }
        `;
        document.head.appendChild(style);
      } catch (error) {
        // Ignore cleanup errors
      }
    };

    // Run cleanup on unmount
    return cleanup;
  }, []);

  // Modify the language effect to handle navigation better
  useEffect(() => {
    if (!mounted) return;

    const handleTranslation = async () => {
      if (localSettings.language === 'turkish') {
        try {
          // Clean up first
          removeGoogleTranslate();
          // Wait a brief moment before initializing
          await new Promise(resolve => setTimeout(resolve, 100));
          await initializeGoogleTranslate();
        } catch (error) {
          console.error('Translation initialization error:', error);
        }
      } else {
        removeGoogleTranslate();
      }
    };

    handleTranslation();
  }, [localSettings.language, mounted, initializeGoogleTranslate]);

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
    try {
      // Clean up first
      removeGoogleTranslate();
      
      // Update settings
      const updatedSettings = { ...localSettings, language: newLanguage };
      setLocalSettings(updatedSettings);
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      
      if (user?.id) {
        await saveSettings({
          userId: user.id,
          darkMode: updatedSettings.darkMode,
          language: newLanguage
        });
      }

      if (newLanguage === 'english') {
        window.location.reload();
      } else if (newLanguage === 'turkish') {
        // Add a small delay before initializing
        setTimeout(() => {
          initializeGoogleTranslate();
        }, 100);
      }
    } catch (error) {
      console.error('Error changing language:', error);
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
