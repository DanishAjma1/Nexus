import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";
import axios from "axios";
import toast from "react-hot-toast";
import { Rocket, Clock, Target, TrendingUp, X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripeDashboardPaymentForm } from "../../components/dashboard/StripeDashboardPaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CampaignCardProps {
    _id: string;
    title: string;
    description: string;
    category: string;
    goalAmount: number;
    raisedAmount: number;
    images?: string[];
    organizer?: string;
    endDate: string;
    status: string;
    isLifetime?: boolean;
    supporters?: Array<{
        supporterId: string;
        amount: number;
        date: Date;
    }>;
}

export const DashboardCampaigns: React.FC = () => {
    const URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<CampaignCardProps[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [showDonationForm, setShowDonationForm] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignCardProps | null>(null);
    const [donationAmount, setDonationAmount] = useState<number>(0);

    const categories = ["Technology", "Health", "Education", "Environment", "Other"];

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/admin/campaigns`);
            const activeCampaigns = response.data.filter((campaign: CampaignCardProps) => campaign.status === "active");
            setCampaigns(activeCampaigns);
            setFilteredCampaigns(activeCampaigns);
        } catch (error) {
            console.error("Failed to fetch campaigns:", error);
            toast.error("Failed to load campaigns");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [URL]);

    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredCampaigns(campaigns);
        } else {
            setFilteredCampaigns(campaigns.filter(campaign => campaign.category === selectedCategory));
        }
    }, [selectedCategory, campaigns]);

    const calculateDaysLeft = (endDate: string): number => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const CampaignCardInternal: React.FC<CampaignCardProps> = ({
        _id,
        title,
        description,
        category,
        goalAmount,
        raisedAmount,
        images,
        organizer,
        endDate,
        isLifetime
    }) => {
        const progress = (raisedAmount / goalAmount) * 100;
        const daysLeft = calculateDaysLeft(endDate);
        const displayImage = images && images.length > 0 ? `${URL}${images[0]} ` : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800";

        return (
            <Card hoverable className="h-full flex flex-col group border-gray-100 hover:border-primary-200 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={displayImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full shadow-lg">
                            {category}
                        </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex items-center text-white text-xs font-medium">
                            <Clock size={14} className="mr-1" />
                            {isLifetime ? "Lifetime" : `${daysLeft} days left`}
                        </div>
                    </div>
                </div>

                <CardBody className="flex-1 flex flex-col p-5">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                            {title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">By {organizer || "TrustBridge AI"}</p>
                        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                            {description}
                        </p>
                    </div>

                    <div className="mt-auto space-y-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-primary-700 font-bold">
                                    ${raisedAmount.toLocaleString()} <span className="text-gray-400 font-normal">raised</span>
                                </span>
                                <span className="text-gray-500">
                                    {progress.toFixed(0)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(progress, 100)}% ` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                                <span>Goal: ${goalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-auto">
                            <Button
                                onClick={() => navigate(`/dashboard/campaigns/${_id}`)}
                                className="py-2.5 text-xs font-bold bg-blue-50 text-blue-700 border-none hover:bg-blue-100 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                View Details
                            </Button>
                            <Button
                                onClick={() => {
                                    setSelectedCampaign({ _id, title, description, category, goalAmount, raisedAmount, images, organizer, endDate, status: "active" });
                                    setDonationAmount(Math.max(25, Math.ceil((goalAmount - raisedAmount) * 0.01)));
                                    setShowDonationForm(true);
                                }}
                                className="py-2.5 text-xs font-bold bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-primary-200 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Contribute
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    };

    return (
        <>
            <div className="space-y-6 animate-fade-in pb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Active Campaigns</h1>
                        <p className="text-gray-600">Discover and support life-changing causes within our community.</p>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === "All"
                                ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300"
                                }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
                        <CardBody className="flex items-center p-6">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4 text-blue-600">
                                <Rocket size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-blue-700">Active Campaigns</p>
                                <h3 className="text-2xl font-bold text-gray-900">{campaigns.length}</h3>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
                        <CardBody className="flex items-center p-6">
                            <div className="p-3 bg-green-100 rounded-lg mr-4 text-green-600">
                                <Target size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-green-700">Total Goal</p>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    ${campaigns.reduce((sum, c) => sum + c.goalAmount, 0).toLocaleString()}
                                </h3>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                        <CardBody className="flex items-center p-6">
                            <div className="p-3 bg-purple-100 rounded-lg mr-4 text-purple-600">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-purple-700">Total Raised</p>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    ${campaigns.reduce((sum, c) => sum + c.raisedAmount, 0).toLocaleString()}
                                </h3>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredCampaigns.length === 0 ? (
                    <Card className="p-12 text-center border-dashed">
                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Rocket size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No campaigns found</h3>
                        <p className="text-gray-500">
                            {selectedCategory === "All"
                                ? "There are no active campaigns at the moment."
                                : `No active campaigns in the ${selectedCategory} category.`}
                        </p>
                        <Button
                            className="mt-6"
                            variant="outline"
                            onClick={() => setSelectedCategory("All")}
                        >
                            Clear Filters
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCampaigns.map((campaign) => (
                            <CampaignCardInternal key={campaign._id} {...campaign} />
                        ))}
                    </div>
                )}

            </div>


            {/* Donation Form Modal */}
            {showDonationForm && selectedCampaign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh]">
                        {/* Header */}
                        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white border-b border-gray-100">
                            <div className="flex items-center">
                                <Rocket className="w-5 h-5 text-primary-600 mr-3" />
                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                                    Support {selectedCampaign.title}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowDonationForm(false)}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[calc(90vh-60px)] p-6">
                            {/* Donation Amount Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                                    Select Amount
                                </label>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {[25, 50, 100, 250, 500, 1000].map((amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() => setDonationAmount(amount)}
                                            className={`py-3 rounded-xl font-bold transition-all text-sm ${donationAmount === amount
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            ${amount}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={donationAmount || ""}
                                        onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)}
                                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 focus:outline-none focus:border-primary-500 transition-colors font-bold"
                                        placeholder="Custom Amount"
                                    />
                                </div>
                            </div>

                            <Elements stripe={stripePromise}>
                                <StripeDashboardPaymentForm
                                    amount={donationAmount}
                                    campaignId={selectedCampaign._id}
                                    onSuccess={() => {
                                        setShowDonationForm(false);
                                        fetchCampaigns();
                                    }}
                                    onCancel={() => setShowDonationForm(false)}
                                />
                            </Elements>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
