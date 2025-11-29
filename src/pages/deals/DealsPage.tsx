import React, { useState } from "react";
import {
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
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
        return "primary";
      case "Term Sheet":
        return "secondary";
      case "Negotiation":
        return "accent";
      case "Closed":
        return "success";
      case "Passed":
        return "error";
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
          <h1 className="text-2xl font-bold text-gray-900">Investment Deals</h1>
          <p className="text-gray-600">
            Track and manage your investment pipeline
          </p>
        </div>

        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Deal"}
        </Button>
      </div>

      {/* Add Deal Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">New Deal</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              placeholder="Startup Name"
              value={newDeal.name}
              onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
            />
            <Input
              placeholder="Logo URL"
              value={newDeal.logo}
              onChange={(e) => setNewDeal({ ...newDeal, logo: e.target.value })}
            />
            <Input
              placeholder="Industry"
              value={newDeal.industry}
              onChange={(e) =>
                setNewDeal({ ...newDeal, industry: e.target.value })
              }
            />
            <Input
              placeholder="Amount (e.g. $1M)"
              value={newDeal.amount}
              onChange={(e) =>
                setNewDeal({ ...newDeal, amount: e.target.value })
              }
            />
            <Input
              placeholder="Equity (e.g. 10%)"
              value={newDeal.equity}
              onChange={(e) =>
                setNewDeal({ ...newDeal, equity: e.target.value })
              }
            />
            <Input
              placeholder="Stage (e.g. Seed, Series A)"
              value={newDeal.stage}
              onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
            />
            <select
              className="border rounded p-2 w-full"
              value={newDeal.status}
              onChange={(e) =>
                setNewDeal({ ...newDeal, status: e.target.value })
              }
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <Button onClick={handleAddDeal}>Save Deal</Button>
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
            startAdornment={<Search size={18} />}
            fullWidth
          />
        </div>

        <div className="w-full md:w-1/3">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Badge
                  key={status}
                  variant={
                    selectedStatus.includes(status)
                      ? getStatusColor(status)
                      : "gray"
                  }
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

      {/* Deals table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Active Deals</h2>
        </CardHeader>
        <CardBody>
          {filteredDeals.length === 0 ? (
            <p className="text-gray-500 text-sm">No deals found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Startup
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar
                            src={deal.startup.logo}
                            alt={deal.startup.name}
                            size="sm"
                            className="flex-shrink-0"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {deal.startup.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {deal.startup.industry}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{deal.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{deal.equity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(deal.status)}>
                          {deal.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{deal.stage}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(deal.lastActivity).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="outline" size="sm">
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


