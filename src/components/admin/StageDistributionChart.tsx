import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Idea", value: 10 },
  { name: "MVP", value: 25 },
  { name: "Seed", value: 15 },
  { name: "Series A", value: 8 },
];

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#3b82f6"];

export const StageDistributionChart = () => {
  return (
    <ResponsiveContainer width={"100%"} height={"92%"}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={70}
          outerRadius={120}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};
