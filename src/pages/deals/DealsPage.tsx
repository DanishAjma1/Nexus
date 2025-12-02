import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";

interface Deal {
  id: number;
  startup: {
    name: string;
    logo: string;
    industry: string;
  };
  amount: string;
  equity: string;
  status: string;
  stage: string;
  lastActivity: string;
}

export const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newDeal, setNewDeal] = useState({
    name: "",
    logo: "",
    industry: "",
    amount: "",
    equity: "",
    status: "Due Diligence",
    stage: "Seed",
  });

  const statuses = ["Due Diligence", "Term Sheet", "Negotiation", "Closed", "Passed"];

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Due Diligence":
        return "purple";
      case "Term Sheet":
        return "purple/400";
      case "Negotiation":
        return "purple/300";
      case "Closed":
        return "green";
      case "Passed":
        return "red";
      default:
        return "gray";
    }
  };

  const handleAddDeal = () => {
    if (!newDeal.name || !newDeal.amount) return;

    const deal: Deal = {
      id: Date.now(),
      startup: {
        name: newDeal.name,
        logo: newDeal.logo || "https://via.placeholder.com/50",
        industry: newDeal.industry || "Unknown",
      },
      amount: newDeal.amount,
      equity: newDeal.equity,
      status: newDeal.status,
      stage: newDeal.stage,
      lastActivity: new Date().toISOString(),
    };

    setDeals((prev) => [...prev, deal]);
    setNewDeal({
      name: "",
      logo: "",
      industry: "",
      amount: "",
      equity: "",
      status: "Due Diligence",
      stage: "Seed",
    });
    setShowForm(false);
  };

  const filteredDeals = deals.filter(
    (deal) =>
      (deal.startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.startup.industry.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedStatus.length === 0 || selectedStatus.includes(deal.status))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-purple-100">Investment Deals</h1>
          <p className="text-purple-300">Track and manage your investment pipeline</p>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-700 text-purple-100 hover:bg-purple-600"
        >
          {showForm ? "Cancel" : "Add Deal"}
        </Button>
      </div>

    {/* Add Deal Form */}
{showForm && (
  <Card className="bg-gradient-to-br from-purple-900 to-black border border-purple-700 shadow-lg">
    <CardHeader className="border-b border-purple-700">
      <h2 className="text-lg font-medium text-purple-100">New Deal</h2>
    </CardHeader>
    <CardBody className="space-y-4">
      {/* Input fields */}
      {["name", "logo", "industry", "amount", "equity", "stage"].map((field) => (
        <input
          key={field}
          type="text"
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={newDeal[field as keyof typeof newDeal]}
          onChange={(e) => setNewDeal({ ...newDeal, [field]: e.target.value })}
          className="w-full p-2 rounded-lg bg-black text-purple-100 placeholder-purple-400 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      ))}

      {/* Status dropdown */}
      <select
        className="w-full p-2 rounded-lg bg-black text-purple-100 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={newDeal.status}
        onChange={(e) => setNewDeal({ ...newDeal, status: e.target.value })}
      >
        {statuses.map((status) => (
          <option key={status} value={status} className="bg-black text-purple-100">
            {status}
          </option>
        ))}
      </select>

      {/* Save button */}
      <Button
        onClick={handleAddDeal}
        className="bg-purple-700 text-purple-100 hover:bg-purple-600 w-full"
      >
        Save Deal
      </Button>
    </CardBody>
  </Card>
)}


      {/* Filters / Search */}
<div className="flex flex-col md:flex-row gap-4">
  {/* Dark purple + black search bar */}
  <div className="w-full md:w-2/3">
    <div className="flex items-center bg-black rounded-lg p-2 w-full shadow-md">
      <Search size={20} className="text-purple-400 mr-2" />
      <input
        type="text"
        placeholder="Search deals by startup name or industry..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-black text-purple-100 placeholder-purple-400 w-full focus:outline-none"
      />
    </div>
  </div>

  {/* Filter badges */}
  <div className="w-full md:w-1/3">
    <div className="flex items-center gap-2 text-purple-100">
      <Filter size={18} className="text-purple-300" />
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Badge
            key={status}
            variant={selectedStatus.includes(status) ? getStatusColor(status) : "gray"}
            className="cursor-pointer"
            onClick={() => toggleStatus(status)}
          >
            {status}
          </Badge>
        ))}
      </div>
    </div>
  </div>
</div>

      {/* Deals Table */}
      <Card className="bg-purple-900 border-purple-800">
        <CardHeader>
          <h2 className="text-lg font-medium text-purple-100">Active Deals</h2>
        </CardHeader>
        <CardBody>
          {filteredDeals.length === 0 ? (
            <p className="text-purple-300 text-sm">No deals found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-purple-100">
                <thead>
                  <tr className="border-b border-purple-700">
                    {["Startup","Amount","Equity","Status","Stage","Last Activity","Actions"].map((th) => (
                      <th
                        key={th}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-purple-300"
                      >
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-700">
                  {filteredDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-purple-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar
                            src={deal.startup.logo}
                            alt={deal.startup.name}
                            size="sm"
                            className="flex-shrink-0 ring-1 ring-purple-600"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium">{deal.startup.name}</div>
                            <div className="text-sm text-purple-300">{deal.startup.industry}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{deal.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{deal.equity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(deal.status)}>{deal.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{deal.stage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-purple-300">
                        {new Date(deal.lastActivity).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-600 text-purple-100 hover:bg-purple-700"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
