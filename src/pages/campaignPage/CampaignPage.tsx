import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripeDonationForm } from "../../components/camp/StripeDonationForm";
import { Navbar } from "../../components/home/Navbar";
import { Button } from "../../components/ui/Button";

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

interface DonationFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  campaignId: string;
  campaignTitle: string;
}

export const CampaignsPage: React.FC = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignCardProps[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<CampaignCardProps[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignCardProps | null>(null);
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

  // Categories from backend campaign model
  const categories = ["Technology", "Health", "Education", "Environment", "Other"];

  // Fetch active campaigns from database
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/admin/campaigns`);
      const data = response.data || [];
      setAllCampaigns(data);
      // Filter only active campaigns for the main display grid
      const activeCampaigns = data.filter((campaign: CampaignCardProps) => campaign.status === "active");
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

  // Filter campaigns by category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredCampaigns(campaigns);
    } else {
      setFilteredCampaigns(campaigns.filter(campaign => campaign.category === selectedCategory));
    }
  }, [selectedCategory, campaigns]);

  // Calculate days left from end date
  const calculateDaysLeft = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const CampaignCard: React.FC<CampaignCardProps> = ({
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
    const displayImage = images && images.length > 0 ? `${URL}${images[0]}` : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800";

    return (
      <div className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10">
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg">
            {category}
          </span>
        </div>

        {/* Days Left Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 text-xs font-semibold bg-gray-900/80 backdrop-blur-sm text-white rounded-full border border-gray-700">
            {isLifetime ? "⏳ Lifetime" : `⏳ ${daysLeft} days left`}
          </span>
        </div>

        {/* Campaign Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Campaign Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
              {title}
            </h3>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {description}
            </p>
            {organizer && (
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="mr-2">👤</span>
                <span>Organized by {organizer}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-green-400 font-semibold">
                ${raisedAmount.toLocaleString()} raised
              </span>
              <span className="text-gray-400">
                of ${goalAmount.toLocaleString()} goal
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-right">
              {progress.toFixed(1)}% funded
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate(`/campaigns/${_id}`)}
              className="py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-purple-500/30"
            >
              View More
            </Button>
            <Button
              onClick={() => {
                setSelectedCampaign({ _id, title, description, category, goalAmount, raisedAmount, images, organizer, endDate, status: "active" });
                setDonationForm(prev => ({
                  ...prev,
                  campaignId: _id,
                  campaignTitle: title,
                  amount: Math.max(25, Math.ceil((goalAmount - raisedAmount) * 0.01))
                }));
                setShowDonationForm(true);
              }}
              className="py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-orange-500/30"
            >
              Donate Now
            </Button>
          </div>
        </div>
      </div>
    );
  };


  const handleAmountClick = (amount: number) => {
    setDonationForm(prev => ({ ...prev, amount }));
  };

  const handleCloseModal = () => {
    setShowDonationForm(false);
    setSelectedCampaign(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Support <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">Life-Changing</span> Causes
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Discover and donate to campaigns making a real difference in people's lives. Every contribution matters.
            </p>
          </div>

          {/* Stats Bar - Widened to full container */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12 max-w-6xl mx-auto">
            {[
              { label: "Active Campaigns", value: campaigns.length, color: "text-blue-500" },
              { label: "Total Campaigns", value: allCampaigns.length, color: "text-blue-500" },
              { label: "Total Raised", value: `$${allCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0).toLocaleString()}`, color: "text-green-500" },
              { label: "Total Donors", value: `${allCampaigns.reduce((sum, c) => sum + (c.supporters?.length || 0), 0)}+`, color: "text-blue-500" },
              { label: "Avg. Success Rate", value: `${allCampaigns.length > 0 ? Math.round((allCampaigns.filter(c => c.raisedAmount >= c.goalAmount).length / allCampaigns.length) * 100) : 0}%`, color: "text-purple-500" }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-2 min-h-[120px] shadow-lg w-full"
              >
                <div className="text-xs md:text-sm text-gray-400 font-medium uppercase tracking-wider text-center leading-tight">
                  {stat.label}
                </div>
                <div className={`text-2xl md:text-3xl font-bold ${stat.color} break-all text-center`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${selectedCategory === "All"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
                }`}
            >
              All Causes
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedCategory === cat
                  ? "bg-blue-500 text-white"
                  : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {selectedCategory === "All" ? "No Active Campaigns" : `No ${selectedCategory} Campaigns`}
            </h3>
            <p className="text-gray-400">
              {selectedCategory === "All"
                ? "Check back soon for new campaigns to support!"
                : `No active campaigns in the ${selectedCategory} category right now.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} {...campaign} />
            ))}
          </div>
        )}
      </div>

      {/* Donation Form Modal */}
      {showDonationForm && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-md my-4 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-2xl overflow-hidden max-h-[90vh]">
            {/* Header with Close Button */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse" />
                <h3 className="text-lg font-bold text-white">
                  Donate to: {selectedCampaign.title}
                </h3>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
              <div className="p-4 sm:p-6">
                {/* Campaign Info */}
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-4">
                    {selectedCampaign.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    Organized by <span className="text-orange-400">{selectedCampaign.organizer}</span>
                  </div>

                  {/* Progress Info */}
                  <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-green-400 font-semibold">
                        ${selectedCampaign.raisedAmount.toLocaleString()} raised
                      </span>
                      <span className="text-gray-400">
                        of ${selectedCampaign.goalAmount.toLocaleString()} goal
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full"
                        style={{ width: `${Math.min((selectedCampaign.raisedAmount / selectedCampaign.goalAmount) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

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

                {/* Stripe Donation Form */}
                <div className="mt-2">
                  <Elements stripe={stripePromise}>
                    <StripeDonationForm
                      amount={donationForm.amount}
                      campaignId={selectedCampaign._id}
                      onSuccess={() => {
                        handleCloseModal();
                        fetchCampaigns();
                      }}
                      onCancel={handleCloseModal}
                    />
                  </Elements>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};