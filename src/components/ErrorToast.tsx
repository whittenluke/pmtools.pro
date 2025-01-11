import { useEffect } from 'react';
import { AlertCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useErrorStore, ErrorSeverity } from '@/stores/error';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const severityConfig = {
  low: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200',
    titleClass: 'text-blue-800',
  },
  medium: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 border-yellow-200',
    titleClass: 'text-yellow-800',
  },
  high: {
    icon: AlertCircle,
    className: 'bg-red-50 border-red-200',
    titleClass: 'text-red-800',
  },
  critical: {
    icon: XCircle,
    className: 'bg-red-100 border-red-300',
    titleClass: 'text-red-900',
  },
};

function ErrorToast() {
  const { errors, removeError, retryOperation } = useErrorStore();

  // Sort errors by severity and timestamp
  const sortedErrors = [...errors].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    return severityDiff === 0 ? b.timestamp - a.timestamp : severityDiff;
  });

  return (
    <ToastProvider>
      {sortedErrors.map((error) => {
        const config = severityConfig[error.severity];
        const Icon = config.icon;

        return (
          <Toast
            key={error.id}
            className={cn(
              'flex items-start gap-3 p-3',
              config.className
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <div className="flex-1 space-y-1">
              <ToastTitle className={cn('text-sm font-medium', config.titleClass)}>
                {error.severity === 'critical' ? 'Critical Error' : 'Error'}
              </ToastTitle>
              <ToastDescription className="text-sm">
                {error.message}
              </ToastDescription>
              {error.retry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => retryOperation(error.id)}
                  className="mt-2"
                >
                  Retry
                </Button>
              )}
            </div>
            <ToastClose onClick={() => removeError(error.id)} />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

export function ErrorToastContainer() {
  const { errors } = useErrorStore();

  // Only mount the provider when there are errors
  if (errors.length === 0) return null;

  return <ErrorToast />;
} 