import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MessageCircle,
  Building2,
  MapPin,
  UserCircle,
  BarChart3,
  Briefcase,
  Eraser,
  DollarSign,
} from "lucide-react";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useAuth } from "../../context/AuthContext";
import { getInvestorById, updateInvestorData } from "../../data/users";
import { Investor } from "../../types";
import { Input } from "../../components/ui/Input";

export const InvestorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const { user: currentUser } = useAuth();
  const [investor, setInvestor] = useState<Investor>();
  const initialData = {
    userId: id,
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
  };
  const [formData, setFormData] = useState(initialData);
  // Fetch investor data
  useEffect(() => {
    const fetchInvestors = async () => {
      const investor = await getInvestorById(id);
      setInvestor(investor);
    };
    fetchInvestors();
  }, []);

  useEffect(() => {
    setFormData(initialData);
  }, [investor]);

  if (!currentUser) return null;
  if (!investor || investor.role !== "investor") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Investor not found</h2>
        <p className="text-gray-600 mt-2">
          The investor profile you're looking for doesn't exist or has been
          removed.
        </p>
        <Link to="/dashboard/investor">
          <Button variant="outline" className="mt-4">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const isCurrentUser =
    currentUser?.userId === (investor.userId || investor._id);

  const handleChange = (e) => {
    const { checked, name, value } = e.target;
    if (name === "investmentStage") {
      setFormData((prev) => {
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
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.maximumInvestment === "" ||
      formData.minimumInvestment === "" ||
      formData.investmentInterests?.length === 0 ||
      formData.investmentStage?.length === 0
    ) {
      alert("Please input the rquired data...");
      return;
    }
    updateInvestorData(formData);
    const {
      investmentInterests,
      investmentStage,
      minimumInvestment,
      maximumInvestment,
      investmentCriteria,
      successfullExits,
      minTimline,
      maxTimline,
    } = formData;
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
    });
    setFormData(initialData);
    setIsEditing(false);
  };

  const handleInterests = (e) => {
    e.preventDefault();
    const updatedInterests = [
      ...formData.investmentInterests,
      formData.interest,
    ];
    setFormData({
      ...formData,
      investmentInterests: updatedInterests,
      interest: "",
    });
  };

  const handleCriteria = (e) => {
    e.preventDefault();
    const updateCriteria = [...formData.investmentCriteria, formData.criteria];
    setFormData({
      ...formData,
      investmentCriteria: updateCriteria,
      criteria: "",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {isEditing && (
        <div className="fixed inset-0 animate-slide-in animate-slide-out flex items-center justify-center bg-black/40 z-20">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-h-3/6 overflow-y-scroll w-4/5 flex flex-col min-w-60 flex-shrink">
            <h2 className="text-xl font-medium my-5 underline underline-offset-4 flex justify-center">
              Profile Update
            </h2>
            <form
              onSubmit={handleSubmit}
              className="gap-5 flex flex-row text-sm justify-center"
            >
              <div className="flex gap-2 flex-col border-r-2 pr-4">
                <div className="flex gap-2 w-full">
                  <Input
                    label="Investment Interests..?"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    disabled={formData.investmentInterests.length === 4}
                    helperText={`${
                      5 - formData.investmentInterests.length
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
                  {formData.investmentInterests?.map((item, idx) => (
                    <div
                      key={idx}
                      className=" border-r-2 text-sm pr-1 flex gap-2"
                    >
                      {item}
                      <button
                        className="bg-gray-50 p-1 w-fit rounded-full"
                        onClick={(e) => {
                          e.preventDefault();
                          const updatedInterests =
                            formData.investmentInterests.filter((_, index) => {
                              return index !== idx;
                            });
                          setFormData({
                            ...formData,
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
                    checked={formData.investmentStage?.includes("Seed")}
                    onChange={handleChange}
                  />
                  <label className="text-sm border-r-2 pr-2">Seed</label>
                  <input
                    type="checkbox"
                    name="investmentStage"
                    value="Pre seed"
                    checked={formData.investmentStage?.includes("Pre seed")}
                    onChange={handleChange}
                  />
                  <label className="text-sm border-r-2 pr-2">Seed</label>
                  <input
                    type="checkbox"
                    name="investmentStage"
                    value="Series A"
                    checked={formData.investmentStage?.includes("Series A")}
                    onChange={handleChange}
                  />
                  <label className="text-sm border-r-2 pr-2">Series A</label>
                </div>
                <Input
                  label="Minimum investment..?"
                  name="minimumInvestment"
                  value={formData.minimumInvestment}
                  onChange={handleChange}
                />
                <Input
                  label="Maximum investment..?"
                  name="maximumInvestment"
                  value={formData.maximumInvestment}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-2 flex-col">
                <div className="flex gap-2 w-full">
                  <Input
                    label="Investment Criteria..?"
                    name="criteria"
                    value={formData.criteria}
                    onChange={handleChange}
                    disabled={formData.investmentCriteria.length >= 5}
                    helperText={`${
                      5 - formData.investmentCriteria.length
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
                  {formData.investmentCriteria?.map((item, idx) => (
                    <div
                      key={idx}
                      className=" border-r-2 text-sm pr-1 flex gap-2"
                    >
                      {item}
                      <button
                        className="bg-gray-50 p-1 w-fit rounded-full"
                        onClick={(e) => {
                          e.preventDefault();
                          const updatedCriteria =
                            formData.investmentCriteria?.filter((_, index) => {
                              return index !== idx;
                            });
                          setFormData({
                            ...formData,
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
                  value={formData.successfullExits}
                  onChange={handleChange}
                />
                <Input
                  type="number"
                  label="Minimum time to invest..?"
                  name="minTimline"
                  value={formData.minTimline}
                  onChange={handleChange}
                />
                <Input
                  type="number"
                  label="Maximum time to invest..?"
                  name="maxTimline"
                  value={formData.maxTimline}
                  onChange={handleChange}
                />

                <div className="flex justify-end mt-4 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="outline" size="sm" type="submit">
                    Update
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Profile header */}
      <Card>
        <CardBody className="sm:flex sm:items-start sm:justify-between p-6">
          <div className="sm:flex sm:space-x-6">
            <Avatar
              src={investor.avatarUrl}
              alt={investor.name}
              size="xl"
              status={investor.isOnline ? "online" : "offline"}
              className="mx-auto sm:mx-0"
            />

            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {investor.name}
              </h1>
              <p className="text-gray-600 flex items-center justify-center sm:justify-start mt-1">
                <Building2 size={16} className="mr-1" />
                Investor • {investor.totalInvestments} investments
              </p>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                <Badge variant="primary">
                  <MapPin size={14} className="mr-1" />
                  San Francisco, CA
                </Badge>
                {investor.investmentStage &&
                  investor.investmentStage.map((stage, index) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {stage}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-2 justify-center sm:justify-end">
            {!isCurrentUser && (
              <Link to={`/chat/${investor.userId}`}>
                <Button leftIcon={<MessageCircle size={18} />}>Message</Button>
              </Link>
            )}

            {isCurrentUser && (
              <Button
                variant="outline"
                leftIcon={<UserCircle size={18} />}
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - left side */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">About</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">{investor.bio}</p>
            </CardBody>
          </Card>

          {/* Investment Interests */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Investment Interests
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Industries
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {investor.investmentInterests &&
                      investor.investmentInterests.map((interest, index) => (
                        <Badge key={index} variant="primary" size="md">
                          {interest}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Investment Stages
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {investor.investmentStage &&
                      investor.investmentStage.map((stage, index) => (
                        <Badge key={index} variant="secondary" size="md">
                          {stage}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Investment Criteria
                  </h3>
                  <ul className="mt-2 space-y-2 text-gray-700">
                    {investor.investmentCriteria?.map((ic, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-1.5 mr-2"></span>
                        {ic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Portfolio Companies */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Portfolio Companies
              </h2>
              <span className="text-sm text-gray-500">
                {investor.portfolioCompanies &&
                  investor.portfolioCompanies.length}{" "}
                companies
              </span>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {investor.portfolioCompanies &&
                  investor.portfolioCompanies.map((company, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 border border-gray-200 rounded-md"
                    >
                      <div className="p-3 bg-primary-50 rounded-md mr-3">
                        <Briefcase size={18} className="text-primary-700" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {company}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Invested in 2022
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar - right side */}
        <div className="space-y-6">
          {/* Investment Details */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Investment Details
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">
                    Investment Range
                  </span>
                  <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <DollarSign size={16} className="text-red-500" />
                    {investor.minimumInvestment &&
                      investor.minimumInvestment} -{" "}
                    {investor.maximumInvestment && investor.maximumInvestment}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">
                    Total Investments
                  </span>
                  <p className="text-md font-medium text-gray-900">
                    {investor.totalInvestments} companies
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">
                    Typical Investment Timeline
                  </span>
                  <p className="text-md font-medium text-gray-900">
                    {investor.minTimline}-{investor.maxTimline} years
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Investment Focus
                  </span>
                  <div className="mt-2 space-y-2">
                    {investor.investmentInterests &&
                      investor.investmentInterests.map((interest, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span className="text-xs font-medium">
                            {interest}
                          </span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: "75%" }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Investment Stats
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Successful Exits
                      </h3>
                      <p className="text-xl font-semibold text-primary-700 mt-1">
                        {formData.successfullExits}
                      </p>
                    </div>
                    <BarChart3 size={24} className="text-primary-600" />
                  </div>
                </div>

                <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Avg. ROI
                      </h3>
                      <p className="text-xl font-semibold text-primary-700 mt-1">
                        3.2x
                      </p>
                    </div>
                    <BarChart3 size={24} className="text-primary-600" />
                  </div>
                </div>

                <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Active Investments
                      </h3>
                      <p className="text-xl font-semibold text-primary-700 mt-1">
                        {investor.portfolioCompanies &&
                          investor.portfolioCompanies.length}
                      </p>
                    </div>
                    <BarChart3 size={24} className="text-primary-600" />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
