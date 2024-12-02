import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">PMTools.pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/tools" className="text-gray-700 hover:text-gray-900">
              Tools
            </Link>
            <Link to="/account/dashboard" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/tools"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900"
              >
                Tools
              </Link>
              <Link
                to="/account/dashboard"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}