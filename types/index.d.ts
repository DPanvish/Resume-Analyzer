// This file contains the declaration of types related to index.ts file

interface Job {
    title: string;
    description: string;
    location: string;
    requiredSkills: string[];
}

interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}

interface Feedback {
    overallScore: number;
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    variant?: "primary" | "secondary" | "ghost" | "outline" | "link" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
    asChild?: boolean;
}

interface SectionHeaderProps {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    className?: string;
}

interface EmptyStateProps {
    icon?: React.ReactNode;
    message: React.ReactNode;
    cta?: React.ReactNode;
    className?: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

type ToastType = "success" | "error" | "info";

interface ToastMessage {
    id: number,
    message: string,
    type: ToastType,
}

interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
}