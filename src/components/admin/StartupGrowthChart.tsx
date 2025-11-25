import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  month: string;
  inv?: number;
  ent?: number;
};

type Props = {
  data: ChartData[];
};

export const StartupGrowthChart: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <CartesianGrid stroke="#ddd" />

          <Line
            type="monotone"
            dataKey="entrepreneur"
            stroke="blue"
            strokeWidth={3}
            name="Entrepreneurs"
          />
          <Line
            type="monotone"
            dataKey="investor"
            stroke="yellow"
            strokeWidth={3}
            name="Investors"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
