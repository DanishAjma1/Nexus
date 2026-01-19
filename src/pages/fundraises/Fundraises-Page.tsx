import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/home/Navbar";
import { Button } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Entrepreneur } from "../../types";
import { Loader2, ChevronLeft, ChevronRight, MapPin, Users, Target, Layers } from "lucide-react";

interface BusinessCardProps {
  entrepreneur: Entrepreneur;
}

// Entrepreneurs display page with filters and showcase slider

export const FundraisePage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [filteredEntrepreneurs, setFilteredEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All Industries");
  const [selectedStage, setSelectedStage] = useState<string>("All Stages");
  const [platformStats, setPlatformStats] = useState({
    totalInvested: 0,
    totalInvestors: 0,
    activeDeals: 0
  });

  const URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [entRes, statsRes] = await Promise.all([
          axios.get(`${URL}/entrepreneur/get-entrepreneurs`),
          axios.get(`${URL}/user/platform-stats`)
        ]);

        setEntrepreneurs(entRes.data.entrepreneurs || []);
        setFilteredEntrepreneurs(entRes.data.entrepreneurs || []);

        if (statsRes.data) {
          setPlatformStats(statsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [URL]);

  useEffect(() => {
    let filtered = [...entrepreneurs];

    if (selectedIndustry !== "All Industries") {
      filtered = filtered.filter(ent => ent.industry === selectedIndustry);
    }

    if (selectedStage !== "All Stages") {
      filtered = filtered.filter(ent => {
        if (selectedStage === "Pre-Seed") return ent.preSeedStatus === "completed" || ent.preSeedStatus === "in-progress";
        if (selectedStage === "Seed") return ent.seedStatus === "completed" || ent.seedStatus === "in-progress";
        if (selectedStage === "Series A") return ent.seriesAStatus === "completed" || ent.seriesAStatus === "in-progress";
        return true;
      });
    }

    setFilteredEntrepreneurs(filtered);
  }, [selectedIndustry, selectedStage, entrepreneurs]);

  const industries = ["All Industries", ...new Set(entrepreneurs.map(ent => ent.industry).filter(Boolean) as string[])];
  const stages = ["All Stages", "Pre-Seed", "Seed", "Series A"];

  const BusinessCard: React.FC<BusinessCardProps> = ({ entrepreneur }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = entrepreneur.businessThumbnails && entrepreneur.businessThumbnails.length > 0
      ? entrepreneur.businessThumbnails
      : [typeof entrepreneur.avatarUrl === 'string' ? entrepreneur.avatarUrl : "/placeholder-startup.jpg"];

    useEffect(() => {
      if (images.length <= 1) return;
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [images.length]);

    const nextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const getActiveStage = () => {
      if (entrepreneur.seriesAStatus === "completed" || entrepreneur.seriesAStatus === "in-progress") return "Series A";
      if (entrepreneur.seedStatus === "completed" || entrepreneur.seedStatus === "in-progress") return "Seed";
      if (entrepreneur.preSeedStatus === "completed" || entrepreneur.preSeedStatus === "in-progress") return "Pre-Seed";
      return "Concept";
    };

    const stage = getActiveStage();

    const getStageColor = (stage: string) => {
      switch (stage) {
        case "Pre-Seed": return "bg-blue-400";
        case "Seed": return "bg-blue-600";
        case "Series A": return "bg-emerald-500";
        default: return "bg-gray-500";
      }
    };

    return (
      <div className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
        {/* Stage Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold ${getStageColor(stage)} text-white rounded-full shadow-lg`}>
            {stage}
          </span>
        </div>

        {/* Industry Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-gray-900/80 backdrop-blur-sm text-white rounded-full border border-gray-700">
            {entrepreneur.industry || "General"}
          </span>
        </div>

        {/* Image Slider */}
        <div className="relative h-48 overflow-hidden">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={entrepreneur.startupName}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, idx) => (
                  <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-blue-500 w-3' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-white line-clamp-1">
                {entrepreneur.startupName || "Unnamed Startup"}
              </h3>
              <div className="flex items-center text-xs text-gray-400">
                <MapPin size={12} className="mr-1 text-blue-500" />
                {entrepreneur.location || "N/A"}
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
              {entrepreneur.pitchSummary || "No description provided."}
            </p>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Users size={14} className="text-blue-500" />
                <span>{entrepreneur.teamSize || 0} Team Members</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Target size={14} className="text-blue-500" />
                <span>Founded {entrepreneur.foundedYear || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Layers size={14} className="text-blue-500" />
                <span>${((entrepreneur.valuation || 0) / 1000000).toFixed(1)}M Evaluation</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-400 font-bold">
                <span className="text-blue-500">$</span>
                <span>{(entrepreneur.fundingNeeded || 0).toLocaleString()} targeted</span>
              </div>
            </div>

            {/* Funding Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold">
                <span className="text-blue-400">
                  ${(entrepreneur.totalRaised || 0).toLocaleString()} raised
                </span>
                <span className="text-gray-500">
                  {Math.round(((entrepreneur.totalRaised || 0) / (entrepreneur.fundingNeeded || 1)) * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000"
                  style={{ width: `${Math.min(((entrepreneur.totalRaised || 0) / (entrepreneur.fundingNeeded || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <Link to={`/login`}>
            <Button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/30">
              Login As Investor To Contact
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  const handleCloseModal = () => {
    // Unused
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
                {currentUser ? (
                  <>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-2 animate-pulse" />
                      <span className="text-green-400 font-semibold">Active Investor</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                      <span className="text-yellow-400 font-semibold">Join as an Investor</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/login">
                        <Button className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                          Login
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex-1 min-w-[200px] max-w-[280px] bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-800 text-center shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-blue-500">{platformStats.activeDeals || entrepreneurs.length}+</div>
                <div className="text-sm text-gray-400">Active Deals</div>
              </div>
              <div className="flex-1 min-w-[200px] max-w-[280px] bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-800 text-center shadow-lg">
                <div className="text-2xl md:text-4xl font-bold text-green-500">
                  ${(platformStats.totalInvested / 1000000).toFixed(1)}M+
                </div>
                <div className="text-sm text-gray-400">Total Invested</div>
              </div>
              <div className="flex-1 min-w-[200px] max-w-[280px] bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-800 text-center shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-purple-500">{platformStats.totalInvestors}+</div>
                <div className="text-sm text-gray-400">Investors</div>
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
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${selectedIndustry === ind
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {ind}
                </button>
              ))}
            </div>

            {/* Stage Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-gray-400 text-sm font-medium mr-2">Stage:</span>
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedStage === stage
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Businesses Grid */}
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        ) : filteredEntrepreneurs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-7xl mx-auto mb-12">
            {filteredEntrepreneurs.map((ent) => (
              <div key={ent.userId || ent._id} className="w-full max-w-sm">
                <BusinessCard entrepreneur={ent} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-gray-800">
            <p className="text-gray-400">No entrepreneurs found matching your filters.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 border border-gray-800 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {currentUser ? "Ready to Make Your First Investment?" : "Ready to Start Investing?"}
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              {currentUser
                ? "Browse our curated selection of high-potential businesses and start building your investment portfolio today."
                : "Join our community of investors and get access to exclusive investment opportunities in innovative startups."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
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

    </div>
  );
};