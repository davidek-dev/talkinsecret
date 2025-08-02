
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

  return (
    <div className="block lg:hidden sticky top-0 z-[1001] w-full">
      <div className="w-full h-[100px] flex items-center justify-start px-4 ">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <div className="ml-0 text-white h-24 w-24 flex items-center justify-center cursor-pointer">
              <Menu size={30} />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-black/90 backdrop-blur-md text-white border-r-gray-700 p-0 z-[1002]" style={{position: 'fixed', height: '100vh', overflow: 'hidden'}}>
            <div className="h-full flex flex-col">
              {/* Sheet Header mit Close-X */}
              <div className="flex items-center justify-end h-[100px] px-4 backdrop-blur sticky top-0 z-10">
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
              <div className=" mb-auto mt-auto pb-6">
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
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" ><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.402 3.635 1.37c-.967.967-1.24 2.14-1.298 3.417C2.013 6.332 2 6.741 2 12c0 5.259.013 5.668.072 6.948.058 1.277.331 2.45 1.298 3.417.967.967 2.14 1.24 3.417 1.298C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.277-.058 2.45-.331 3.417-1.298.967-.967 1.24-2.14 1.298-3.417.059-1.28.072-1.689.072-6.948 0-5.259-.013-5.668-.072-6.948-.058-1.277-.331-2.45-1.298-3.417-.967-.967-2.14-1.24-3.417-1.298C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
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
    </div>
  );
};

export default MobileNav;
