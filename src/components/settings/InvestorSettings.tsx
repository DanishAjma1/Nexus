import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Investor } from "../../types";
import { getInvestorById, updateInvestorData } from "../../data/users";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Eraser } from "lucide-react";

export const InvestorSettings: React.FC = () => {
  const { user } = useAuth();

  const [investor, setInvestor] = useState<Investor>();
  const initialInvestorData = useMemo(
    () => ({
      userId: investor?.userId,
      investmentInterests: investor?.investmentInterests || [],
      investmentStage: investor?.investmentStage || [],
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
    [investor]
  );

  const [investorFormData, setInvestorFormData] = useState(initialInvestorData);
  // Fetch investor data
  useEffect(() => {
    const fetchInvestors = async () => {
      const investor = await getInvestorById(user?.userId);
      setInvestor(investor);
    };
    fetchInvestors();
  }, [user]);

  useEffect(() => {
    setInvestorFormData(initialInvestorData);
  }, [initialInvestorData]);

  const handleInvestorChange = (e) => {
    const { checked, name, value } = e.target;
    if (name === "investmentStage") {
      setInvestorFormData((prev) => {
        const current = prev.investmentStage;

        if (checked) {
          return { ...prev, investmentStage: [...current, value] };
        } else {
          return {
            ...prev,
            investmentStage: current.filter((item) => item !== value),
          };
        }
      });
    } else {
      setInvestorFormData({ ...investorFormData, [name]: value });
    }
  };
  const handleInvestorSubmit = async (e) => {
    e.preventDefault();
    if (
      investorFormData.maximumInvestment === "" ||
      investorFormData.minimumInvestment === "" ||
      investorFormData.investmentInterests?.length === 0 ||
      investorFormData.investmentStage?.length === 0
    ) {
      alert("Please input the rquired data...");
      return;
    }
    updateInvestorData(investorFormData);
    const {
      investmentInterests,
      investmentStage,
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
      investmentStage,
      minimumInvestment,
      maximumInvestment,
      investmentCriteria,
      successfullExits,
      minTimline,
      maxTimline,
    } as Investor);
    setInvestorFormData(initialInvestorData);
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
    <div>
      <form
        onSubmit={handleInvestorSubmit}
        className="gap-5 flex flex-col text-sm justify-center"
      >
        <div className="flex flex-row">
        <div className="flex w-1/2 gap-2 flex-col border-r-2 pr-4">
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

          <label className="font-medium text-sm">Investment Stage</label>
          <div className="flex gap-3">
            <input
              type="checkbox"
              name="investmentStage"
              value="Seed"
              checked={investorFormData.investmentStage?.includes("Seed")}
              onChange={handleInvestorChange}
            />
            <label className="text-sm border-r-2 pr-2">Seed</label>
            <input
              type="checkbox"
              name="investmentStage"
              value="Pre seed"
              checked={investorFormData.investmentStage?.includes("Pre seed")}
              onChange={handleInvestorChange}
            />
            <label className="text-sm border-r-2 pr-2">Seed</label>
            <input
              type="checkbox"
              name="investmentStage"
              value="Series A"
              checked={investorFormData.investmentStage?.includes("Series A")}
              onChange={handleInvestorChange}
            />
            <label className="text-sm border-r-2 pr-2">Series A</label>
          </div>
          <Input
            label="Minimum investment..?"
            name="minimumInvestment"
            value={investorFormData.minimumInvestment}
            onChange={handleInvestorChange}
          />
          <Input
            label="Maximum investment..?"
            name="maximumInvestment"
            value={investorFormData.maximumInvestment}
            onChange={handleInvestorChange}
          />
        </div>
        <div className="flex gap-2 w-1/2 flex-col pl-4">
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
          <Input
            type="number"
            label="Successfull Exits..?"
            name="successfullExits"
            value={investorFormData.successfullExits}
            onChange={handleInvestorChange}
          />
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
