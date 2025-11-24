import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { industry: "Fintech", count: 12 },
  { industry: "Health", count: 8 },
  { industry: "EdTech", count: 15 },
  { industry: "SaaS", count: 20 },
];

export default function StartupIndustryChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="industry" tickMargin={8} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <CartesianGrid stroke="#ddd" />
        <Bar type="monotype" dataKey="count" stroke="lime" strokeWidth={3} />
      </BarChart>
    </ResponsiveContainer>
  );
}
