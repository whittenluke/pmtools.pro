import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wider uppercase">
              Tools
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/tools/calculator" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Calculator
                </Link>
              </li>
              <li>
                <Link to="/tools/decision-matrix" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Decision Matrix
                </Link>
              </li>
              <li>
                <Link to="/tools/kanban" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Kanban Board
                </Link>
              </li>
              <li>
                <Link to="/tools/goals" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Goal Tracker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-center text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} PMTools.pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}