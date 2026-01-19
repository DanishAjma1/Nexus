import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/home/Navbar";
import { Button } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Entrepreneur } from "../../types";
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Users, 
  Target, 
  Layers, 
  TrendingUp, 
  Building2, 
  Clock, 
  Percent,
  Sparkles,
  Filter,
  Zap,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6); // 6 items for 2 rows of 3

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
    setCurrentPage(0); // Reset to first page when filters change
  }, [selectedIndustry, selectedStage, entrepreneurs]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredEntrepreneurs.length / itemsPerPage);
  const paginatedEntrepreneurs = filteredEntrepreneurs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Adjust items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerPage(6); // 2 rows of 3 for xl screens
      } else if (window.innerWidth >= 1024) {
        setItemsPerPage(4); // 2 rows of 2 for lg screens
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(4); // 2 rows of 2 for md screens
      } else {
        setItemsPerPage(6); // 6 rows of 1 for mobile
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

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
        case "Pre-Seed": return "bg-gradient-to-r from-blue-400 to-blue-500";
        case "Seed": return "bg-gradient-to-r from-blue-600 to-blue-700";
        case "Series A": return "bg-gradient-to-r from-emerald-500 to-emerald-600";
        default: return "bg-gradient-to-r from-gray-500 to-gray-600";
      }
    };

    const fundingProgress = Math.round(((entrepreneur.totalRaised || 0) / (entrepreneur.fundingNeeded || 1)) * 100);

    return (
      <div className="group relative bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Stage Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-4 py-1.5 text-[11px] uppercase tracking-wider font-bold ${getStageColor(stage)} text-white rounded-full shadow-lg shadow-blue-500/20 flex items-center gap-1.5`}>
            <Zap size={12} />
            {stage}
          </span>
        </div>

        {/* Industry Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold bg-gray-900/90 backdrop-blur-sm text-gray-300 rounded-full border border-gray-700 shadow-lg">
            {entrepreneur.industry || "General"}
          </span>
        </div>

        {/* Image Slider */}
        <div className="relative h-52 overflow-hidden">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={entrepreneur.startupName}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/90 hover:scale-110">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/90 hover:scale-110">
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-blue-500 w-4 shadow-md shadow-blue-500/50' : 'bg-white/60'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-7">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="text-xl font-bold text-white truncate mb-1">
                  {entrepreneur.startupName || "Unnamed Startup"}
                </h3>
                <div className="flex items-center text-xs text-gray-400">
                  <MapPin size={12} className="mr-1.5 text-blue-500 flex-shrink-0" />
                  <span className="truncate">{entrepreneur.location || "Location not specified"}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">
                    ${((entrepreneur.valuation || 0) / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-6 line-clamp-2 min-h-[44px] leading-relaxed">
              {entrepreneur.pitchSummary || "No description provided."}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users size={16} className="text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{entrepreneur.teamSize || 0}</div>
                  <div className="text-xs text-gray-400">Team</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Building2 size={16} className="text-emerald-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{entrepreneur.foundedYear || "N/A"}</div>
                  <div className="text-xs text-gray-400">Founded</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Target size={16} className="text-purple-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    ${(entrepreneur.fundingNeeded || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Target</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Layers size={16} className="text-amber-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    ${(entrepreneur.totalRaised || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Raised</div>
                </div>
              </div>
            </div>

            {/* Funding Progress */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <div className="text-xs uppercase tracking-wider font-bold text-blue-400">
                  Funding Progress
                </div>
                <div className="text-sm font-bold text-white">
                  {fundingProgress}%
                </div>
              </div>
              <div className="relative">
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-400 transition-all duration-1000 rounded-full"
                    style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>${(entrepreneur.totalRaised || 0).toLocaleString()} raised</span>
                  <span>${(entrepreneur.fundingNeeded || 0).toLocaleString()} goal</span>
                </div>
              </div>
            </div>
          </div>

          <Link to={`/login`}>
            <Button className="w-full py-3.5 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:via-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5">
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
      <div className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-full border border-blue-500/20 mb-6">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">Invest in Innovation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Invest in the <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">Future</span> of Business
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              Discover high-growth startups and innovative businesses seeking investment.
              Become a part of their journey and share in their success.
            </p>

            {/* Authentication Status */}
            <div className="inline-block bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 shadow-2xl mb-12">
              <div className="flex items-center justify-center gap-6">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400 font-semibold text-lg">Active Investor</span>
                    </div>
                    <Button className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg">
                      View Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                      <span className="text-yellow-400 font-semibold text-lg">Join as an Investor</span>
                    </div>
                    <div className="flex gap-3">
                      <Link to="/login">
                        <Button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                          Login
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-lg border border-gray-700 hover:bg-gray-800 transition-all duration-300">
                          Register
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <div className="flex-1 min-w-[240px] max-w-[320px] bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Building2 size={24} className="text-blue-500" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-blue-500">{platformStats.activeDeals || entrepreneurs.length}+</div>
                </div>
                <div className="text-lg text-gray-300 font-medium">Active Deals</div>
              </div>
              <div className="flex-1 min-w-[240px] max-w-[320px] bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 shadow-xl hover:shadow-green-500/10 transition-all duration-300">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <TrendingUp size={24} className="text-green-500" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-green-500">
                    ${(platformStats.totalInvested / 1000000).toFixed(1)}M+
                  </div>
                </div>
                <div className="text-lg text-gray-300 font-medium">Total Invested</div>
              </div>
              <div className="flex-1 min-w-[240px] max-w-[320px] bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <Users size={24} className="text-purple-500" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-purple-500">{platformStats.totalInvestors}+</div>
                </div>
                <div className="text-lg text-gray-300 font-medium">Investors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Filter Tabs */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">Explore Opportunities</h2>
              <p className="text-gray-400">Filter by industry and funding stage to find perfect matches</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Filter size={20} className="text-blue-500" />
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Industry Filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-gray-300 text-sm font-medium">Industry</span>
                  <div className="flex flex-wrap gap-2">
                    {industries.slice(0, 5).map((ind) => (
                      <button
                        key={ind}
                        onClick={() => setSelectedIndustry(ind)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedIndustry === ind
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                          : "bg-gray-900 text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800"
                          }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stage Filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-gray-300 text-sm font-medium">Stage</span>
                  <div className="flex flex-wrap gap-2">
                    {stages.map((stage) => (
                      <button
                        key={stage}
                        onClick={() => setSelectedStage(stage)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedStage === stage
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                          : "bg-gray-900 text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800"
                          }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredEntrepreneurs.length}</span> opportunities
            {selectedIndustry !== "All Industries" && ` in ${selectedIndustry}`}
            {selectedStage !== "All Stages" && ` at ${selectedStage} stage`}
          </div>
          <div className="text-sm text-gray-500">
            Page <span className="text-white font-semibold">{currentPage + 1}</span> of <span className="text-white font-semibold">{totalPages}</span>
          </div>
        </div>

        {/* Businesses Grid */}
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-6" />
              <p className="text-gray-400 text-lg">Loading investment opportunities...</p>
            </div>
          </div>
        ) : filteredEntrepreneurs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center max-w-[1800px] mx-auto mb-12">
              {paginatedEntrepreneurs.map((ent) => (
                <div key={ent.userId || ent._id} className="w-full max-w-[500px]">
                  <BusinessCard entrepreneur={ent} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16 pt-8 border-t border-gray-800/50">
                {/* Page Info */}
                <div className="text-gray-400 text-sm">
                  Showing <span className="text-white font-semibold">
                    {Math.min((currentPage * itemsPerPage) + 1, filteredEntrepreneurs.length)}-{Math.min((currentPage + 1) * itemsPerPage, filteredEntrepreneurs.length)}
                  </span> of <span className="text-white font-semibold">{filteredEntrepreneurs.length}</span> opportunities
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-4">
                  {/* Previous Button */}
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900/50 backdrop-blur-sm border border-gray-800 text-gray-300 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ArrowLeft size={18} />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                      // Show 5 page numbers around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx;
                      } else if (currentPage <= 2) {
                        pageNum = idx;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 5 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`w-10 h-10 rounded-xl font-medium transition-all flex items-center justify-center ${currentPage === pageNum
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                            : "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800"
                            }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}

                    {totalPages > 5 && (
                      <>
                        <span className="text-gray-600 mx-1">...</span>
                        <button
                          onClick={() => goToPage(totalPages - 1)}
                          className={`w-10 h-10 rounded-xl font-medium transition-all flex items-center justify-center ${currentPage === totalPages - 1
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                            : "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800"
                            }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= totalPages - 1}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900/50 backdrop-blur-sm border border-gray-800 text-gray-300 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Next
                    <ArrowRight size={18} />
                  </button>
                </div>

                {/* Items Per Page Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(0);
                    }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="3">3</option>
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="12">12</option>
                  </select>
                  <span className="text-gray-400 text-sm">per page</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl border border-dashed border-gray-800 backdrop-blur-sm">
            <div className="max-w-md mx-auto">
              <div className="p-6 bg-gray-900/50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Building2 size={40} className="text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No matches found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters to see more opportunities</p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setSelectedIndustry("All Industries")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl"
                >
                  Clear Industry Filter
                </Button>
                <Button
                  onClick={() => setSelectedStage("All Stages")}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl border border-gray-800"
                >
                  Clear Stage Filter
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="inline-block bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-800 shadow-2xl max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {currentUser ? "Ready to Make Your First Investment?" : "Ready to Start Investing?"}
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
              {currentUser
                ? "Browse our curated selection of high-potential businesses and start building your investment portfolio today."
                : "Join our community of investors and get access to exclusive investment opportunities in innovative startups."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <>
                  <Button className="px-10 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white font-semibold text-lg rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl hover:shadow-blue-500/40">
                    Browse All Deals
                  </Button>
                  <Button className="px-10 py-4 bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700 text-white font-semibold text-lg rounded-xl hover:bg-gray-800/80 hover:border-gray-600 transition-all duration-300">
                    View Portfolio
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button className="px-10 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white font-semibold text-lg rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl hover:shadow-blue-500/40">
                      Create Account
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button className="px-10 py-4 bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700 text-white font-semibold text-lg rounded-xl hover:bg-gray-800/80 hover:border-gray-600 transition-all duration-300">
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