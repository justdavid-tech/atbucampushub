import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Bell, Search } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#', hasDropdown: false },
    {
      name: 'News',
      href: '#',
      hasDropdown: true,
      items: [
        'General',
        'Announcement',
        'Events',
        'Academics',
        'Sports',
        'Entertainments'
      ]
    },
    { name: 'Confessions', href: '#', hasDropdown: false },
    {
      name: 'Marketplace',
      href: '#',
      hasDropdown: true,
      items: [
        'All Products',
        'Phones & Gadgets',
        'Computer & Accessories',
        'Hostel Items',
        'Food & Snacks',
        'Services (Hair, Makeup, Laundry)',
        'Clothes & Thrift'
      ]
    },
    {
      name: 'Forum',
      href: '#',
      hasDropdown: true,
      items: [
        'All Forums',
        'Department Groups',
        'Hostel Groups',
        'Buy and Sell Chat',
        'Event Chats'
      ]
    },
    {
      name: 'Resources',
      href: '#',
      hasDropdown: true,
      items: ['Hostel Finder', 'Lost & Found']
    }
  ];

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[hsl(var(--background))]/80 backdrop-blur-md shadow-lg border-b border-white/5'
          : 'bg-[hsl(var(--background))]'
      }`}
    >
      {/* FULL WIDTH CONTAINER */}
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-white">AtbuHub</span>
              <span className="text-[0.65rem] tracking-widest text-[hsl(var(--primary))] uppercase">
                Campus Portal
              </span>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center space-x-1 p-1 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
              {navItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.hasDropdown ? (
                    <div
                      onMouseEnter={() => setActiveDropdown(index)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          activeDropdown === index
                            ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`ml-1 h-4 w-4 transition-transform ${
                            activeDropdown === index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* DROPDOWN */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 w-64 transition-all ${
                          activeDropdown === index
                            ? 'opacity-100 visible'
                            : 'opacity-0 invisible'
                        }`}
                      >
                        <div className="bg-[hsl(var(--background))] rounded-2xl border border-white/10 backdrop-blur-xl p-2">
                          {item.items.map((sub, i) => (
                            <a
                              key={i}
                              href="#"
                              className="block px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
                            >
                              {sub}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[hsl(var(--primary))] rounded-full" />
            </div>
            <button className="px-4 py-2 rounded-full border border-white/10 text-sm text-white hover:bg-white/10">
              Login
            </button>
            <button className="px-5 py-2 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-sm font-semibold text-white">
              Sign Up
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-white/10 text-white"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden absolute top-20 left-0 w-full h-[calc(100vh-5rem)] bg-[hsl(var(--background))]/95 backdrop-blur-xl transition-all ${
          isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 py-6 space-y-2">
          {navItems.map((item, index) => (
            <div key={index} className="border-b border-white/5 pb-2">
              {item.hasDropdown ? (
                <>
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="w-full flex justify-between items-center text-left px-4 py-3 text-lg text-white rounded-xl hover:bg-white/5"
                  >
                    {item.name}
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        activeDropdown === index ? 'rotate-180 text-[hsl(var(--primary))]' : 'text-gray-400'
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all ${
                      activeDropdown === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pl-4 border-l border-white/10 ml-3">
                      {item.items.map((sub, i) => (
                        <a
                          key={i}
                          href="#"
                          className="block px-4 py-3 text-sm text-gray-400 hover:text-white"
                        >
                          {sub}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <a
                  href={item.href}
                  className="block w-full text-left px-4 py-3 text-lg text-white rounded-xl hover:bg-white/5"
                >
                  {item.name}
                </a>
              )}
            </div>
          ))}

          <div className="pt-6 space-y-3">
            <button className="w-full py-3 border border-white/20 rounded-xl text-white">
              Login
            </button>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white">
              Sign Up Free
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
