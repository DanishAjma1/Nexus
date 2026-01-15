import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/home/Navbar";
import { Button } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface CampaignProps {
  _id: string;
  image: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
}

interface FundraiserProps {
  image: string;
  fundNeeded: string;
  company: string;
  description: string;
}

interface SuccessfulCompanyProps {
  image: string;
  company: string;
  description: string;
  exits: number;
}

export const HomePage: React.FC = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  // Fetch recent active campaigns
  useEffect(() => {
    const fetchRecentCampaigns = async () => {
      try {
        setCampaignsLoading(true);
        const response = await axios.get(`${URL}/admin/campaigns`);
        // Filter only active campaigns and take the last 3 (most recent)
        const activeCampaigns = response.data
          .filter((c: any) => c.status === "active")
          .slice(-3)
          .reverse();
        setRecentCampaigns(activeCampaigns);
      } catch (error) {
        console.error("Failed to fetch recent campaigns:", error);
      } finally {
        setCampaignsLoading(false);
      }
    };

    fetchRecentCampaigns();
  }, [URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const res = await fetch(`${URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert(data.error || "Failed to send message");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const CampaignDiv: React.FC<CampaignProps> = ({
    _id,
    image,
    title,
    description,
    goalAmount,
    raisedAmount
  }) => {
    return (
      <div
        onClick={() => navigate(`/campaigns/${_id}`)}
        className="group cursor-pointer relative w-full h-44 md:h-48 hover:scale-[1.02] transition-all duration-300 mx-auto max-w-xs bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl overflow-hidden border border-gray-700/50 shadow-lg hover:shadow-xl hover:border-orange-500/30"
      >
        <img
          src={image}
          alt="Campaign"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end text-white p-4">
          <div className="bg-gradient-to-r from-orange-500/20 to-transparent p-3 rounded-lg backdrop-blur-sm">
            <h1 className="text-sm font-bold text-orange-300 mb-1 truncate">
              {title}
            </h1>
            <p className="text-xs text-gray-300 mb-2 line-clamp-2">
              {description}
            </p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-400">Raised:</span>
                <span className="text-xs font-bold text-green-400">
                  ${raisedAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-400">Goal:</span>
                <span className="text-xs font-bold text-blue-400">
                  ${goalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FundraiserDiv: React.FC<FundraiserProps> = ({
    image,
    fundNeeded,
    company,
    description,
  }) => {
    return (
      <div className="group relative w-full h-44 md:h-48 hover:scale-[1.02] transition-all duration-300 mx-auto max-w-xs bg-gradient-to-br from-blue-900/80 to-purple-900/80 rounded-xl overflow-hidden border border-gray-700/50 shadow-lg hover:shadow-xl hover:border-blue-500/30">
        <img
          src={image}
          alt="Fundraiser"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end text-white p-4">
          <div className="bg-gradient-to-r from-blue-500/20 to-transparent p-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-sm font-bold text-white truncate">
                {company}
              </h1>
              <span className="text-xs px-2 py-1 bg-blue-500/30 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-gray-300 mb-3 line-clamp-2">
              {description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-300">Need:</span>
              <span className="text-sm font-bold text-white">
                ${fundNeeded}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SuccessfulCompanyDiv: React.FC<SuccessfulCompanyProps> = ({
    image,
    company,
    description,
    exits,
  }) => {
    return (
      <div className="group flex flex-col w-full items-center hover:scale-[1.02] transition-all duration-300">
        <div className="flex flex-col w-full h-full p-5 rounded-xl shadow-lg bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-orange-500/50 transition-colors duration-300">
          <div className="relative overflow-hidden rounded-lg mb-4">
            <img
              src={image}
              alt="Company"
              className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 right-3">
              <div className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/30">
                <span className="text-xs font-bold text-green-400">
                  {exits} Exit{exits !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <h1 className="text-lg font-bold text-white truncate">
                {company}
              </h1>
            </div>

            <p className="text-sm text-gray-400 line-clamp-2 mb-2">
              {description}
            </p>

            <div className="mt-auto pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  <span className="text-xs text-gray-400">Successful</span>
                </div>
                <button className="text-xs px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative w-full overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('app logo.jpeg')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/90 to-black" />
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* 3 COLUMN LAYOUT */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* LEFT - CAMPAIGNS */}
            <div className="lg:w-1/4 w-full">
              <div className="sticky top-24">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-orange-500 rounded-full mr-3" />
                  <h1 className="text-xl font-bold text-white font-serif">
                    Recent Campaigns
                  </h1>
                  <span className="ml-2 px-2 py-1 text-xs bg-orange-500/20 text-orange-300 rounded-full">
                    3 Live
                  </span>
                </div>

                <div className="flex flex-col gap-4 lg:gap-5">
                  {campaignsLoading ? (
                    <div className="flex justify-center p-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
                    </div>
                  ) : recentCampaigns.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 text-sm italic">No recent campaigns</p>
                    </div>
                  ) : (
                    recentCampaigns.map((campaign) => (
                      <CampaignDiv
                        key={campaign._id}
                        _id={campaign._id}
                        image={campaign.images?.[0] ? `${URL}${campaign.images[0]}` : "app logo.jpeg"}
                        title={campaign.title}
                        description={campaign.description}
                        goalAmount={campaign.goalAmount}
                        raisedAmount={campaign.raisedAmount}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* CENTER CONTENT */}
            <div className="lg:w-1/2 w-full flex flex-col items-center justify-center py-8 lg:py-16 px-4">
              <div className="max-w-2xl text-center space-y-6 lg:space-y-8">
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    Where{" "}
                    <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                      Entrepreneurs
                    </span>{" "}
                    and{" "}
                    <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
                      Investors
                    </span>{" "}
                    Connect
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-300 font-light max-w-2xl mx-auto">
                    Collaborate, make deals, and build successful ventures
                    together in our curated ecosystem.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <Button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                      Get Started
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8">
                  <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-orange-500">
                      500+
                    </div>
                    <div className="text-sm text-gray-400">Startups</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-blue-500">
                      $50M+
                    </div>
                    <div className="text-sm text-gray-400">Funded</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm md:col-span-1 col-span-2">
                    <div className="text-2xl font-bold text-green-500">95%</div>
                    <div className="text-sm text-gray-400">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT - FUNDRAISERS */}
            <div className="lg:w-1/4 w-full">
              <div className="sticky top-24">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full mr-3" />
                  <h1 className="text-xl font-bold text-white font-serif">
                    Live Fundraisers
                  </h1>
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                    Hot
                  </span>
                </div>

                <div className="flex flex-col gap-4 lg:gap-5">
                  <FundraiserDiv
                    image="app logo.jpeg"
                    company="Quantum AI"
                    fundNeeded="2.5M"
                    description="Advanced quantum computing for enterprise solutions with guaranteed returns"
                  />
                  <FundraiserDiv
                    image="app logo.jpeg"
                    company="NeuroTech"
                    fundNeeded="1.8M"
                    description="Breakthrough neural interface technology with 3-year ROI projection"
                  />
                  <FundraiserDiv
                    image="app logo.jpeg"
                    company="Space Logistics"
                    fundNeeded="5.2M"
                    description="Orbital delivery systems with government contracts secured"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SUCCESSFUL ENTREPRENEURS */}
          <div className="mt-12 lg:mt-20 px-4">
            <div className="text-center mb-10">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Featured Success Stories
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Meet the entrepreneurs who turned ideas into multi-exit
                ventures through our platform
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <SuccessfulCompanyDiv
                image="app logo.jpeg"
                company="Tesla"
                description="Revolutionized electric vehicles and sustainable energy with 4 successful exits to major automakers"
                exits={4}
              />
              <SuccessfulCompanyDiv
                image="app logo.jpeg"
                company="SpaceX"
                description="Pioneered private space exploration with multiple successful satellite deployment exits"
                exits={3}
              />
              <SuccessfulCompanyDiv
                image="app logo.jpeg"
                company="Neuralink"
                description="Breakthrough neurotechnology company with successful exits in medical device industry"
                exits={2}
              />
            </div>
          </div>

          {/* CTA SECTION */}
          <div className="mt-16 lg:mt-24 px-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-black p-8 md:p-12 border border-gray-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Ready to Start Your Journey?
                  </h2>
                  <p className="text-gray-300 mb-8">
                    Join thousands of entrepreneurs and investors already
                    building the future
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/register">
                      <Button className="px-8 py-3 text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* CONTACT SECTION */}
          <div className="mt-16 lg:mt-24 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800">

              {/* LEFT: Contact Form */}
              <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
                <p className="text-gray-300 mb-6 font-light">
                  Fill out the form below and we'll get back to you shortly.
                </p>
                {success && (
                  <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-lg text-sm border border-green-500/30 animate-pulse">
                    {success}
                  </div>
                )}
                <form className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1" htmlFor="message">
                      Message
                    </label>

                    <textarea
                      id="message"
                      placeholder="Your message..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>

              {/* RIGHT: Contact Info */}
              <div className="flex flex-col justify-center p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Contact Info</h3>
                <p className="text-gray-300 mb-2">
                  Have questions? Reach out to us anytime.
                </p>
                <div className="mt-4">
                  <p className="text-gray-400 text-xs mb-1">Email</p>
                  <a
                    href="https://mail.google.com/mail/?view=cm&to=aitrustbridge@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500"
                  >
                    aitrustbridge@gmail.com
                  </a>
                </div>
                <div className="mt-4">
                  <p className="text-gray-400 text-xs mb-1">Address</p>
                  <span className="text-gray-300 text-sm">
                    123 AI Street, Tech City, Country
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-gray-400 text-xs mb-1">Phone</p>
                  <span className="text-gray-300 text-sm">+1 (234) 567-890</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};