import React from "react";
import { Link } from "react-router-dom";
import Button from "./Ui/Button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * Error Boundary component to catch JavaScript errors in child components
 * Provides a user-friendly fallback UI when errors occur
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console (could also send to error reporting service)
        console.error("Error Boundary caught an error:", error, errorInfo);
        this.setState({ errorInfo });
        
        // Optional: Send to error tracking service like Sentry
        // if (window.Sentry) {
        //     window.Sentry.captureException(error, { extra: errorInfo });
        // }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="flex min-h-[400px] items-center justify-center bg-slate-50 p-8">
                    <div className="max-w-md text-center">
                        {/* Error Icon */}
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>

                        {/* Error Message */}
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">
                            Something went wrong
                        </h2>
                        <p className="mb-6 text-gray-600">
                            {this.props.message || "We encountered an unexpected error. Please try again."}
                        </p>

                        {/* Error Details (Development only) */}
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mb-6 rounded-lg bg-gray-100 p-4 text-left">
                                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                    Error Details
                                </summary>
                                <pre className="mt-2 overflow-auto text-xs text-red-600">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button
                                variant="primary"
                                onClick={() => window.location.reload()}
                                iconLeft={<RefreshCw size={16} />}
                            >
                                Refresh Page
                            </Button>
                            <Link to="/">
                                <Button
                                    variant="outline"
                                    iconLeft={<Home size={16} />}
                                    onClick={this.handleReset}
                                >
                                    Go Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Higher-order component to wrap any component with error boundary
 */
export const withErrorBoundary = (WrappedComponent, fallback = null) => {
    return function WithErrorBoundary(props) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
};

export default ErrorBoundary;
