import React, { useState } from "react";
import { Navbar } from "../../components/home/Navbar";
import { Button } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";

interface BusinessCardProps {
  id: number;
  name: string;
  description: string;
  industry: string;
  fundingGoal: number;
  fundsRaised: number;
  equityOffered: number;
  valuation: number;
  image: string;
  location: string;
  foundedYear: number;
  teamSize: number;
  stage: "Seed" | "Series A" | "Series B" | "Series C";
  investors: number;
}

interface InvestmentModalData {
  businessId: number;
  businessName: string;
  investmentAmount: number;
  equityPercentage: number;
  estimatedReturn: number;
}

export const FundraisePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessCardProps | null>(null);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [investmentData, setInvestmentData] = useState<InvestmentModalData>({
    businessId: 0,
    businessName: "",
    investmentAmount: 0,
    equityPercentage: 0,
    estimatedReturn: 0
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // In real app, get from auth context

  // Sample business data
  const businesses: BusinessCardProps[] = [
    {
      id: 1,
      name: "Quantum AI",
      description: "Building quantum computing solutions for drug discovery and material science. Proprietary algorithms reduce simulation time by 90%.",
      industry: "Deep Tech",
      fundingGoal: 5000000,
      fundsRaised: 2500000,
      equityOffered: 15,
      valuation: 33333333,
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
      location: "San Francisco, CA",
      foundedYear: 2021,
      teamSize: 18,
      stage: "Series A",
      investors: 45
    },
    {
      id: 2,
      name: "NeuroTech",
      description: "Non-invasive brain-computer interface for treating neurological disorders. FDA approval pending for clinical trials.",
      industry: "HealthTech",
      fundingGoal: 3000000,
      fundsRaised: 1800000,
      equityOffered: 12,
      valuation: 25000000,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
      location: "Boston, MA",
      foundedYear: 2020,
      teamSize: 12,
      stage: "Seed",
      investors: 32
    },
    {
      id: 3,
      name: "Green Energy Solutions",
      description: "Revolutionary solar panel technology with 40% higher efficiency using perovskite materials. Manufacturing plant ready for scale.",
      industry: "Clean Energy",
      fundingGoal: 8000000,
      fundsRaised: 5500000,
      equityOffered: 20,
      valuation: 40000000,
      image: "https://images.unsplash.com-1559757172-5c350d0d3c56?w=800",
      location: "Austin, TX",
      foundedYear: 2019,
      teamSize: 24,
      stage: "Series B",
      investors: 78
    },
    {
      id: 4,
      name: "AgriTech Robotics",
      description: "Autonomous farming robots that reduce water usage by 60% and increase crop yield by 35%. Currently deployed in 50+ farms.",
      industry: "AgriTech",
      fundingGoal: 4000000,
      fundsRaised: 2200000,
      equityOffered: 10,
      valuation: 40000000,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
      location: "Chicago, IL",
      foundedYear: 2020,
      teamSize: 16,
      stage: "Series A",
      investors: 41
    },
    {
      id: 5,
      name: "Space Logistics",
      description: "Orbital delivery systems for small satellite deployment. Contracted with SpaceX and NASA for upcoming missions.",
      industry: "Aerospace",
      fundingGoal: 12000000,
      fundsRaised: 8500000,
      equityOffered: 18,
      valuation: 66666666,
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
      location: "Los Angeles, CA",
      foundedYear: 2018,
      teamSize: 42,
      stage: "Series C",
      investors: 112
    },
    {
      id: 6,
      name: "BioPrint Innovations",
      description: "3D bioprinting human tissues for pharmaceutical testing. Partnership with top 10 pharma companies secured.",
      industry: "Biotech",
      fundingGoal: 6000000,
      fundsRaised: 3200000,
      equityOffered: 14,
      valuation: 42857142,
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      location: "San Diego, CA",
      foundedYear: 2021,
      teamSize: 22,
      stage: "Series A",
      investors: 56
    }
  ];

  const BusinessCard: React.FC<BusinessCardProps> = ({
    id,
    name,
    description,
    industry,
    fundingGoal,
    fundsRaised,
    equityOffered,
    valuation,
    image,
    location,
    foundedYear,
    teamSize,
    stage,
    investors
  }) => {
    const progress = (fundsRaised / fundingGoal) * 100;
    
    const getStageColor = (stage: string) => {
      switch (stage) {
        case "Seed": return "bg-blue-500";
        case "Series A": return "bg-green-500";
        case "Series B": return "bg-yellow-500";
        case "Series C": return "bg-purple-500";
        default: return "bg-gray-500";
      }
    };

    const handleInvestClick = () => {
      if (!isLoggedIn) {
        // Redirect to login page
        navigate("/login");
        return;
      }
      
      setSelectedBusiness({ 
        id, name, description, industry, fundingGoal, fundsRaised, 
        equityOffered, valuation, image, location, foundedYear, 
        teamSize, stage, investors 
      });
      
      setInvestmentData(prev => ({
        ...prev,
        businessId: id,
        businessName: name,
        investmentAmount: Math.max(10000, Math.ceil((fundingGoal - fundsRaised) * 0.01)),
        equityPercentage: equityOffered,
        estimatedReturn: Math.ceil(valuation * 0.25) // Simplified calculation
      }));
      
      setShowInvestmentModal(true);
    };

    return (
      <div className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
        {/* Stage Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 text-xs font-semibold ${getStageColor(stage)} text-white rounded-full shadow-lg`}>
            {stage}
          </span>
        </div>
        
        {/* Industry Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 text-xs font-semibold bg-gray-900/80 backdrop-blur-sm text-white rounded-full border border-gray-700">
            🏢 {industry}
          </span>
        </div>
        
        {/* Business Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
        
        {/* Business Content */}
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-white line-clamp-1">
                {name}
              </h3>
              <span className="text-sm text-gray-400">📍 {location}</span>
            </div>
            
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {description}
            </p>
            
            {/* Business Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="flex items-center text-gray-500">
                <span className="mr-2">📅</span>
                <span>Founded {foundedYear}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <span className="mr-2">👥</span>
                <span>{teamSize} team members</span>
              </div>
              <div className="flex items-center text-gray-500">
                <span className="mr-2">🏦</span>
                <span>${(valuation/1000000).toFixed(1)}M valuation</span>
              </div>
              <div className="flex items-center text-gray-500">
                <span className="mr-2">🤝</span>
                <span>{investors} investors</span>
              </div>
            </div>
          </div>
          
          {/* Funding Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-blue-400 font-semibold">
                ${(fundsRaised/1000000).toFixed(1)}M raised
              </span>
              <span className="text-gray-400">
                of ${(fundingGoal/1000000).toFixed(1)}M goal
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{progress.toFixed(1)}% funded</span>
              <span className="text-orange-400">🏷️ {equityOffered}% equity offered</span>
            </div>
          </div>
          
          {/* Action Button */}
          <Button 
            onClick={handleInvestClick}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/30"
          >
            💼 Invest Now
          </Button>
          
          {/* Login Prompt for non-logged in users */}
          {!isLoggedIn && (
            <p className="text-xs text-center text-gray-500 mt-2">
              Login required to invest
            </p>
          )}
        </div>
      </div>
    );
  };

  const handleInvestmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Investment of $${investmentData.investmentAmount.toLocaleString()} submitted for ${investmentData.businessName}!`);
    setShowInvestmentModal(false);
    setInvestmentData({
      businessId: 0,
      businessName: "",
      investmentAmount: 0,
      equityPercentage: 0,
      estimatedReturn: 0
    });
  };

  const handleAmountChange = (amount: number) => {
    const equity = (amount / selectedBusiness!.valuation) * 100;
    const estimatedReturn = amount * 2.5; // Simplified ROI calculation
    
    setInvestmentData(prev => ({
      ...prev,
      investmentAmount: amount,
      equityPercentage: parseFloat(equity.toFixed(2)),
      estimatedReturn: Math.ceil(estimatedReturn)
    }));
  };

  const handleCloseModal = () => {
    setShowInvestmentModal(false);
    setSelectedBusiness(null);
    setInvestmentData({
      businessId: 0,
      businessName: "",
      investmentAmount: 0,
      equityPercentage: 0,
      estimatedReturn: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Invest in the <span className="bg-gradient-to-r from-blue-500 to-cyan-300 bg-clip-text text-transparent">Future</span> of Business
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Discover high-growth startups and innovative businesses seeking investment. 
              Become a part of their journey and share in their success.
            </p>
            
            {/* Authentication Status */}
            <div className="inline-block bg-gradient-to-r from-gray-900 to-black rounded-xl p-4 border border-gray-800 mb-8">
              <div className="flex items-center justify-center gap-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse" />
                      <span className="text-green-400 font-semibold">Ready to Invest</span>
                    </div>
                    <Button 
                      onClick={() => setIsLoggedIn(false)}
                      className="px-4 py-2 text-sm bg-transparent border border-gray-700 text-gray-400 rounded-lg hover:bg-white/10"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                      <span className="text-yellow-400 font-semibold">Login Required to Invest</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/login">
                        <Button className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                          Login
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button className="px-4 py-2 text-sm bg-transparent border border-gray-700 text-gray-400 rounded-lg hover:bg-white/10">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="text-2xl md:text-3xl font-bold text-blue-500">{businesses.length}+</div>
                <div className="text-sm text-gray-400">Active Deals</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="text-2xl md:text-3xl font-bold text-green-500">$42M+</div>
                <div className="text-sm text-gray-400">Total Invested</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="text-2xl md:text-3xl font-bold text-purple-500">364+</div>
                <div className="text-sm text-gray-400">Investors</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="text-2xl md:text-3xl font-bold text-orange-500">3.2x</div>
                <div className="text-sm text-gray-400">Avg. ROI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-full font-semibold">
                All Industries
              </button>
              {["Deep Tech", "HealthTech", "Clean Energy", "AgriTech", "Aerospace", "Biotech"].map((ind) => (
                <button
                  key={ind}
                  className="px-4 py-2 bg-white/5 text-gray-300 hover:text-white rounded-full font-medium hover:bg-white/10 transition-colors"
                >
                  {ind}
                </button>
              ))}
            </div>
            
            {/* Stage Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400 text-sm font-medium mr-2">Stage:</span>
              {["Seed", "Series A", "Series B", "Series C"].map((stage) => (
                <button
                  key={stage}
                  className="px-3 py-1 bg-white/5 text-gray-300 hover:text-white rounded-full text-sm hover:bg-white/10 transition-colors"
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Businesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {businesses.map((business) => (
            <BusinessCard key={business.id} {...business} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 border border-gray-800 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {isLoggedIn ? "Ready to Make Your First Investment?" : "Ready to Start Investing?"}
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              {isLoggedIn 
                ? "Browse our curated selection of high-potential businesses and start building your investment portfolio today."
                : "Join our community of investors and get access to exclusive investment opportunities in innovative startups."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoggedIn ? (
                <>
                  <Button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/30">
                    Browse All Deals
                  </Button>
                  <Button className="px-8 py-3 bg-transparent border border-gray-700 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300">
                    View Portfolio
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/30">
                      Create Account
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button className="px-8 py-3 bg-transparent border border-gray-700 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300">
                      Login to Invest
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestmentModal && selectedBusiness && isLoggedIn && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-md my-4 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-2xl overflow-hidden max-h-[90vh]">
            {/* Header with Close Button */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse" />
                <h3 className="text-lg font-bold text-white">
                  Invest in {selectedBusiness.name}
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
                {/* Business Info */}
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-4">
                    {selectedBusiness.description}
                  </p>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                      <div className="text-xs text-gray-400 mb-1">Valuation</div>
                      <div className="text-lg font-bold text-white">
                        ${(selectedBusiness.valuation/1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                      <div className="text-xs text-gray-400 mb-1">Equity Offered</div>
                      <div className="text-lg font-bold text-orange-400">
                        {selectedBusiness.equityOffered}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Info */}
                  <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-blue-400 font-semibold">
                        ${(selectedBusiness.fundsRaised/1000000).toFixed(1)}M raised
                      </span>
                      <span className="text-gray-400">
                        of ${(selectedBusiness.fundingGoal/1000000).toFixed(1)}M goal
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
                        style={{ width: `${Math.min((selectedBusiness.fundsRaised / selectedBusiness.fundingGoal) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Investment Amount Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Investment Amount
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[10000, 25000, 50000, 100000, 250000, 500000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountChange(amount)}
                        className={`py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                          investmentData.investmentAmount === amount
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        ${(amount/1000).toFixed(0)}K
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      min="1000"
                      step="1000"
                      value={investmentData.investmentAmount || ""}
                      onChange={(e) => handleAmountChange(parseInt(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Enter custom amount (min $1,000)"
                    />
                  </div>
                </div>

                {/* Investment Summary */}
                {investmentData.investmentAmount > 0 && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-800/30">
                    <h4 className="text-sm font-semibold text-white mb-3">Investment Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Investment Amount:</span>
                        <span className="text-white font-semibold">
                          ${investmentData.investmentAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Equity Acquired:</span>
                        <span className="text-orange-400 font-semibold">
                          {investmentData.equityPercentage.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Estimated 5-Year Return:</span>
                        <span className="text-green-400 font-semibold">
                          ${investmentData.estimatedReturn.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-blue-800/30">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Potential ROI:</span>
                          <span className="text-green-400 font-bold">
                            {((investmentData.estimatedReturn / investmentData.investmentAmount) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms Agreement */}
                <div className="mb-6">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600 focus:ring-2"
                      required
                    />
                    <span className="text-sm text-gray-300">
                      I agree to the investment terms and understand that this is a high-risk investment. 
                      I have read and accept the risk disclosure statement.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleInvestmentSubmit}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-green-500/30"
                  disabled={investmentData.investmentAmount < 1000}
                >
                  💼 Submit Investment
                </Button>
                
                {/* Disclaimer */}
                <div className="mt-4 p-3 bg-gray-900/30 rounded-lg border border-gray-800">
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Investments involve risks, including loss of principal. Past performance does not guarantee future results. 
                      Please consult with a financial advisor before making any investment decisions.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};