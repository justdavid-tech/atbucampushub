import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Home', href: '#' },
        { name: 'News & Updates', href: '#' },
        { name: 'Confessions', href: '#' },
        { name: 'Marketplace', href: '#' },
        { name: 'Forum', href: '#' },
        { name: 'Events Calendar', href: '#' }
      ]
    },
    {
      title: 'Marketplace',
      links: [
        { name: 'All Products', href: '#' },
        { name: 'Phones & Gadgets', href: '#' },
        { name: 'Computer & Accessories', href: '#' },
        { name: 'Hostel Items', href: '#' },
        { name: 'Food & Snacks', href: '#' },
        { name: 'Services', href: '#' },
        { name: 'Clothes & Thrift', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Hostel Finder', href: '#' },
        { name: 'Lost & Found', href: '#' },
        { name: 'Study Groups', href: '#' },
        { name: 'Campus Map', href: '#' },
        { name: 'Academic Resources', href: '#' },
        { name: 'Help Center', href: '#' }
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Department Groups', href: '#' },
        { name: 'Hostel Groups', href: '#' },
        { name: 'Buy & Sell Chat', href: '#' },
        { name: 'Event Chats', href: '#' },
        { name: 'Student Stories', href: '#' },
        { name: 'Blog', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Contact Us', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Community Guidelines', href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-500' }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(210,45%,8%)] text-gray-300 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--primary))]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[hsl(var(--secondary))]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20"></div>

      <div className="relative">
        {/* Newsletter Section */}
        <div className="border-b border-white/10">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                  Stay Updated with Campus News
                </h3>
                <p className="text-gray-400">
                  Get the latest updates, announcements, and exclusive offers delivered to your inbox.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your ATBU email"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(var(--primary))] focus:bg-white/10 transition-all duration-300"
                  />
                </div>
                <button className="group relative px-8 py-4 bg-[hsl(var(--primary))] text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,45,86,0.4)] whitespace-nowrap">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Subscribe
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <a href="#" className="inline-block mb-6">
                <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
                  Atbu CampusHub
                </span>
              </a>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your number one student platform. Connecting ATBU students to campus life, opportunities, and each other.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${social.color} hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index} className="col-span-1">
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Email Us</p>
                  <a href="mailto:support@atbucampushub.com" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors text-sm">
                    support@atbucampushub.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--secondary))]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[hsl(var(--secondary))]" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Call Us</p>
                  <a href="tel:+2348012345678" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors text-sm">
                    +234 801 234 5678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Location</p>
                  <p className="text-gray-400 text-sm">
                    ATBU Campus, Bauchi<br />Bauchi State, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-gray-400">
                <p>© {currentYear} Atbu CampusHub. All rights reserved.</p>
              1</div>

              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">
                  Cookie Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}