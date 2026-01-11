import React, { useEffect, useMemo, useState } from "react";
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
    Check
} from "lucide-react";

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

    useEffect(() => {
        const fetchEntrepreneur = async () => {
            if (user?.userId) {
                const entrepreneur = await getEnterpreneurById(user?.userId);
                setEnterpreneur(entrepreneur);
            }
        };
        fetchEntrepreneur();
    }, [user]);

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
        try {
            if (!checkIfSettingPage) {
                const userInfoString = localStorage.getItem("userInfo");
                if (!userInfoString) {
                    return;
                }
                try {
                    const parsed = JSON.parse(userInfoString) as User;
                    const { name, email, password, role } = parsed;
                    const userId = await register(name, email, password, role);
                    console.log(userId);
                    if (userId) {
                        await createEnterProfile({ ...formData, userId: userId });

                                                // Email will be sent from the backend when profile is created/updated
                        setFormData({});
                        setEnterpreneur(undefined);
                        navigate("/", { replace: true });
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

                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Globe className="w-4 h-4" />
                                <span>Industry</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry || ""}
                                    onChange={handleUserChange}
                                    placeholder="e.g., FinTech, HealthTech, SaaS"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-green-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-green-400 pointer-events-none"></div>
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
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        <div className="flex items-center space-x-2">
                            <Save className="w-5 h-5" />
                            <span>{checkIfSettingPage ? "Update Profile" : "Save & Send For Review"}</span>
                        </div>
                    </button>
                </div>
            </form>
        </div>
    );
};