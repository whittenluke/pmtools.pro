import type { ErrorSeverity } from '@/stores/error';

interface ErrorReport {
  message: string;
  severity: ErrorSeverity;
  timestamp: number;
  context?: Record<string, unknown>;
  stack?: string;
  componentStack?: string;
  userId?: string;
  sessionId?: string;
}

class ErrorReportingService {
  private static instance: ErrorReportingService;
  private initialized: boolean = false;
  private queue: ErrorReport[] = [];
  private readonly MAX_QUEUE_SIZE = 100;
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds

  private constructor() {
    // Start periodic flush
    setInterval(() => this.flush(), this.FLUSH_INTERVAL);

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush());
    }
  }

  public static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  public initialize(config: { 
    userId?: string;
    sessionId?: string;
  }) {
    this.initialized = true;
    // Add initialization logic for your error reporting service
    console.log('Error reporting initialized with config:', config);
  }

  public captureError(error: Error | string, options: {
    severity: ErrorSeverity;
    context?: Record<string, unknown>;
    componentStack?: string;
  }) {
    const errorReport: ErrorReport = {
      message: error instanceof Error ? error.message : error,
      severity: options.severity,
      timestamp: Date.now(),
      context: options.context,
      stack: error instanceof Error ? error.stack : undefined,
      componentStack: options.componentStack,
    };

    this.queueError(errorReport);

    // Immediately flush for high severity errors
    if (options.severity === 'high' || options.severity === 'critical') {
      this.flush();
    }
  }

  private queueError(error: ErrorReport) {
    this.queue.push(error);

    // If queue is too large, remove oldest errors
    if (this.queue.length > this.MAX_QUEUE_SIZE) {
      this.queue = this.queue.slice(-this.MAX_QUEUE_SIZE);
    }
  }

  private async flush() {
    if (!this.initialized || this.queue.length === 0) return;

    try {
      // Group errors by severity for batch processing
      const errorsByType = this.queue.reduce((acc, error) => {
        if (!acc[error.severity]) {
          acc[error.severity] = [];
        }
        acc[error.severity].push(error);
        return acc;
      }, {} as Record<ErrorSeverity, ErrorReport[]>);

      // Process each severity group
      for (const [severity, errors] of Object.entries(errorsByType)) {
        await this.sendErrors(errors as ErrorReport[]);
      }

      // Clear the queue after successful send
      this.queue = [];
    } catch (error) {
      console.error('Failed to flush errors:', error);
    }
  }

  private async sendErrors(errors: ErrorReport[]) {
    // Implementation would depend on your error reporting service
    // This is a placeholder that logs to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Report Batch');
      errors.forEach(error => {
        console.log('Error:', {
          message: error.message,
          severity: error.severity,
          timestamp: new Date(error.timestamp).toISOString(),
          context: error.context,
          stack: error.stack,
        });
      });
      console.groupEnd();
    } else {
      // In production, you would send to your error reporting service
      // await fetch('your-error-reporting-endpoint', {
      //   method: 'POST',
      //   body: JSON.stringify(errors),
      // });
    }
  }
}

export const errorReporting = ErrorReportingService.getInstance(); 