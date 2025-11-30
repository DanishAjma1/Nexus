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
        Fill the Details as an Entrepreneur...
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

            <Input
              label="Which industry..?"
              name="industry"
              value={formData.industry}
              onChange={handleUserChange}
            />
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
