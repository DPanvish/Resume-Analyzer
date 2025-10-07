import React, {createContext, useCallback, useState} from 'react'

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({children} : {children: React.ReactNode}) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // useCallback is used to ensure that the addToast function is not recreated on every render
    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();

        setToasts(prevToasts => [...prevToasts, {id, message, type}]);
    }, []);

    const removerToast = useCallback((id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);
}

const UseToast = () => {
    return (
        <div>UseToast</div>
    )
}
export default UseToast
