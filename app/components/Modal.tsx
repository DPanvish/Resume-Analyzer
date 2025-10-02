import React, { useEffect, useRef} from 'react'
import { createPortal } from "react-dom"

const Modal = ({isOpen, onClose, children, className = ""}: ModalProps) => {

    const modalRef = useRef<HTMLDivElement>(null);

    // Effect to handle "Escape key press for closing the modal
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if(event.key === "Escape"){
                onClose();
            }
        };

        if(isOpen){
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen, onClose]);

    if(!isOpen){
        return null;
    }

    // We use a portal to render the modal at the top level of the DOM
    return createPortal(
        <div
            className="modal-backdrop"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div ref={modalRef} className={`modal-content ${className}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close-button" aria-label="Close modal">
                    &times;
                </button>
                {children}
            </div>
        </div>,
        document.body
    )
}
export default Modal
