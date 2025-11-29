import { useEffect, useState } from "react";
import axios from "axios";
import { FraudAndRiskDetectionChart } from "../../components/admin/FraudAndRiskDetectionChart";

interface SummaryItem {
  eventType: string;
  email: string;
  count: number;
}

interface FinalItem {
  eventType: string;
  riskScore: number;
  count: number;
}

export const FraudAndRiskDetection: React.FC = () => {
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [finalData, setFinalData] = useState<FinalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/risk-detection-flags`
        );
        setSummary(res.data.summary);
        setFinalData(res.data.finalData);
      } catch (err) {
        console.error("Error fetching risk flags:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading risk data…</div>;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex border-b-2 pb-10">
        <div className="w-1/3">
          <h1 className="text-3xl font-bold mb-2">Fraud & Risk Detection</h1>
          <p className="text-gray-600 max-w-2xl">
            This dashboard helps you monitor suspicious user activities, detect
            abnormal login patterns, and track high-risk events happening within
            the system. It summarizes flagged behaviors based on event types,
            email usage, and risk scores recorded in the past 12 months.
          </p>
        </div>
        <div className="h-[50vh]  w-3/5">
          <FraudAndRiskDetectionChart data={finalData} />
        </div>
      </div>

      {/* Summary Table */}
      <div className="">
        <h2 className="text-xl font-semibold mb-3">Event Summary</h2>
        <div className="overflow-x-auto border rounded-lg max-h-80">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Event Type</th>
                <th className="p-3">Email</th>
                <th className="p-3">Total Events</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.eventType}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Data Table */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Risk Score Breakdown (Last 12 Months)
        </h2>
        <div className="overflow-x-auto border rounded-lg max-h-80">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Event Type</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Event Count</th>
              </tr>
            </thead>
            <tbody>
              {finalData.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.eventType}</td>
                  <td className="p-3">{item.riskScore}</td>
                  <td className="p-3">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
