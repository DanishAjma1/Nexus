import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Navbar } from "../../components/home/Navbar";
import { Button } from "../../components/ui/Button";

interface Campaign {
    _id: string;
    title: string;
    description: string;
    category: string;
    goalAmount: number;
    raisedAmount: number;
    images?: string[];
    video?: string;
    organizer?: string;
    endDate: string;
    startDate: string;
    status: string;
    supporters?: Array<{
        supporterId: string;
        amount: number;
        date: Date;
    }>;
}

interface DonationFormData {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    amount: number;
    campaignId: string;
    campaignTitle: string;
}

export const CampaignDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const URL = import.meta.env.VITE_BACKEND_URL;

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showDonationForm, setShowDonationForm] = useState(false);
    const [donationForm, setDonationForm] = useState<DonationFormData>({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
        amount: 0,
        campaignId: "",
        campaignTitle: ""
    });

    // Fetch campaign details
    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${URL}/admin/campaigns`);
                const foundCampaign = response.data.find((c: Campaign) => c._id === id);

                if (foundCampaign) {
                    setCampaign(foundCampaign);
                } else {
                    toast.error("Campaign not found");
                    navigate("/All-Campaigns");
                }
            } catch (error) {
                console.error("Failed to fetch campaign:", error);
                toast.error("Failed to load campaign details");
                navigate("/All-Campaigns");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCampaign();
        }
    }, [id, URL, navigate]);

    // Auto-slide images if there are multiple
    useEffect(() => {
        if (campaign?.images && campaign.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) =>
                    prev === campaign.images!.length - 1 ? 0 : prev + 1
                );
            }, 5000); // Change image every 5 seconds

            return () => clearInterval(interval);
        }
    }, [campaign]);

    const nextImage = () => {
        if (campaign?.images) {
            setCurrentImageIndex((prev) =>
                prev === campaign.images!.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (campaign?.images) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? campaign.images!.length - 1 : prev - 1
            );
        }
    };

    const calculateDaysLeft = (endDate: string): number => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const handleDonationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Thank you for your donation of $${donationForm.amount} to "${donationForm.campaignTitle}"!`);
        setShowDonationForm(false);
        setDonationForm({
            cardNumber: "",
            cardHolder: "",
            expiryDate: "",
            cvv: "",
            amount: 0,
            campaignId: "",
            campaignTitle: ""
        });
    };

    const handleAmountClick = (amount: number) => {
        setDonationForm(prev => ({ ...prev, amount }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!campaign) {
        return null;
    }

    const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;
    const daysLeft = calculateDaysLeft(campaign.endDate);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <Navbar />

            {/* Back Button */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <button
                    onClick={() => navigate("/All-Campaigns")}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6 group"
                >
                    <svg
                        className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium">Back to Campaigns</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Left Column - Media */}
                        <div className="space-y-4">
                            {/* Video Section */}
                            {campaign.video && (
                                <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                                    <video
                                        src={`${URL}${campaign.video}`}
                                        controls
                                        className="w-full h-auto"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}

                            {/* Images Section */}
                            {campaign.images && campaign.images.length > 0 && (
                                <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                                    {campaign.images.length === 1 ? (
                                        // Single image - static
                                        <img
                                            src={`${URL}${campaign.images[0]}`}
                                            alt={campaign.title}
                                            className="w-full h-auto object-cover"
                                        />
                                    ) : (
                                        // Multiple images - auto-sliding
                                        <div className="relative h-96">
                                            {campaign.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={`${URL}${image}`}
                                                    alt={`${campaign.title} - ${index + 1}`}
                                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                                                        }`}
                                                />
                                            ))}

                                            {/* Navigation Arrows */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                                                aria-label="Previous image"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                                                aria-label="Next image"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>

                                            {/* Image Indicators */}
                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                                                {campaign.images.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                                            ? "bg-blue-500 w-8"
                                                            : "bg-gray-400 hover:bg-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Column - Campaign Details */}
                        <div className="space-y-6">
                            {/* Category & Status Badges */}
                            <div className="flex gap-3 flex-wrap">
                                <span className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg">
                                    {campaign.category}
                                </span>
                                <span className="px-4 py-2 text-sm font-semibold bg-gray-900/80 backdrop-blur-sm text-white rounded-full border border-gray-700">
                                    ⏳ {daysLeft} days left
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-bold text-white">
                                {campaign.title}
                            </h1>

                            {/* Organizer */}
                            {campaign.organizer && (
                                <div className="flex items-center text-gray-400">
                                    <span className="mr-2">👤</span>
                                    <span>Organized by <span className="text-orange-400 font-medium">{campaign.organizer}</span></span>
                                </div>
                            )}

                            {/* Progress Section */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-3xl font-bold text-green-400">
                                            ${campaign.raisedAmount.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-400">raised of ${campaign.goalAmount.toLocaleString()} goal</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-blue-400">
                                            {campaign.supporters?.length || 0}
                                        </p>
                                        <p className="text-sm text-gray-400">supporters</p>
                                    </div>
                                </div>

                                <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 text-right">{progress.toFixed(1)}% funded</p>
                            </div>

                            {/* Donate Button */}
                            <Button
                                onClick={() => {
                                    setDonationForm(prev => ({
                                        ...prev,
                                        campaignId: campaign._id,
                                        campaignTitle: campaign.title,
                                        amount: Math.max(25, Math.ceil((campaign.goalAmount - campaign.raisedAmount) * 0.01))
                                    }));
                                    setShowDonationForm(true);
                                }}
                                className="w-full py-4 text-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-orange-500/30"
                            >
                                💳 Support This Campaign
                            </Button>

                            {/* Campaign Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                                    <p className="text-xs text-gray-400 mb-1">Start Date</p>
                                    <p className="text-white font-semibold">
                                        {new Date(campaign.startDate).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                                    <p className="text-xs text-gray-400 mb-1">End Date</p>
                                    <p className="text-white font-semibold">
                                        {new Date(campaign.endDate).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
                        <h2 className="text-2xl font-bold text-white mb-4">About This Campaign</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                            {campaign.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Donation Form Modal */}
            {showDonationForm && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
                    <div className="relative w-full max-w-md my-4 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-2xl overflow-hidden max-h-[90vh]">
                        {/* Header with Close Button */}
                        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse" />
                                <h3 className="text-lg font-bold text-white">
                                    Donate to: {campaign.title}
                                </h3>
                            </div>

                            <button
                                onClick={() => setShowDonationForm(false)}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
                            <div className="p-4 sm:p-6">
                                {/* Donation Amount Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                        Select Donation Amount
                                    </label>
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {[25, 50, 100, 250, 500, 1000].map((amount) => (
                                            <button
                                                key={amount}
                                                type="button"
                                                onClick={() => handleAmountClick(amount)}
                                                className={`py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${donationForm.amount === amount
                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                                    }`}
                                            >
                                                ${amount}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={donationForm.amount || ""}
                                            onChange={(e) => setDonationForm(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                                            placeholder="Enter custom amount"
                                        />
                                    </div>
                                </div>

                                {/* Payment Form */}
                                <form onSubmit={handleDonationSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                maxLength={19}
                                                placeholder="1234 5678 9012 3456"
                                                value={donationForm.cardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                                                    if (value.length <= 16) {
                                                        setDonationForm(prev => ({ ...prev, cardNumber: value }));
                                                    }
                                                }}
                                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Card Holder Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={donationForm.cardHolder}
                                                onChange={(e) => setDonationForm(prev => ({ ...prev, cardHolder: e.target.value }))}
                                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                    value={donationForm.expiryDate}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, '');
                                                        if (value.length >= 2) {
                                                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                                        }
                                                        if (value.length <= 5) {
                                                            setDonationForm(prev => ({ ...prev, expiryDate: value }));
                                                        }
                                                    }}
                                                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    CVV
                                                </label>
                                                <input
                                                    type="password"
                                                    maxLength={4}
                                                    placeholder="123"
                                                    value={donationForm.cvv}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        if (value.length <= 4) {
                                                            setDonationForm(prev => ({ ...prev, cvv: value }));
                                                        }
                                                    }}
                                                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-green-500/30"
                                        disabled={donationForm.amount <= 0}
                                    >
                                        💳 Donate ${donationForm.amount.toLocaleString()}
                                    </Button>

                                    {/* Security Notice */}
                                    <div className="mt-4 p-3 bg-gray-900/30 rounded-lg border border-gray-800">
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span>Your donation is secure and encrypted</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
