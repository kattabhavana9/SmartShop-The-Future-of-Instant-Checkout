import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

// Global toast state management
let toastCounter = 0;
let toastListeners: ((toasts: ToastProps[]) => void)[] = [];
let activeToasts: ToastProps[] = [];

// Function to add a toast
export const toast = {
  success: (message: string, duration = 3000) => {
    const id = `toast-${++toastCounter}`;
    const newToast = { id, type: 'success', message, duration } as ToastProps;
    activeToasts = [...activeToasts, newToast];
    toastListeners.forEach(listener => listener(activeToasts));
    
    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, duration);
    }
    return id;
  },
  
  error: (message: string, duration = 3000) => {
    const id = `toast-${++toastCounter}`;
    const newToast = { id, type: 'error', message, duration } as ToastProps;
    activeToasts = [...activeToasts, newToast];
    toastListeners.forEach(listener => listener(activeToasts));
    
    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, duration);
    }
    return id;
  },
  
  info: (message: string, duration = 3000) => {
    const id = `toast-${++toastCounter}`;
    const newToast = { id, type: 'info', message, duration } as ToastProps;
    activeToasts = [...activeToasts, newToast];
    toastListeners.forEach(listener => listener(activeToasts));
    
    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, duration);
    }
    return id;
  },
  
  dismiss: (id: string) => {
    activeToasts = activeToasts.filter(toast => toast.id !== id);
    toastListeners.forEach(listener => listener(activeToasts));
  }
};

// Toast component
export const Toast: React.FC<{ toast: ToastProps; onDismiss: (id: string) => void }> = ({ 
  toast, 
  onDismiss 
}) => {
  useEffect(() => {
    return () => {
      if (toast.duration && toast.duration > 0) {
        const timer = setTimeout(() => {
          onDismiss(toast.id);
        }, toast.duration);
        
        return () => clearTimeout(timer);
      }
    };
  }, [toast, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success-50 border-success-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div 
      className={`${getBgColor()} border rounded-lg shadow-lg p-4 flex items-start animate-slide-up max-w-md w-full`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-1 mr-2">
        <p className="text-sm font-medium text-gray-800">{toast.message}</p>
      </div>
      <button 
        onClick={() => onDismiss(toast.id)} 
        className="text-gray-400 hover:text-gray-500"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Toaster component that displays all active toasts
export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  
  useEffect(() => {
    const handleToastsChange = (newToasts: ToastProps[]) => {
      setToasts([...newToasts]);
    };
    
    toastListeners.push(handleToastsChange);
    
    return () => {
      toastListeners = toastListeners.filter(listener => listener !== handleToastsChange);
    };
  }, []);
  
  const handleDismiss = (id: string) => {
    toast.dismiss(id);
  };
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={handleDismiss} />
      ))}
    </div>
  );
};