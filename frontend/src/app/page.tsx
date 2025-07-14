'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBook, FiCpu, FiFileText } from 'react-icons/fi';
import { FaBrain } from 'react-icons/fa';
import Button from './components/ui/Button';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Study Smarter with AI-Powered Notes
              </h1>
              <p className="text-xl mb-8">
                A multi-agent note-taking app that helps you organize, summarize, and master your study materials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" variant="secondary">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Login
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl border border-white/20">
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-lg mb-2">Machine Learning Notes</h3>
                  <p className="text-sm opacity-80">Neural networks are computational models inspired by the human brain...</p>
                </div>
                <div className="flex gap-3 mb-4">
                  <span className="bg-indigo-500/30 text-white text-xs px-2 py-1 rounded-full">AI</span>
                  <span className="bg-purple-500/30 text-white text-xs px-2 py-1 rounded-full">Machine Learning</span>
                  <span className="bg-blue-500/30 text-white text-xs px-2 py-1 rounded-full">Neural Networks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-70">Last updated: 2 hours ago</span>
                  <div className="flex gap-2">
                    <button className="p-1 rounded-full bg-white/20 hover:bg-white/30">
                      <FiBook size={16} />
                    </button>
                    <button className="p-1 rounded-full bg-white/20 hover:bg-white/30">
                      <FiCpu size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Supercharge Your Learning</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our multi-agent system works together to help you organize, understand, and remember your study materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <FiFileText className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Note Organization</h3>
              <p className="text-gray-600">
                Upload notes, PDFs, and images. Organize them by subject and access them from anywhere.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FiCpu className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Summaries</h3>
              <p className="text-gray-600">
                Get instant summaries of your notes and documents. Extract key concepts and ideas automatically.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FaBrain className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intelligent Flashcards</h3>
              <p className="text-gray-600">
                Generate flashcards from your notes with spaced repetition to optimize your learning and retention.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Study Experience?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of students who are studying smarter, not harder, with our AI-powered study assistant.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
