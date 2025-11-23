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
    <ResponsiveContainer>
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="industry" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <CartesianGrid stroke="#ddd" />
        <Bar type="monotone" dataKey="count" stroke="#4f4293" strokeWidth={3} />
      </BarChart>
    </ResponsiveContainer>
  );
}
