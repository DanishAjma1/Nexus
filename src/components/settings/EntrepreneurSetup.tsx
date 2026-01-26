import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    getEnterpreneurById,
    updateEntrepreneurData,
    createEnterProfile,
} from "../../data/users";
import { Entrepreneur, UserRole } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Building2,
    Rocket,
    Target,
    Users,
    DollarSign,
    Calendar,
    TrendingUp,
    Award,
    BarChart3,
    Globe,
    Lightbulb,
    Save,
    Sparkles,
    Check,
    Loader2,
    X,
    Plus,
    ChevronDown
} from "lucide-react";
import axios from "axios";

type User = {
    name: string;
    email: string;
    password: string;
    role: UserRole;
};

export const EntrepreneurSetup: React.FC = () => {
    const { user, register } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const checkIfSettingPage = location.pathname === "/settings" ? true : false;
    const [entrepreneur, setEnterpreneur] = useState<Entrepreneur>();
    const isEditMode = checkIfSettingPage && entrepreneur;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [industries, setIndustries] = useState<{ _id: string; name: string; isCustom: boolean; }[]>([]);
    const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
    const [customIndustry, setCustomIndustry] = useState("");
    const [isAddingCustom, setIsAddingCustom] = useState(false);

    useEffect(() => {
        const fetchEntrepreneur = async () => {
            if (user?.userId) {
                const entrepreneur = await getEnterpreneurById(user?.userId);
                setEnterpreneur(entrepreneur);
            }
        };
        fetchEntrepreneur();
    }, [user]);

    useEffect(() => {
        const fetchIndustries = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/industry/get-all`);
                setIndustries(response.data);
            } catch (error) {
                console.error("Failed to fetch industries:", error);
                toast.error("Failed to load industries");
            }
        };
        fetchIndustries();
    }, []);

    const initialData = useMemo(
        () => ({
            userId: entrepreneur?.userId,
            startupName: entrepreneur?.startupName,
            pitchSummary: entrepreneur?.pitchSummary,
            fundingNeeded: entrepreneur?.fundingNeeded,
            industry: entrepreneur?.industry,
            foundedYear: entrepreneur?.foundedYear,
            teamSize: entrepreneur?.teamSize,
            revenue: entrepreneur?.revenue,
            profitMargin: entrepreneur?.profitMargin,
            growthRate: entrepreneur?.growthRate,
            marketOpportunity: entrepreneur?.marketOpportunity,
            advantage: entrepreneur?.advantage,
        }),
        [entrepreneur]
    );

    const [formData, setFormData] = useState<Partial<Entrepreneur>>(
        initialData || {}
    );

    useEffect(() => {
        if (isEditMode && entrepreneur) {
            setFormData({
                ...entrepreneur,
                userId: entrepreneur.userId,
            });
        }
    }, [entrepreneur, isEditMode]);


    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(
            (prev) => ({ ...(prev || {}), [name]: value } as Partial<Entrepreneur>)
        );
    };

    const handleUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (formData.foundedYear) {
            const yearStr = formData.foundedYear.toString();
            if (yearStr.length !== 4) {
                toast.error("Founded Year must be exactly 4 digits.");
                setIsSubmitting(false);
                return;
            }
            const currentYear = new Date().getFullYear();
            if (parseInt(yearStr) > currentYear) {
                toast.error(`Founded Year cannot be in the future (max ${currentYear}).`);
                setIsSubmitting(false);
                return;
            }
        }

        try {
            if (!checkIfSettingPage) {
                const userInfoString = localStorage.getItem("userInfo");
                if (!userInfoString) {
                    return;
                }
                try {
                    const parsed = JSON.parse(userInfoString) as User;
                    const { name, email, password, role } = parsed;
                    const userId = await register(name, email, password, role, false);
                    console.log(userId);
                    if (userId) {
                        await createEnterProfile({ ...formData, userId: userId });

                        // Email will be sent from the backend when profile is created/updated
                        setFormData({});
                        setEnterpreneur(undefined);
                        navigate("/account-under-review", { replace: true });
                    }
                } catch (e) {
                    console.error("Failed to parse userInfo from localStorage", e);
                } finally {
                    localStorage.removeItem("userInfo");
                }
            } else {
                await updateEntrepreneurData(formData);

                const fd = formData || {};
                const {
                    startupName,
                    pitchSummary,
                    fundingNeeded,
                    industry,
                    foundedYear,
                    teamSize,
                    marketOpportunity,
                    advantage,
                    revenue,
                    profitMargin,
                    growthRate,
                } = fd as Partial<Entrepreneur>;

                setEnterpreneur({
                    startupName,
                    pitchSummary,
                    fundingNeeded,
                    industry,
                    foundedYear,
                    teamSize,
                    marketOpportunity,
                    advantage,
                    revenue,
                    profitMargin,
                    growthRate,
                } as Entrepreneur);

                setFormData(initialData || {});
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4">
                    <Building2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Launch Your Startup Journey</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Tell us about your venture to connect with the perfect investors
                </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-8">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        <Check className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-900">Sign Up</span>
                </div>
                <div className="h-0.5 w-16 bg-blue-400"></div>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        2
                    </div>
                    <span className="font-medium text-gray-700">Basic & Financial info</span>
                </div>
                <div className="h-0.5 w-16 bg-gray-300"></div>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
                        3
                    </div>
                    <span className="font-medium text-gray-400">Review By Admin</span>
                </div>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-8">
                {/* Startup Core Info */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Rocket className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Core Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Sparkles className="w-4 h-4" />
                                <span>Startup Name</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="startupName"
                                    value={formData.startupName || ""}
                                    onChange={handleUserChange}
                                    placeholder="What's your startup called?"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-green-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-green-400 pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Globe className="w-4 h-4" />
                                <span>Industry (Select multiple or add custom)</span>
                            </label>
                            <div className="relative">
                                {/* Selected Industries */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(formData.industry && formData.industry.length > 0) ? formData.industry.map((ind, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                                            {ind}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newIndustries = formData.industry?.filter((_, i) => i !== idx) || [];
                                                    setFormData(prev => ({ ...prev, industry: newIndustries }));
                                                }}
                                                className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </span>
                                    )) : (
                                        <span className="text-sm text-gray-400">No industries selected</span>
                                    )}
                                </div>

                                {/* Dropdown Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-green-300 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-left flex items-center justify-between"
                                >
                                    <span className="text-gray-600">Select or add industry</span>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showIndustryDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showIndustryDropdown && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                                        {/* Custom Industry Input */}
                                        <div className="p-3 border-b border-gray-200 bg-gray-50">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={customIndustry}
                                                    onChange={(e) => setCustomIndustry(e.target.value)}
                                                    placeholder="Add custom industry..."
                                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                                    onKeyPress={async (e) => {
                                                        if (e.key === 'Enter' && customIndustry.trim()) {
                                                            e.preventDefault();
                                                            const trimmed = customIndustry.trim();
                                                            // Check if already exists in dropdown
                                                            const existsInList = industries.some(ind => ind.name.toLowerCase() === trimmed.toLowerCase());
                                                            // Check if already selected
                                                            const alreadySelected = formData.industry?.some(ind => ind.toLowerCase() === trimmed.toLowerCase());
                                                            
                                                            if (alreadySelected) {
                                                                toast.error('Industry already selected');
                                                                return;
                                                            }

                                                            if (!existsInList) {
                                                                // Add to database
                                                                try {
                                                                    setIsAddingCustom(true);
                                                                    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/industry/add-custom`, {
                                                                        name: trimmed,
                                                                        userId: user?.userId
                                                                    });
                                                                    // Add to local industries list
                                                                    setIndustries(prev => [...prev, response.data]);
                                                                    toast.success('Custom industry added');
                                                                } catch (error: any) {
                                                                    if (error.response?.data?.message === 'Industry already exists') {
                                                                        toast.error('Industry already exists in database');
                                                                    } else {
                                                                        toast.error('Failed to add custom industry');
                                                                    }
                                                                    console.error(error);
                                                                } finally {
                                                                    setIsAddingCustom(false);
                                                                }
                                                            }
                                                            
                                                            // Add to selected
                                                            const currentIndustries = formData.industry || [];
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                industry: [...currentIndustries, trimmed]
                                                            }));
                                                            setCustomIndustry('');
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    disabled={!customIndustry.trim() || isAddingCustom}
                                                    onClick={async () => {
                                                        const trimmed = customIndustry.trim();
                                                        if (!trimmed) return;

                                                        const existsInList = industries.some(ind => ind.name.toLowerCase() === trimmed.toLowerCase());
                                                        const alreadySelected = formData.industry?.some(ind => ind.toLowerCase() === trimmed.toLowerCase());
                                                        
                                                        if (alreadySelected) {
                                                            toast.error('Industry already selected');
                                                            return;
                                                        }

                                                        if (!existsInList) {
                                                            try {
                                                                setIsAddingCustom(true);
                                                                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/industry/add-custom`, {
                                                                    name: trimmed,
                                                                    userId: user?.userId
                                                                });
                                                                setIndustries(prev => [...prev, response.data]);
                                                                toast.success('Custom industry added');
                                                            } catch (error: any) {
                                                                if (error.response?.data?.message === 'Industry already exists') {
                                                                    toast.error('Industry already exists in database');
                                                                } else {
                                                                    toast.error('Failed to add custom industry');
                                                                }
                                                                console.error(error);
                                                            } finally {
                                                                setIsAddingCustom(false);
                                                            }
                                                        }
                                                        
                                                        const currentIndustries = formData.industry || [];
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            industry: [...currentIndustries, trimmed]
                                                        }));
                                                        setCustomIndustry('');
                                                    }}
                                                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
                                                >
                                                    {isAddingCustom ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        {/* Industry Options */}
                                        <div className="max-h-48 overflow-y-auto">
                                            {industries.map((industry) => {
                                                const isSelected = formData.industry?.includes(industry.name);
                                                return (
                                                    <button
                                                        key={industry._id}
                                                        type="button"
                                                        onClick={() => {
                                                            const currentIndustries = formData.industry || [];
                                                            if (isSelected) {
                                                                // Remove from selection
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    industry: currentIndustries.filter(ind => ind !== industry.name)
                                                                }));
                                                            } else {
                                                                // Add to selection
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    industry: [...currentIndustries, industry.name]
                                                                }));
                                                            }
                                                        }}
                                                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                                                            isSelected ? 'bg-green-50 text-green-700' : 'text-gray-700'
                                                        }`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            {industry.name}
                                                            {industry.isCustom && (
                                                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Custom</span>
                                                            )}
                                                        </span>
                                                        {isSelected && <Check className="w-4 h-4" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Calendar className="w-4 h-4" />
                                <span>Founded Year</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    name="foundedYear"
                                    value={formData.foundedYear || ""}
                                    onChange={handleUserChange}
                                    placeholder="When did you start?"
                                    min="1000"
                                    max={new Date().getFullYear()}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-green-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-green-400 pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Users className="w-4 h-4" />
                                <span>Team Size</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    name="teamSize"
                                    value={formData.teamSize || ""}
                                    onChange={handleUserChange}
                                    placeholder="How many team members?"
                                    min="0"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-green-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-green-400 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <Target className="w-4 h-4" />
                            <span>Elevator Pitch</span>
                        </label>
                        <div className="relative group">
                            <textarea
                                name="pitchSummary"
                                value={formData.pitchSummary || ""}
                                onChange={handleUserChange}
                                placeholder="Describe your startup in one compelling paragraph..."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder-gray-400 resize-none group-hover:border-green-300"
                            />
                            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-green-400 pointer-events-none"></div>
                        </div>
                    </div>
                </div>

                {/* Financial Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Financial Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <DollarSign className="w-4 h-4" />
                                <span>Funding Needed</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</div>
                                <input
                                    type="number"
                                    name="fundingNeeded"
                                    value={formData.fundingNeeded || ""}
                                    onChange={handleUserChange}
                                    placeholder="Amount needed"
                                    min="0"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-blue-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-blue-400 pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <TrendingUp className="w-4 h-4" />
                                <span>Annual Revenue</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</div>
                                <input
                                    type="number"
                                    name="revenue"
                                    value={formData.revenue || ""}
                                    onChange={handleUserChange}
                                    placeholder="Current revenue"
                                    min="0"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-blue-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-blue-400 pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <BarChart3 className="w-4 h-4" />
                                <span>Profit Margin</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    name="profitMargin"
                                    value={formData.profitMargin || ""}
                                    onChange={handleUserChange}
                                    placeholder="Percentage"
                                    min="0"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-blue-300"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">%</div>
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-blue-400 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <TrendingUp className="w-4 h-4" />
                            <span>Growth Rate</span>
                        </label>
                        <div className="relative group">
                            <input
                                type="number"
                                name="growthRate"
                                value={formData.growthRate || ""}
                                onChange={handleUserChange}
                                placeholder="Annual growth percentage"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-blue-300"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">%</div>
                            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-blue-400 pointer-events-none"></div>
                        </div>
                    </div>
                </div>

                {/* Market Advantage */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Award className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Market & Advantage</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Lightbulb className="w-4 h-4" />
                                <span>Market Opportunity</span>
                            </label>
                            <div className="relative group">
                                <textarea
                                    name="marketOpportunity"
                                    value={formData.marketOpportunity || ""}
                                    onChange={handleUserChange}
                                    placeholder="Describe your target market and opportunity size..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all placeholder-gray-400 resize-none group-hover:border-purple-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-purple-400 pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Award className="w-4 h-4" />
                                <span>Competitive Advantage</span>
                            </label>
                            <div className="relative group">
                                <textarea
                                    name="advantage"
                                    value={formData.advantage || ""}
                                    onChange={handleUserChange}
                                    placeholder="What makes you stand out from competitors?"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all placeholder-gray-400 resize-none group-hover:border-purple-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-purple-400 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Section */}
                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                    <div className="flex items-center space-x-3 text-gray-600">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium">Ready to launch?</p>
                            <p className="text-sm">Complete your profile to start connecting with investors</p>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center space-x-2">
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            <span>{checkIfSettingPage ? (isSubmitting ? "Updating..." : "Update Profile") : (isSubmitting ? "Saving..." : "Save & Send For Review")}</span>
                        </div>
                    </button>
                </div>
            </form>
        </div>
    );
};