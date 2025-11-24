import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function StartupGrowthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="month" tickMargin={8} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <CartesianGrid stroke="#ddd" />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#4f4293"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
