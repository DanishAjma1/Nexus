import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Facebook, Instagram, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    url: string;
    theme?: 'light' | 'dark';
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, url, theme = 'light' }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const currentUrl = url || window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(`Check out this campaign: ${title}`);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: <MessageCircle className="w-5 h-5" />,
            color: 'bg-[#25D366]',
            action: () => window.open(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, '_blank')
        },
        {
            name: 'Facebook',
            icon: <Facebook className="w-5 h-5" />,
            color: 'bg-[#1877F2]',
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')
        },
        {
            name: 'Instagram',
            icon: <Instagram className="w-5 h-5" />,
            color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
            action: () => {
                handleCopyLink();
                toast('Link copied! You can now paste it in your Instagram stories or bio.', { icon: '📸' });
            }
        },
        {
            name: 'Native Share',
            icon: <Share2 className="w-5 h-5" />,
            color: 'bg-gray-600',
            action: async () => {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: title,
                            text: `Check out this campaign: ${title}`,
                            url: currentUrl,
                        });
                    } catch (err) {
                        console.error('Error sharing:', err);
                    }
                } else {
                    handleCopyLink();
                }
            }
        }
    ];

    const bgColor = theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className={`relative w-full max-w-sm rounded-2xl border ${bgColor} shadow-2xl p-6 animate-in zoom-in-95 duration-200`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-xl font-bold ${textColor}`}>Share Campaign</h3>
                    <button
                        onClick={onClose}
                        className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${subTextColor}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {shareOptions.map((option) => (
                        <button
                            key={option.name}
                            onClick={option.action}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`w-12 h-12 ${option.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                {option.icon}
                            </div>
                            <span className={`text-xs font-medium ${subTextColor}`}>{option.name}</span>
                        </button>
                    ))}
                </div>

                <div className="space-y-2">
                    <label className={`text-xs font-semibold uppercase tracking-wider ${subTextColor}`}>Copy direct link</label>
                    <div className={`flex items-center gap-2 p-3 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <p className={`flex-1 text-sm truncate ${subTextColor}`}>{currentUrl}</p>
                        <button
                            onClick={handleCopyLink}
                            className={`p-2 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
};
