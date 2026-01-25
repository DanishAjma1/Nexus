import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import {
  getEnterpreneurById,
  sendMailToUser,
  updateEntrepreneurData,
} from "../../data/users";
import { Entrepreneur, UserRole } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader } from "../ui/Card";
import { X, Plus, ChevronDown, Check, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

type User = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export const EntrepreneurSettings: React.FC = () => {
  const { user, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const checkIfSettingPage = location.pathname === "/settings" ? true : false;
  const [entrepreneur, setEnterpreneur] = useState<Entrepreneur>();
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

  // formData can be a partial Entrepreneur while editing
  const [formData, setFormData] = useState<Partial<Entrepreneur>>(
    initialData || {}
  );

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            await updateEntrepreneurData({ ...formData, userId: userId });

            const message = `
            <p>Hello,</p>
            <p>Your account is currently under review by our administrators. You will be notified about your account activation within 24 hours.</p>
            <p>If you have any questions, reply to this email or contact support at <a href="mailto:aitrustbridge@gmail.com">aitrustbridge@gmail.com</a>.</p>
            <p>Thank you for your patience.</p>
            <p>Regards<br/>TrustBridgeAi Support Team</p>
            `;
            const sub = "Under Review Account Activation ";
            sendMailToUser(message, sub, email);

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

        // Ensure userId is a string when updating entrepreneur state
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
    <div className="p-4">
      <CardHeader className="font-medium">
        Update Profile...
      </CardHeader>
      <form className="flex flex-col items-center" onSubmit={handleUserSubmit}>
        <div className="flex flex-row w-full gap-10 my-10">
          <div className="flex gap-5 flex-col w-1/2">
            <Input
              label="Your startup name..?"
              name="startupName"
              value={formData.startupName}
              onChange={handleUserChange}
            />
            <Input
              label="Summary which describe your company.."
              name="pitchSummary"
              value={formData.pitchSummary}
              onChange={handleUserChange}
            />
            <Input
              type="number"
              label="In which year this company found..?"
              name="foundedYear"
              value={formData.foundedYear}
              onChange={handleUserChange}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Which industry..? (Select multiple or add custom)
              </label>
              <div className="relative">
                {/* Selected Industries */}
                <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
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
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-green-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-left flex items-center justify-between"
                >
                  <span className="text-gray-600">Select or add industry</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showIndustryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showIndustryDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-hidden">
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
                            if (e.key === 'Enter') {
                              e.preventDefault();
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
                                setFormData(prev => ({
                                  ...prev,
                                  industry: currentIndustries.filter(ind => ind !== industry.name)
                                }));
                              } else {
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
            <Input
              type="number"
              label="Profit Margin..? (In persontage)"
              name="profitMargin"
              value={formData.profitMargin}
              onChange={handleUserChange}
            />
          </div>
          <div className="flex gap-5 flex-col w-1/2">
            <Input
              type="number"
              label="How much fund you need..?"
              name="fundingNeeded"
              value={formData.fundingNeeded}
              onChange={handleUserChange}
            />
            <Input
              label="Market opporunity..?"
              name="marketOpportunity"
              value={formData.marketOpportunity}
              onChange={handleUserChange}
            />
            <Input
              label="Advantage..?"
              name="advantage"
              value={formData.advantage}
              onChange={handleUserChange}
            />
            <Input
              label="Revenue / worth of your company..?"
              name="revenue"
              type="number"
              value={formData.revenue}
              onChange={handleUserChange}
            />

            <Input
              type="number"
              label="Enter the Growth Rate..? (In persontage)"
              name="growthRate"
              value={formData.growthRate}
              onChange={handleUserChange}
            />
          </div>
        </div>
        <div className="flex w-full justify-end pt-6 mt-6 border-t-2">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};
