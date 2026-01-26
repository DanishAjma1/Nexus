import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Investor, UserRole } from "../../types";
import {
  getInvestorById,
  sendMailToUser,
  updateInvestorData,
  createInvestorProfile,
} from "../../data/users";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Eraser, ChevronDown, X, Check, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader } from "../ui/Card";
import axios from "axios";
import toast from "react-hot-toast";

type User = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export const InvestorSettings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const checkIfSettingPage = location.pathname === "/settings" ? true : false;
  const { user, register } = useAuth();

  const [investor, setInvestor] = useState<Investor>();
  const [industries, setIndustries] = useState<{ _id: string; name: string; isCustom: boolean }[]>([]);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [industryQuery, setIndustryQuery] = useState("");
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
  // Fetch investor data
  useEffect(() => {
    const fetchInvestors = async () => {
      if (user?.userId) {
        const investor = await getInvestorById(user?.userId);
        setInvestor(investor);
      }
    };
    fetchInvestors();
  }, [user]);

  // Fetch industries from backend
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/industry/get-all`);
        setIndustries(res.data || []);
      } catch (error) {
        console.error("Failed to load industries", error);
        toast.error("Failed to load industries");
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    setInvestorFormData(initialInvestorData);
  }, [initialInvestorData]);

  const handleInvestorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvestorFormData({ ...investorFormData, [name]: value });
  };
  const handleInvestorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (
        investorFormData.maximumInvestment === "" ||
        investorFormData.minimumInvestment === "" ||
        investorFormData.investmentInterests?.length === 0
      ) {
        alert("Please input the rquired data...");
        return;
      }

      if (!checkIfSettingPage) {
        const userInfoString = localStorage.getItem("userInfo");
        if (!userInfoString) {
          return;
        }
        try {
          const parsed = JSON.parse(userInfoString) as User;
          const { name, email, password, role } = parsed;
          const userId = await register(name, email, password, role);
          if (userId) {
            await createInvestorProfile({ ...investorFormData, userId: userId });

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
        updateInvestorData(investorFormData);
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
    }
  };

  const handleInterests = (e) => {
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

  const handleCriteria = (e) => {
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
  return (
    <div className="p-4">
      <CardHeader className="font-medium">
        Fill the Details as an Investor...
      </CardHeader>
      <form
        onSubmit={handleInvestorSubmit}
        className="gap-5 flex flex-col text-sm justify-center mt-5"
      >
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Investment Interests (Select up to 5)
          </label>
          
          {/* Selected industries as chips */}
          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {investorFormData.investmentInterests && investorFormData.investmentInterests.length > 0 ? (
              investorFormData.investmentInterests.map((item, idx) => (
                <div key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                  {item}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedInterests = investorFormData.investmentInterests.filter((_, index) => index !== idx);
                      setInvestorFormData({
                        ...investorFormData,
                        investmentInterests: updatedInterests,
                      });
                    }}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-sm text-gray-400">No industries selected</span>
            )}
          </div>

          {/* Dropdown trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowIndustryDropdown((s) => !s)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-blue-500 focus:ring-2 focus:ring-blue-500 text-left flex items-center justify-between"
            >
              <span className="text-gray-700">Select industries</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showIndustryDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {showIndustryDropdown && (
              <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 max-h-64 overflow-y-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Search size={16} className="text-gray-400" />
                  <input
                    type="text"
                    value={industryQuery}
                    onChange={(e) => setIndustryQuery(e.target.value)}
                    placeholder="Search industries..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {(industries || []).filter((i) => i.name.toLowerCase().includes(industryQuery.toLowerCase())).map((i) => {
                  const name = i.name;
                  const isSelected = investorFormData.investmentInterests.includes(name);
                  const canAddMore = investorFormData.investmentInterests.length < 5;
                  return (
                    <button
                      key={i._id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setInvestorFormData(prev => ({
                            ...prev,
                            investmentInterests: prev.investmentInterests.filter(ind => ind !== name)
                          }));
                        } else if (canAddMore) {
                          setInvestorFormData(prev => ({
                            ...prev,
                            investmentInterests: [...prev.investmentInterests, name]
                          }));
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-gray-50 ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    >
                      <span>{name}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowIndustryDropdown(false)}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {5 - investorFormData.investmentInterests.length} industries can be added
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <Input
            label="Investment Criteria..?"
            name="criteria"
            value={investorFormData.criteria}
            onChange={handleInvestorChange}
            disabled={investorFormData.investmentCriteria.length >= 5}
            helperText={`${5 - investorFormData.investmentCriteria.length
              } Investment Criteria rules can be added..`}
            fullWidth
          />
          <label className="flex items-center">
            <button
              className="w-fit flex items-center px-5 hover:bg-blue-100 py-1 border-2 rounded-lg"
              onClick={(e) => handleCriteria(e)}
            >
              Add
            </button>
          </label>
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          {investorFormData.investmentCriteria?.map((item, idx) => (
            <div key={idx} className=" border-r-2 text-sm pr-1 flex gap-2">
              {item}
              <button
                className="bg-gray-50 p-1 w-fit rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  const updatedCriteria =
                    investorFormData.investmentCriteria?.filter(
                      (_, index) => {
                        return index !== idx;
                      }
                    );
                  setInvestorFormData({
                    ...investorFormData,
                    investmentCriteria: updatedCriteria,
                  });
                }}
              >
                <Eraser size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-row">
          <div className="flex w-1/2 gap-5 flex-col pr-4">
            <Input
              type="number"
              label="Minimum investment..?"
              name="minimumInvestment"
              value={investorFormData.minimumInvestment}
              onChange={handleInvestorChange}
            />
            <Input
              type="number"
              label="Maximum investment..?"
              name="maximumInvestment"
              value={investorFormData.maximumInvestment}
              onChange={handleInvestorChange}
            />
            <Input
              type="number"
              label="Successfull Exits..?"
              name="successfullExits"
              value={investorFormData.successfullExits}
              onChange={handleInvestorChange}
            />
          </div>
          <div className="flex gap-5 w-1/2 flex-col pl-4">
            <Input
              type="number"
              label="Minimum time to invest..?"
              name="minTimline"
              value={investorFormData.minTimline}
              onChange={handleInvestorChange}
            />
            <Input
              type="number"
              label="Maximum time to invest..?"
              name="maxTimline"
              value={investorFormData.maxTimline}
              onChange={handleInvestorChange}
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
