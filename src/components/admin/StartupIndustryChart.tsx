import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export const StartupIndustryChart = ({ data }) => {
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
};
