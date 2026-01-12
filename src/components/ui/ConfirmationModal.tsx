import React from "react";
import { Button } from "./Button";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "primary" | "secondary" | "danger" | "warning" | "success" | "ghost";
    isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary",
    isLoading = false,
}) => {
    if (!isOpen) return null;

    // Handle click outside to dismiss
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-opacity animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-scale-in">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-full ${variant === "danger" ? "bg-red-100 text-red-600" :
                            variant === "warning" ? "bg-yellow-100 text-yellow-600" :
                                "bg-primary-100 text-primary-600"
                            }`}>
                            <AlertTriangle size={24} />
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant={variant === "danger" ? "error" : variant === "warning" ? "warning" : "primary"}
                            onClick={onConfirm}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                    Processing...
                                </div>
                            ) : (
                                confirmText
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
