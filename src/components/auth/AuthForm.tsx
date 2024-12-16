'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth';
import { motion } from 'framer-motion';
import { FaGoogle, FaGithub, FaMicrosoft } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Alert } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

export function AuthForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState(0);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { signIn, signUp, signInWithProvider, loading, error } = useAuthStore();

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.match(/[A-Z]/)) strength += 25;
    if (pass.match(/[0-9]/)) strength += 25;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && !acceptTerms) {
      return;
    }
    if (isSignUp) {
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github' | 'microsoft') => {
    await signInWithProvider(provider);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-sm space-y-6 w-full"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-muted-foreground">
          {isSignUp 
            ? 'Enter your details to get started with PMTools' 
            : 'Enter your credentials to access your workspace'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialAuth('google')}
          className="w-full"
          disabled={loading}
        >
          <FaGoogle className="mr-2" />
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialAuth('github')}
          className="w-full"
          disabled={loading}
        >
          <FaGithub className="mr-2" />
          GitHub
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialAuth('microsoft')}
          className="w-full"
          disabled={loading}
        >
          <FaMicrosoft className="mr-2" />
          Microsoft
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <div className="relative">
            <HiMail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              placeholder="name@example.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              className="pr-20"
              placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {isSignUp && password && (
            <div className="space-y-2">
              <Progress value={passwordStrength} className="h-1" />
              <p className={cn(
                "text-xs",
                passwordStrength < 50 ? "text-destructive" : 
                passwordStrength < 75 ? "text-warning" : "text-success"
              )}>
                {passwordStrength < 50 ? "Weak" : 
                 passwordStrength < 75 ? "Good" : "Strong"} password
              </p>
            </div>
          )}
        </div>

        {isSignUp && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                disabled={loading}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            {error.message}
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading || (isSignUp && !acceptTerms)}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isSignUp ? 'Creating account...' : 'Signing in...'}
            </span>
          ) : (
            isSignUp ? 'Create account' : 'Sign in'
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary hover:underline disabled:opacity-50"
          disabled={loading}
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </motion.div>
  );
}