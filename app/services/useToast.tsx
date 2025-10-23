import React, {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {createPortal} from "react-dom";
import Toast from "~/components/Toast";

type ToastContextType = {
    addToast: (message: string, type: ToastType) => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({children} : {children: React.ReactNode}) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // useCallback is used to ensure that the addToast function is not recreated on every render
    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();

        setToasts(prevToasts => [...prevToasts, {id, message, type}]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <ToastContext.Provider value={{addToast}}>
            {children}
            {isMounted && createPortal(
                <div className="toast-container">
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} onDismiss={() => removeToast(toast.id)} />
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    )
}

const useToast = () => {
    const context = useContext(ToastContext);

    if(!context){
        throw new Error("useToast must be used within a ToastProvider");
    }

    return {
        success: (message: string) => context.addToast(message, "success"),
        error: (message: string) => context.addToast(message, "error"),
        info: (message: string) => context.addToast(message, "info"),
    };
}
export default useToast
