'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import useAuthStore from '@/app/hooks/useAuthStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Notes', path: '/notes' },
    { name: 'Flashcards', path: '/flashcards' },
    { name: 'Daily Review', path: '/daily-review' },
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">StudyAI</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.path
                    ? 'bg-indigo-700 text-white'
                    : 'text-white hover:bg-indigo-500'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="relative ml-3 flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="flex items-center text-sm font-medium text-white hover:text-gray-200"
                >
                  <FiUser className="mr-1" />
                  {user?.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-white hover:text-gray-200"
                >
                  <FiLogOut className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-500 focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-indigo-600">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated && navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.path
                    ? 'bg-indigo-700 text-white'
                    : 'text-white hover:bg-indigo-500'
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;