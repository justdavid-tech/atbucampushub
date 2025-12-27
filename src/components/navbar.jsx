import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', hasDropdown: false },
    {
      name: 'News',
      path: '/news',
      hasDropdown: true,
      items: [
        { name: 'Announcement', path: '/announcement' },
        { name: 'Events', path: '/events' },
        { name: 'Academics', path: '/academics' },
        { name: 'Sports', path: '/sports' },
        { name: 'Entertainments', path: '/entertainments' }
      ]
    },
    { name: 'Confessions', path: '/confessions', hasDropdown: false },
    {
      name: 'Marketplace',
      path: '/marketplace',
      hasDropdown: true,
      items: [
        { name: 'All Products', path: '/marketplace' },
        { name: 'Phones & Gadgets', path: '/marketplace/phones' },
        { name: 'Computer & Accessories', path: '/marketplace/computers' },
        { name: 'Hostel Items', path: '/marketplace/hostel-items' },
        { name: 'Food & Snacks', path: '/marketplace/food' },
        { name: 'Services (Hair, Makeup, Laundry)', path: '/marketplace/services' },
        { name: 'Clothes & Thrift', path: '/marketplace/clothes' }
      ]
    },
    {
      name: 'Forum',
      path: '/forum',
      hasDropdown: true,
      items: [
        { name: 'All Forums', path: '/forum' },
        { name: 'Department Groups', path: '/forum/departments' },
        { name: 'Hostel Groups', path: '/forum/hostels' },
        { name: 'Buy and Sell Chat', path: '/forum/buy-sell' },
        { name: 'Event Chats', path: '/forum/events' }
      ]
    },
    {
      name: 'Resources',
      path: '/resources',
      hasDropdown: true,
      items: [
        { name: 'Hostel Finder', path: '/hostels' },
        { name: 'Lost & Found', path: '/lost-and-found' }
      ]
    }
  ];

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleLogout = () => {
    signout();
    navigate('/');
    setIsMobileMenuOpen(false);
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
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-white">AtbuHub</span>
              <span className="text-[0.65rem] tracking-widest text-[hsl(var(--primary))] uppercase">
                Campus Portal
              </span>
            </div>
          </Link>

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
                            <Link
                              key={i}
                              to={sub.path}
                              className="block px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      {item.name}
                    </Link>
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
            
            {/* Conditional Auth Buttons */}
            {isAuthenticated() ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <User className="w-4 h-4 text-[hsl(var(--primary))]" />
                  <span className="text-sm text-white">{user?.fullName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full border border-white/10 text-sm text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  state={{ page: 'signin' }}
                  className="px-4 py-2 rounded-full border border-white/10 text-sm text-white hover:bg-white/10"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  state={{ page: 'signup' }}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
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
                        <Link
                          key={i}
                          to={sub.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-gray-400 hover:text-white"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 text-lg text-white rounded-xl hover:bg-white/5"
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}

          <div className="pt-6 space-y-3">
            {isAuthenticated() ? (
              <>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <User className="w-5 h-5 text-[hsl(var(--primary))]" />
                  <span className="text-white">{user?.fullName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-white/20 rounded-xl text-white hover:bg-white/10"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  state={{ page: 'signin' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3 border border-white/20 rounded-xl text-white"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  state={{ page: 'signup' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
