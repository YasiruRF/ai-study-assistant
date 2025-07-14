'use client';

import Link from 'next/link';
import { FiGithub, FiTwitter, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">StudyAI</h3>
            <p className="text-gray-300">
              A multi-agent note-taking and study assistant powered by AI.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/notes" className="text-gray-300 hover:text-white">
                  Notes
                </Link>
              </li>
              <li>
                <Link href="/flashcards" className="text-gray-300 hover:text-white">
                  Flashcards
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FiGithub size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FiTwitter size={24} />
              </a>
              <a
                href="mailto:contact@studyai.com"
                className="text-gray-300 hover:text-white"
              >
                <FiMail size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} StudyAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;