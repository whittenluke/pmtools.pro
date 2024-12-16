'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth';
import { motion } from 'framer-motion';
import { HiMail, HiInformationCircle } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Alert } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import ReCAPTCHA from 'react-google-recaptcha';

// Email regex pattern for basic validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password requirements
const PASSWORD_REQUIREMENTS = [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'At least one uppercase letter', regex: /[A-Z]/ },
  { label: 'At least one number', regex: /[0-9]/ },
  { label: 'At least one special character', regex: /[^A-Za-z0-9]/ },
];

const SocialAuth = dynamic(
  () => import('./SocialAuth').then(mod => ({ default: mod.SocialAuth })),
  {
    loading: () => (
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-9 rounded-md bg-muted animate-pulse" />
        ))}
      </div>
    ),
    ssr: false
  }
);

export function AuthForm() {
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState(0);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showRequirements, setShowRequirements] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);
  const [lastResetRequest, setLastResetRequest] = React.useState(0);
  const [requireCaptcha, setRequireCaptcha] = React.useState(false);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const { signIn, signUp, resetPassword, loading, error, clearError } = useAuthStore();
  const searchParams = useSearchParams();
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);
  const [verificationSent, setVerificationSent] = React.useState(false);

  // Handle status messages
  const getStatusMessage = () => {
    const status = searchParams.get('message');
    switch (status) {
      case 'verification-email-sent':
        return {
          type: 'success',
          message: 'Verification email sent! Please check your inbox and spam folder.'
        };
      case 'password-updated':
        return {
          type: 'success',
          message: 'Password successfully updated. You can now sign in with your new password.'
        };
      case 'email-verified':
        return {
          type: 'success',
          message: 'Email verified successfully! You can now sign in.'
        };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  const validateEmail = (email: string) => {
    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    PASSWORD_REQUIREMENTS.forEach(({ regex }) => {
      if (regex.test(pass)) strength += 25;
    });
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) validateEmail(newEmail);
  };

  const trackAuthAttempt = async (success: boolean, action: 'signin' | 'reset') => {
    try {
      const response = await fetch('/api/auth/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success, action }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 429) {
          clearError();
          setEmailError(data.error);
          return false;
        }
      }

      const data = await response.json();
      setRequireCaptcha(data.requireCaptcha);
      return true;
    } catch (error) {
      console.error('Error tracking auth attempt:', error);
      return true; // Allow attempt on error
    }
  };

  const handleForgotPassword = async () => {
    clearError();
    
    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Rate limiting: one request per minute
    const now = Date.now();
    if (now - lastResetRequest < 60000) {
      const remainingSeconds = Math.ceil((60000 - (now - lastResetRequest)) / 1000);
      setEmailError(`Please wait ${remainingSeconds} seconds before requesting another reset`);
      return;
    }

    if (requireCaptcha && !captchaToken) {
      setEmailError('Please complete the CAPTCHA');
      return;
    }

    const canProceed = await trackAuthAttempt(false, 'reset');
    if (!canProceed) return;

    try {
      // Call our custom email API
      const response = await fetch('/api/auth/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'reset_password',
          email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send reset email');
      }

      await trackAuthAttempt(true, 'reset');
      setResetSent(true);
      setLastResetRequest(now);
      setCaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (err: any) {
      setEmailError(err.message || 'Failed to send reset email');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateEmail(email)) {
      return;
    }

    if (isSignUp && !acceptTerms) {
      return;
    }

    if (isSignUp && passwordStrength < 75) {
      clearError();
      return;
    }

    if (requireCaptcha && !captchaToken) {
      setEmailError('Please complete the CAPTCHA');
      return;
    }

    const canProceed = await trackAuthAttempt(false, 'signin');
    if (!canProceed) return;

    try {
      if (isSignUp) {
        // Call our custom email API for signup
        const response = await fetch('/api/auth/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'password': password
          },
          body: JSON.stringify({
            type: 'verify_email',
            email,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create account');
        }

        if (data.needsEmailVerification) {
          setVerificationSent(true);
        } else {
          // User is already verified, attempt sign in
          await signIn(email, password);
        }
      } else {
        await signIn(email, password);
      }
      
      await trackAuthAttempt(true, 'signin');
      setCaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (err: any) {
      if (err.message?.includes('User already registered')) {
        setEmailError('An account with this email already exists. Please sign in instead.');
      } else {
        setEmailError(err.message || 'Failed to process request');
      }
    }
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

      {statusMessage && (
        <Alert variant={statusMessage.type as "default" | "destructive" | "success"}>
          {statusMessage.message}
        </Alert>
      )}

      {verificationSent && (
        <Alert variant="success">
          Verification email sent! Please check your inbox to complete signup.
        </Alert>
      )}

      {resetSent && !isSignUp && (
        <Alert variant="success">
          Password reset instructions have been sent to your email.
        </Alert>
      )}

      <SocialAuth />

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
              onChange={handleEmailChange}
              className={cn("pl-10", emailError && "border-destructive")}
              placeholder="name@example.com"
              required
              disabled={loading}
            />
          </div>
          {emailError && (
            <p className="text-xs text-destructive mt-1">{emailError}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
              Password
              {isSignUp && (
                <button
                  type="button"
                  onClick={() => setShowRequirements(!showRequirements)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HiInformationCircle className="h-4 w-4" />
                </button>
              )}
            </label>
            {!isSignUp && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !email}
              >
                {loading ? 'Sending...' : 'Forgot password?'}
              </button>
            )}
          </div>
          {isSignUp && showRequirements && (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md space-y-1">
              <p className="font-medium mb-2">Password requirements:</p>
              {PASSWORD_REQUIREMENTS.map(({ label, regex }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    regex.test(password) ? "bg-success" : "bg-muted-foreground"
                  )} />
                  <span className={cn(
                    regex.test(password) && "text-success"
                  )}>{label}</span>
                </div>
              ))}
            </div>
          )}
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

        {requireCaptcha && (
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={(token) => setCaptchaToken(token)}
            />
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
          onClick={() => {
            setIsSignUp(!isSignUp);
            clearError();
          }}
          className="text-primary hover:underline disabled:opacity-50"
          disabled={loading}
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </motion.div>
  );
}