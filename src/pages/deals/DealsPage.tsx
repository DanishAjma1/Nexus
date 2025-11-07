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
    <div className="space-y-6 bg-black min-h-screen p-6 text-gray-200 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">Investment Deals</h1>
          <p className="text-gray-400">Track and manage your investment pipeline</p>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded-lg transition"
        >
          {showForm ? "Cancel" : "Add Deal"}
        </Button>
      </div>

      {/* Add Deal Form */}
      {showForm && (
        <Card className="bg-neutral-900 border border-yellow-600 text-gray-200">
          <CardHeader>
            <h2 className="text-lg font-semibold text-yellow-400">New Deal</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              placeholder="Startup Name"
              value={newDeal.name}
              onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
              className="bg-black text-yellow-300 border-yellow-600"
            />
            <Input
              placeholder="Logo URL"
              value={newDeal.logo}
              onChange={(e) => setNewDeal({ ...newDeal, logo: e.target.value })}
              className="bg-black text-yellow-300 border-yellow-600"
            />
            <Input
              placeholder="Industry"
              value={newDeal.industry}
              onChange={(e) => setNewDeal({ ...newDeal, industry: e.target.value })}
              className="bg-black text-yellow-300 border-yellow-600"
            />
            <Input
              placeholder="Amount (e.g. $1M)"
              value={newDeal.amount}
              onChange={(e) => setNewDeal({ ...newDeal, amount: e.target.value })}
              className="bg-black text-yellow-300 border-yellow-600"
            />
            <Input
              placeholder="Equity (e.g. 10%)"
              value={newDeal.equity}
              onChange={(e) => setNewDeal({ ...newDeal, equity: e.target.value })}
              className="bg-black text-yellow-300 border-yellow-600"
            />
            <Input
              placeholder="Stage (e.g. Seed, Series A)"
              value={newDeal.stage}
              onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
              className="bg-black text-yellow-300 border-yellow-600"
            />

            <select
              className="border border-yellow-600 bg-black text-yellow-300 rounded p-2 w-full"
              value={newDeal.status}
              onChange={(e) => setNewDeal({ ...newDeal, status: e.target.value })}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <Button
              onClick={handleAddDeal}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition"
            >
              Save Deal
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search deals by startup name or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={<Search size={18} className="text-yellow-400" />}
            className="bg-neutral-900 text-yellow-300 border-yellow-600"
          />
        </div>

        <div className="w-full md:w-1/3">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-yellow-500" />
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Badge
                  key={status}
                  variant={
                    selectedStatus.includes(status) ? "warning" : "outline"
                  }
                  className={`cursor-pointer border ${
                    selectedStatus.includes(status)
                      ? "bg-yellow-500 text-black"
                      : "border-yellow-500 text-yellow-400"
                  }`}
                  onClick={() => toggleStatus(status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deals table */}
      <Card className="bg-neutral-900 border border-yellow-600 text-gray-200">
        <CardHeader>
          <h2 className="text-lg font-semibold text-yellow-400">Active Deals</h2>
        </CardHeader>
        <CardBody>
          {filteredDeals.length === 0 ? (
            <p className="text-gray-500 text-sm">No deals found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-yellow-700 bg-black text-yellow-400">
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Startup</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Equity</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Last Activity</th>
                    <th className="px-6 py-3 text-right text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-800">
                  {filteredDeals.map((deal) => (
                    <tr
                      key={deal.id}
                      className="hover:bg-yellow-900/20 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar src={deal.startup.logo} alt={deal.startup.name} size="sm" />
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-yellow-300">
                              {deal.startup.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {deal.startup.industry}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-yellow-300">{deal.amount}</td>
                      <td className="px-6 py-4 text-yellow-300">{deal.equity}</td>
                      <td className="px-6 py-4">
                        <Badge className="bg-yellow-500 text-black font-semibold px-2 py-1 rounded">
                          {deal.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-yellow-300">{deal.stage}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(deal.lastActivity).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black transition"
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
