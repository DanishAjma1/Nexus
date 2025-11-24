import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", funding: 20000 },
  { month: "Feb", funding: 50000 },
  { month: "Mar", funding: 80000 },
  { month: "Apr", funding: 120000 },
];

export default function FundingChart() {
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <AreaChart data={data}>
        <XAxis dataKey="month" tickMargin={8} />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="black" />
        <Area
          type="monotone"
          dataKey="funding"
          stroke="#16234a"
          fill="#86e32c"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
