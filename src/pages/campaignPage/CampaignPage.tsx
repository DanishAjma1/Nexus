import React, { useState } from "react";
import { Navbar } from "../../components/home/Navbar";
import { Button } from "../../components/ui/Button";

interface CampaignCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  raisedAmount: number;
  image: string;
  organizer: string;
  daysLeft: number;
}

interface DonationFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  campaignId: number;
  campaignTitle: string;
}

export const CampaignsPage: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignCardProps | null>(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donationForm, setDonationForm] = useState<DonationFormData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    amount: 0,
    campaignId: 0,
    campaignTitle: ""
  });

  // Sample campaign data
  const campaigns: CampaignCardProps[] = [
    {
      id: 1,
      title: "Clean Water Initiative",
      description: "Providing clean drinking water to rural communities in Africa. Every $10 provides clean water for one person for a year.",
      category: "Humanitarian",
      goalAmount: 50000,
      raisedAmount: 32500,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      organizer: "Water for Life Foundation",
      daysLeft: 15
    },
    {
      id: 2,
      title: "Reforestation Project",
      description: "Planting 1 million trees in the Amazon rainforest to combat deforestation and climate change.",
      category: "Environment",
      goalAmount: 100000,
      raisedAmount: 75000,
      image: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800",
      organizer: "Green Earth Alliance",
      daysLeft: 30
    },
    {
      id: 3,
      title: "Children's Education Fund",
      description: "Supporting education for underprivileged children by providing school supplies, uniforms, and tuition fees.",
      category: "Education",
      goalAmount: 30000,
      raisedAmount: 18500,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
      organizer: "Education for All",
      daysLeft: 10
    },
    {
      id: 4,
      title: "Cancer Research",
      description: "Funding innovative research for early detection and treatment of pediatric cancer.",
      category: "Health",
      goalAmount: 200000,
      raisedAmount: 120500,
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
      organizer: "Hope Medical Research",
      daysLeft: 45
    },
    {
      id: 5,
      title: "Animal Rescue Center",
      description: "Building a sanctuary for rescued animals and providing medical care for endangered species.",
      category: "Animal Welfare",
      goalAmount: 75000,
      raisedAmount: 42000,
      image: "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?w=800",
      organizer: "Wildlife Protectors",
      daysLeft: 20
    },
    {
      id: 6,
      title: "Tech Scholarships",
      description: "Providing coding bootcamp scholarships for underprivileged youth to enter the tech industry.",
      category: "Education",
      goalAmount: 60000,
      raisedAmount: 38500,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      organizer: "Code for Future",
      daysLeft: 25
    }
  ];

  const CampaignCard: React.FC<CampaignCardProps> = ({
    id,
    title,
    description,
    category,
    goalAmount,
    raisedAmount,
    image,
    organizer,
    daysLeft
  }) => {
    const progress = (raisedAmount / goalAmount) * 100;
    
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
            ⏳ {daysLeft} days left
          </span>
        </div>
        
        {/* Campaign Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
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
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="mr-2">👤</span>
              <span>Organized by {organizer}</span>
            </div>
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
          
          {/* Action Button */}
          <Button 
            onClick={() => {
              setSelectedCampaign({ id, title, description, category, goalAmount, raisedAmount, image, organizer, daysLeft });
              setDonationForm(prev => ({
                ...prev,
                campaignId: id,
                campaignTitle: title,
                amount: Math.max(25, Math.ceil((goalAmount - raisedAmount) * 0.01))
              }));
              setShowDonationForm(true);
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-orange-500/30"
          >
             Donate Now
          </Button>
        </div>
      </div>
    );
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
      campaignId: 0,
      campaignTitle: ""
    });
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
      campaignId: 0,
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
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="text-2xl md:text-3xl font-bold text-blue-500">{campaigns.length}+</div>
                <div className="text-sm text-gray-400">Active Campaigns</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="text-2xl md:text-3xl font-bold text-green-500">$985K+</div>
                <div className="text-sm text-gray-400">Total Raised</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="text-2xl md:text-3xl font-bold text-blue-500">15K+</div>
                <div className="text-sm text-gray-400">Donors</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="text-2xl md:text-3xl font-bold text-purple-500">89%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-full font-semibold">
              All Causes
            </button>
            {["Humanitarian", "Environment", "Education", "Health", "Animal Welfare"].map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 bg-white/5 text-gray-300 hover:text-white rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} {...campaign} />
          ))}
        </div>
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
                        className={`py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                          donationForm.amount === amount
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