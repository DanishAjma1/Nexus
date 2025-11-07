import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { getEnterpreneurById, updateEntrepreneurData } from "../../data/users";
import { Entrepreneur } from "../../types";
import { useAuth } from "../../context/AuthContext";

export const EntrepreneurSettings: React.FC = () => {
  const { user } = useAuth();
  const [entrepreneur, setEnterpreneur] = useState<Entrepreneur>();

  useEffect(() => {
    const fetchEntrepreneur = async () => {
      const entrepreneur = await getEnterpreneurById(user?.userId);
      setEnterpreneur(entrepreneur);
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

  const handleUserSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
  };

  return (
    <div>
      <form
        className="flex flex-col items-center"
        onSubmit={(e) => {
          handleUserSubmit(e);
        }}
      >
        <div className="flex flex-row w-full gap-10">
          <div className="flex gap-2 flex-col w-1/2">
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
              label="In which year this company found..?"
              name="foundedYear"
              value={formData.foundedYear}
              onChange={handleUserChange}
            />

            <Input
              label="Industry..?"
              name="industry"
              value={formData.industry}
              onChange={handleUserChange}
            />
            <Input
              label="Enter the profit Margin..? (In persontage)"
              name="profitMargin"
              value={formData.profitMargin}
              onChange={handleUserChange}
            />
          </div>
          <div className="flex gap-2 flex-col w-1/2">
            <Input
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
