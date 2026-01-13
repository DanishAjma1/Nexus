import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Investor, UserRole } from "../../types";
import {
    getInvestorById,
    updateInvestorData,
    createInvestorProfile,
} from "../../data/users";
import { useLocation, useNavigate } from "react-router-dom";
import {
    TrendingUp,
    Target,
    Filter,
    Clock,
    DollarSign,
    BarChart3,
    Plus,
    X,
    Save,
    Trophy,
    Zap,
    Globe,
    Calendar,
    Sparkles,
    Check,
    Loader2
} from "lucide-react";

type User = {
    name: string;
    email: string;
    password: string;
    role: UserRole;
};

export const InvestorSetup: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const checkIfSettingPage = location.pathname === "/settings" ? true : false;
    const { user, register } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [investor, setInvestor] = useState<Investor>();
    const initialInvestorData = useMemo(
        () => ({
            userId: investor?.userId || user?.userId,
            investmentInterests: investor?.investmentInterests || [],
            minimumInvestment: investor?.minimumInvestment,
            totalInvestments: investor?.totalInvestments,
            maximumInvestment: investor?.maximumInvestment,
            investmentCriteria: investor?.investmentCriteria || [],
            successfullExits: investor?.successfullExits,
            minTimline: investor?.minTimline,
            maxTimline: investor?.maxTimline,
            interest: "",
            criteria: "",
        }),
        [investor, user]
    );

    const [investorFormData, setInvestorFormData] = useState(initialInvestorData);

    useEffect(() => {
        const fetchInvestors = async () => {
            if (user?.userId) {
                const investor = await getInvestorById(user?.userId);
                setInvestor(investor);
            }
        };
        fetchInvestors();
    }, [user]);

    useEffect(() => {
        setInvestorFormData(initialInvestorData);
    }, [initialInvestorData]);

    const handleInvestorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInvestorFormData({ ...investorFormData, [name]: value });
    };

    const handleInvestorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (
                investorFormData.maximumInvestment === "" ||
                investorFormData.minimumInvestment === "" ||
                investorFormData.investmentInterests?.length === 0
            ) {
                alert("Please input the required data...");
                setIsSubmitting(false);
                return;
            }

            if (!checkIfSettingPage) {
                const userInfoString = localStorage.getItem("userInfo");
                if (!userInfoString) {
                    setIsSubmitting(false);
                    return;
                }
                try {
                    const parsed = JSON.parse(userInfoString) as User;
                    const { name, email, password, role } = parsed;
                    const userId = await register(name, email, password, role, false);
                    console.log(userId);
                    if (userId) {
                        await createInvestorProfile({ ...investorFormData, userId: userId });

                        // Email will be sent from the backend when profile is created/updated

                        navigate("/account-under-review", { replace: true });
                    }
                } catch (e) {
                    console.error("Failed to parse userInfo from localStorage", e);
                } finally {
                    localStorage.removeItem("userInfo");
                }
            }
            else {
                await updateInvestorData(investorFormData);
                const {
                    investmentInterests,
                    minimumInvestment,
                    maximumInvestment,
                    investmentCriteria,
                    successfullExits,
                    minTimline,
                    maxTimline,
                } = investorFormData;
                setInvestor({
                    ...investor,
                    investmentInterests,
                    minimumInvestment,
                    maximumInvestment,
                    investmentCriteria,
                    successfullExits,
                    minTimline,
                    maxTimline,
                } as Investor);
                setInvestorFormData(initialInvestorData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInterests = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const updatedInterests = [
            ...investorFormData.investmentInterests,
            investorFormData.interest,
        ];
        setInvestorFormData({
            ...investorFormData,
            investmentInterests: updatedInterests,
            interest: "",
        });
    };

    const handleCriteria = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const updateCriteria = [
            ...investorFormData.investmentCriteria,
            investorFormData.criteria,
        ];
        setInvestorFormData({
            ...investorFormData,
            investmentCriteria: updateCriteria,
            criteria: "",
        });
    };

    const removeInterest = (index: number) => {
        const updatedInterests = investorFormData.investmentInterests.filter(
            (_, i) => i !== index
        );
        setInvestorFormData({
            ...investorFormData,
            investmentInterests: updatedInterests,
        });
    };

    const removeCriteria = (index: number) => {
        const updatedCriteria = investorFormData.investmentCriteria.filter(
            (_, i) => i !== index
        );
        setInvestorFormData({
            ...investorFormData,
            investmentCriteria: updatedCriteria,
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Shape Your Investment Strategy</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Define your preferences to discover the most promising startup opportunities
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
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        2
                    </div>
                    <span className="font-medium text-gray-700">Criteria</span>
                </div>
                <div className="h-0.5 w-16 bg-gray-400"></div>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
                        3
                    </div>
                    <span className="font-medium text-gray-400">Review By Admin</span>
                </div>
            </div>

            <form onSubmit={handleInvestorSubmit} className="space-y-8">
                {/* Investment Interests */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Investment Interests</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <Globe className="w-4 h-4" />
                            <span>What industries interest you?</span>
                            <span className="text-xs text-gray-500">
                                ({investorFormData.investmentInterests.length}/5)
                            </span>
                        </label>
                        <div className="flex gap-3">
                            <div className="flex-1 relative group">
                                <input
                                    type="text"
                                    name="interest"
                                    value={investorFormData.interest}
                                    onChange={handleInvestorChange}
                                    placeholder="e.g., AI, Healthcare, Renewable Energy"
                                    disabled={investorFormData.investmentInterests.length >= 5}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400 disabled:opacity-50 group-hover:border-blue-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-blue-400 pointer-events-none"></div>
                            </div>
                            <button
                                type="button"
                                onClick={handleInterests}
                                disabled={!investorFormData.interest || investorFormData.investmentInterests.length >= 5}
                                className="px-6 py-3 bg-blue-50 text-blue-600 font-medium rounded-xl hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-blue-200"
                            >
                                <div className="flex items-center space-x-2">
                                    <Plus className="w-5 h-5" />
                                    <span>Add</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {investorFormData.investmentInterests.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-700">Selected Interests</p>
                            <div className="flex flex-wrap gap-3">
                                {investorFormData.investmentInterests.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-100"
                                    >
                                        <span className="text-blue-700 font-medium">{item}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeInterest(idx)}
                                            className="text-blue-400 hover:text-blue-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Investment Criteria */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Filter className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Investment Criteria</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <Zap className="w-4 h-4" />
                            <span>Your investment rules</span>
                            <span className="text-xs text-gray-500">
                                ({investorFormData.investmentCriteria.length}/5)
                            </span>
                        </label>
                        <div className="flex gap-3">
                            <div className="flex-1 relative group">
                                <input
                                    type="text"
                                    name="criteria"
                                    value={investorFormData.criteria}
                                    onChange={handleInvestorChange}
                                    placeholder="e.g., Early-stage, Revenue > $100K, Strong team"
                                    disabled={investorFormData.investmentCriteria.length >= 5}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all placeholder-gray-400 disabled:opacity-50 group-hover:border-purple-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-purple-400 pointer-events-none"></div>
                            </div>
                            <button
                                type="button"
                                onClick={handleCriteria}
                                disabled={!investorFormData.criteria || investorFormData.investmentCriteria.length >= 5}
                                className="px-6 py-3 bg-purple-50 text-purple-600 font-medium rounded-xl hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-purple-200"
                            >
                                <div className="flex items-center space-x-2">
                                    <Plus className="w-5 h-5" />
                                    <span>Add</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {investorFormData.investmentCriteria.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-700">Selected Criteria</p>
                            <div className="flex flex-wrap gap-3">
                                {investorFormData.investmentCriteria.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-xl border border-purple-100"
                                    >
                                        <span className="text-purple-700 font-medium">{item}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeCriteria(idx)}
                                            className="text-purple-400 hover:text-purple-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Financial Preferences */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Financial Preferences</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <DollarSign className="w-4 h-4" />
                                <span>Min Investment</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</div>
                                <input
                                    type="number"
                                    name="minimumInvestment"
                                    value={investorFormData.minimumInvestment || ""}
                                    onChange={handleInvestorChange}
                                    placeholder="Minimum amount"
                                    min="0"
                                    className="w-full pl-10 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-green-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-green-400 pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <DollarSign className="w-4 h-4" />
                                <span>Max Investment</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</div>
                                <input
                                    type="number"
                                    name="maximumInvestment"
                                    value={investorFormData.maximumInvestment || ""}
                                    onChange={handleInvestorChange}
                                    placeholder="Maximum amount"
                                    min="0"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-green-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-green-400 pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Trophy className="w-4 h-4" />
                                <span>Successful Exits</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    name="successfullExits"
                                    value={investorFormData.successfullExits || ""}
                                    onChange={handleInvestorChange}
                                    placeholder="Number of exits"
                                    min="0"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-green-300"
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-green-400 pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Calendar className="w-4 h-4" />
                                <span>Min Timeline</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    name="minTimline"
                                    value={investorFormData.minTimline || ""}
                                    onChange={handleInvestorChange}
                                    placeholder="Minimum months"
                                    min="0"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-green-300"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"></div>
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-green-400 pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Calendar className="w-4 h-4" />
                                <span>Max Timeline</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    name="maxTimline"
                                    value={investorFormData.maxTimline || ""}
                                    onChange={handleInvestorChange}
                                    placeholder="Maximum months"
                                    min="0"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder-gray-400 group-hover:border-green-300"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"></div>
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-green-400 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Section */}
                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                    <div className="flex items-center space-x-3 text-gray-600">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium">Ready to invest?</p>
                            <p className="text-sm">Complete your profile to start discovering opportunities</p>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
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