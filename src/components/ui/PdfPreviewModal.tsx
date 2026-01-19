import React from "react";
import { X, Download, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "./Button";
import axios from "axios";
import toast from "react-hot-toast";

interface PdfPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string;
    fileName: string;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
    isOpen,
    onClose,
    fileUrl,
    fileName,
}) => {
    if (!isOpen) return null;

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(fileUrl, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Download failed");
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <span className="text-red-600 font-bold text-xs">PDF</span>
                        </div>
                        <h3 className="font-bold text-gray-900 truncate">{fileName}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Open in new tab"
                        >
                            <ExternalLink size={20} />
                        </a>
                        <button
                            onClick={handleDownload}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download PDF"
                        >
                            <Download size={20} />
                        </button>
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 -z-10">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin" />
                            <p>Loading PDF Preview...</p>
                        </div>
                    </div>
                    <iframe
                        src={`${fileUrl}#toolbar=0`}
                        className="w-full h-full border-none"
                        title={fileName}
                    />
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t bg-gray-50 flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Close Preview
                    </Button>
                </div>
            </div>
        </div>
    );
};
