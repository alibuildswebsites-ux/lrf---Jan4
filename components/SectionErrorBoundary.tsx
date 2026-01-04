import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SectionErrorBoundary extends Component<Props, State> {
  // Explicitly declare props to ensure TypeScript recognizes it on the class instance
  declare props: Readonly<Props>;

  state: State = {
    hasError: false
  };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in section:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-gray-50/50 border-y border-gray-100 min-h-[300px]">
           <div className="bg-red-50 p-4 rounded-full mb-4 ring-8 ring-red-50/50">
             <AlertCircle className="text-red-400 w-6 h-6" />
           </div>
           <h3 className="text-gray-900 font-bold text-lg mb-2">
             Unable to load this section
           </h3>
           <p className="text-gray-500 mb-6 max-w-sm text-base leading-relaxed">
             We encountered an issue loading this part of the page. It might be a network connectivity problem.
           </p>
           <button 
             onClick={this.handleReload}
             className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:border-brand hover:text-brand transition-all shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
           >
             <RefreshCw size={16} />
             Reload Page
           </button>
        </div>
      );
    }

    return this.props.children;
  }
}
