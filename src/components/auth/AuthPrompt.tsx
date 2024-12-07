import { Link } from 'react-router-dom';

interface AuthPromptProps {
  returnTo: string;
}

export function AuthPrompt({ returnTo }: AuthPromptProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-white dark:bg-gray-900">
      <div className="max-w-md w-full mx-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Sign in Required
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          Please sign in to access this feature
        </p>
        <div className="flex flex-col gap-4">
          <Link
            to={`/login?returnTo=${returnTo}`}
            className="w-full px-4 py-2 text-center text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Sign In
          </Link>
          <Link
            to={`/signup?returnTo=${returnTo}`}
            className="w-full px-4 py-2 text-center text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
} 