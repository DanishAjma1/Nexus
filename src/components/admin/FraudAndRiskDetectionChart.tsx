import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    riskScore: 10,
    count: 6,
    eventType: "failed_login",
  },

  {
    riskScore: 13,
    count: 7,
    eventType: "multi time",
  },
  {
    riskScore: 13,
    count: 20,
    eventType: "failed_login",
  },

  {
    riskScore: 20,
    count: 4,
    eventType: "multitime login",
  },
];
export const FraudAndRiskDetectionChart = ({}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="eventType" tickMargin={8} />
        <YAxis allowDecimals={true} />
        <YAxis />
        <Line dataKey="count" type="monotone" stroke="pink" strokeWidth={3} />
        <Line
          dataKey="riskScore"
          type="monotone"
          stroke="brown"
          strokeWidth={3}
        />

        <Tooltip />
        <CartesianGrid stroke="#ddd" />
      </LineChart>
    </ResponsiveContainer>
  );
};
