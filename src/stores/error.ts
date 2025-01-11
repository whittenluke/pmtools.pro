import { create } from 'zustand';
import { errorReporting } from '@/lib/errorReporting';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ErrorEvent {
  id: string;
  message: string;
  severity: ErrorSeverity;
  timestamp: number;
  context?: Record<string, unknown>;
  retry?: () => Promise<void>;
  componentStack?: string;
}

interface ErrorState {
  errors: ErrorEvent[];
  addError: (error: Omit<ErrorEvent, 'id' | 'timestamp'>) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  retryOperation: (id: string) => Promise<void>;
  initializeErrorReporting: (config: { userId?: string; sessionId?: string }) => void;
}

export const useErrorStore = create<ErrorState>()((set, get) => ({
  errors: [],

  initializeErrorReporting: (config) => {
    errorReporting.initialize(config);
  },

  addError: (error) => {
    const newError: ErrorEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...error,
    };

    // Report error to error reporting service
    errorReporting.captureError(error.message, {
      severity: error.severity,
      context: error.context,
      componentStack: error.componentStack,
    });

    set((state) => ({
      errors: [...state.errors, newError],
    }));

    // Automatically remove low severity errors after 5 seconds
    if (error.severity === 'low') {
      setTimeout(() => {
        get().removeError(newError.id);
      }, 5000);
    }
  },

  removeError: (id) => {
    set((state) => ({
      errors: state.errors.filter((error) => error.id !== id),
    }));
  },

  clearErrors: () => {
    set({ errors: [] });
  },

  retryOperation: async (id) => {
    const error = get().errors.find((e) => e.id === id);
    if (error?.retry) {
      try {
        await error.retry();
        get().removeError(id);
      } catch (e) {
        // If retry fails, update the error timestamp and report it
        const retryError = e instanceof Error ? e : new Error(String(e));
        errorReporting.captureError(retryError, {
          severity: error.severity,
          context: {
            ...error.context,
            retryAttempt: true,
            originalError: error.message,
          },
        });

        set((state) => ({
          errors: state.errors.map((error) =>
            error.id === id
              ? { ...error, timestamp: Date.now() }
              : error
          ),
        }));
      }
    }
  },
})); 