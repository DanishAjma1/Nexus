import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";
import { ArrowLeft, Calendar, Clock, Share2, ShieldCheck } from "lucide-react";
import { ShareModal } from "../../components/common/ShareModal";

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

export const DashboardCampaignDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const URL = import.meta.env.VITE_BACKEND_URL;

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
                    navigate("/dashboard/campaigns");
                }
            } catch (error) {
                console.error("Failed to fetch campaign:", error);
                toast.error("Failed to load campaign details");
                navigate("/dashboard/campaigns");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCampaign();
        }
    }, [id, URL, navigate]);

    useEffect(() => {
        if (campaign?.images && campaign.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) =>
                    prev === campaign.images!.length - 1 ? 0 : prev + 1
                );
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [campaign]);

    const calculateDaysLeft = (endDate: string): number => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!campaign) return null;

    const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;
    const daysLeft = calculateDaysLeft(campaign.endDate);

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/dashboard/campaigns")}
                        className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-primary-600 hover:border-primary-200 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">{campaign.title}</h1>
                        <nav className="flex text-sm text-gray-500 gap-2">
                            <span className="cursor-pointer hover:text-primary-600" onClick={() => navigate("/dashboard/campaigns")}>Campaigns</span>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Detail</span>
                        </nav>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        leftIcon={<Share2 size={18} />}
                        onClick={() => setIsShareModalOpen(true)}
                    >
                        Share
                    </Button>
                    {/* <Button
                        onClick={() => navigate("/All-Campaigns")} // Redirecting to landing page for donation as requested "go back to all campaigns" or "donate"
                        className="bg-primary-600 text-white"
                    >
                        Support Campaign
                    </Button> */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Media & Description */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Media Slider */}
                    <Card className="overflow-hidden border-gray-100 shadow-xl">
                        {campaign.images && campaign.images.length > 0 && (
                            <div className="relative h-96 bg-gray-900">
                                {campaign.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={`${URL}${img}`}
                                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${idx === currentImageIndex ? "opacity-100" : "opacity-0"
                                            }`}
                                        alt={campaign.title}
                                    />
                                ))}

                                {/* Indicators */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                    {campaign.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentImageIndex ? "bg-white w-8" : "bg-white/40"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Floating Labels */}
                                <div className="absolute top-6 left-6 flex gap-2">
                                    <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                        {campaign.category}
                                    </span>
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full flex items-center gap-1">
                                        <Clock size={12} /> {daysLeft} Days Left
                                    </span>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* About Section */}
                    <Card>
                        <CardBody className="p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">About This Campaign</h2>
                            <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                                {campaign.description}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Video Section if available */}
                    {campaign.video && (
                        <Card>
                            <CardBody className="p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Campaign Video</h2>
                                <div className="aspect-video rounded-xl overflow-hidden bg-black border border-gray-100">
                                    <video src={`${URL}${campaign.video}`} controls className="w-full h-full" />
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </div>

                {/* Right Column - Stats & Action */}
                <div className="space-y-6">
                    {/* Progress Card - Now Light Themed */}
                    <Card className="border-primary-100 shadow-sm overflow-hidden bg-gradient-to-br from-primary-50/50 to-white">
                        <CardBody className="p-8 space-y-6">
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Raised</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold text-primary-600">${campaign.raisedAmount.toLocaleString()}</span>
                                    <span className="text-gray-400 font-medium whitespace-nowrap">USD</span>
                                </div>
                                <p className="text-gray-400 text-xs mt-1">Goal: ${campaign.goalAmount.toLocaleString()}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-primary-700">{progress.toFixed(1)}%</span>
                                    <span className="text-gray-600 font-medium">{campaign.supporters?.length || 0} Supporters</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-primary-600 h-3 rounded-full shadow-sm"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Donors</p>
                                    <p className="text-xl font-bold text-gray-900">{campaign.supporters?.length || 0}</p>
                                </div>
                                <div className="text-center border-l border-gray-100">
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Days Left</p>
                                    <p className="text-xl font-bold text-gray-900">{daysLeft}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Meta Info */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardBody className="p-6 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Verified Organizer</p>
                                    <p className="text-sm font-bold text-gray-900">{campaign.organizer || "TrustBridge Admin"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Timeline</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Call to Action Card - Now Light/Blue Themed */}
                    <Card className="bg-white border-2 border-primary-50 p-6 relative overflow-hidden shadow-lg shadow-primary-100/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16" />
                        <h4 className="font-bold text-gray-900 relative z-10">Make a global impact</h4>
                        <p className="text-xs text-gray-600 mt-2 mb-6 relative z-10 leading-relaxed">
                            Your contribution can help achieve the goal and change lives. Support this campaign directly on our main platform.
                        </p>
                        <Button
                            onClick={() => navigate("/All-Campaigns")}
                            className="w-full font-bold shadow-md shadow-primary-200"
                        >
                            Contribute Now
                        </Button>
                    </Card>
                </div>
            </div>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                title={campaign.title}
                url={window.location.href}
                theme="light"
            />
        </div>
    );
};
