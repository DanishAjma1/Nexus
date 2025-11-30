import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Investor, UserRole } from "../../types";
import {
  getInvestorById,
  sendMailToUser,
  updateInvestorData,
} from "../../data/users";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Eraser } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader } from "../ui/Card";

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
            await updateInvestorData({ ...investorFormData, userId: userId });

            const message = `
            <p>Hello,</p>
            <p>Your account is currently under review by our administrators. You will be notified about your account activation within 24 hours.</p>
            <p>If you have any questions, reply to this email or contact support at <a href="mailto:trustbridgeai@gmail.com">trustbridgeai@gmail</a>.</p>
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
          <div className="flex gap-2 w-full">
            <Input
              label="Investment Interests..?"
              name="interest"
              value={investorFormData.interest}
              onChange={handleInvestorChange}
              disabled={investorFormData.investmentInterests.length === 4}
              helperText={`${
                5 - investorFormData.investmentInterests.length
              } interests can be added..`}
              fullWidth
            />
            <label className="flex items-center">
              <button
                className="w-fit flex items-center px-5 hover:bg-blue-100 py-1 border-2 rounded-lg"
                onClick={(e) => handleInterests(e)}
              >
                Add
              </button>
            </label>
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            {investorFormData.investmentInterests?.map((item, idx) => (
              <div key={idx} className=" border-r-2 text-sm pr-1 flex gap-2">
                {item}
                <button
                  className="bg-gray-50 p-1 w-fit rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    const updatedInterests =
                      investorFormData.investmentInterests.filter(
                        (_, index) => {
                          return index !== idx;
                        }
                      );
                    setInvestorFormData({
                      ...investorFormData,
                      investmentInterests: updatedInterests,
                    });
                  }}
                >
                  <Eraser size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 w-full">
            <Input
              label="Investment Criteria..?"
              name="criteria"
              value={investorFormData.criteria}
              onChange={handleInvestorChange}
              disabled={investorFormData.investmentCriteria.length >= 5}
              helperText={`${
                5 - investorFormData.investmentCriteria.length
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
