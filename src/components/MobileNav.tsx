import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, X } from 'lucide-react';
import { SpotifyIcon, TiktokIcon } from './icons';


const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Hinweis: Die Klassen 'block' und 'lg:hidden' wurden entfernt, 
  // da die Sichtbarkeit jetzt von der übergeordneten Astro-Datei gesteuert wird.
  return (
    <div className="w-full">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            {/* Der Trigger-Button für das mobile Menü */}
            <div className="text-white h-24 w-24 flex items-center justify-center cursor-pointer" aria-label="Menü öffnen">
              <Menu size={30} />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-black/90 backdrop-blur-md text-white border-r-gray-700 p-0 z-[1002]" style={{position: 'fixed', height: '100vh', overflow: 'hidden'}}>
            <div className="h-full flex flex-col">
              {/* Sheet Header mit Close-X */}
              <div className="flex items-center justify-end h-[100px] px-4 sticky top-0 z-10">
                <div aria-label="Menü schließen" onClick={()=>setIsOpen(false)} className="text-white h-24 w-24 flex items-center justify-center cursor-pointer">
                  <X size={20}/>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="px-6 pt-3">
                <ul className="text-xl space-y-1">
                  <li><a href="#videos" onClick={handleLinkClick} className="block py-1">Videos</a></li>
                  <li><a href="#music" onClick={handleLinkClick} className="block py-1">Music</a></li>
                  <li><a href="#merch" onClick={handleLinkClick} className="block py-1">Merch</a></li>
                  <li><a href="#gigs" onClick={handleLinkClick} className="block py-1">Gigs</a></li>
                  <li><a href="#contact" onClick={handleLinkClick} className="block py-1">Contact</a></li>
                </ul>
              </div>

              {/* Bottom Section */}
              <div className="mt-auto pb-6">
                {/* Shop Button */}
                <div className="flex justify-center px-6 ">
                  <a href="https://7rhr40-c7.myshopify.com/" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-primary text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none px-32 pt-10 pb-10">Shop</Button>
                  </a>
                </div>
                {/* Social Icons */}
                <div className="grid grid-cols-2 grid-rows-2 gap-y-10 px-16 pt-14 place-items-center">
                  <a href="https://open.spotify.com/intl-de/artist/1MdTDN4vXdIXvmTMn3pLjQ?si=qLFKiOyNSfy6teRT4kvahw" target="_blank" rel="noopener noreferrer" title="Spotify">
                    <SpotifyIcon  width="20" height="20"/>
                  </a>
                  <a href="https://www.instagram.com/talkinsecret/" target="_blank" rel="noopener noreferrer" title="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                    </svg>
                  </a>
                  <a href="https://www.youtube.com/@talkingsecret6500" target="_blank" rel="noopener noreferrer" title="YouTube">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" ><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.458 3.5 12 3.5 12 3.5s-7.458 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.114 0 12 0 12s0 3.886.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.542 20.5 12 20.5 12 20.5s7.458 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.886 24 12 24 12s0-3.886-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://www.tiktok.com/@talkinsecret" target="_blank" rel="noopener noreferrer" title="TikTok">
                    <TiktokIcon width="20" height="20"/>
                  </a>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
    </div>
  );
};

export default MobileNav;
