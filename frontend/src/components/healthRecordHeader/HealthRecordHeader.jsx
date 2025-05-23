import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const navLinks = [
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Career', href: '/career' },
];

const HealthRecordHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="w-full sticky top-0 bg-[#08123B] text-white shadow-md z-50">
      <div className="flex justify-between items-center px-6 md:px-16 py-3">
        <h1 className="text-2xl font-bold tracking-wide text-white">HealthValut</h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-blue-300 transition">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex space-x-4 ml-8">
            <a href="/login" className="px-5 py-2 hover:text-blue-300 transition font-medium">
              Login
            </a>
            <a
              href="/signup"
              className="px-5 py-2 bg-white text-[#08123B] rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Sign Up
            </a>
          </div>
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Slide-in Mobile Navigation */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-[#08123B] text-white z-40 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="px-6 py-6 flex flex-col space-y-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base font-medium hover:text-blue-300 transition"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/login"
            className="text-base font-medium hover:text-blue-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </a>
          <a
            href="/signup"
            className="bg-white text-[#08123B] mt-2 px-4 py-2 rounded-full text-center font-semibold hover:bg-gray-200 transition"
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </a>
        </div>
      </div>

      {/* Overlay to close mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default HealthRecordHeader;
