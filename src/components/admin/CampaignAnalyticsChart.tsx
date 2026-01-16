import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface ChartData {
    name: string;
    raised: number;
    goal: number;
}

interface Props {
    data: ChartData[];
}

export const CampaignAnalyticsChart: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRaised" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        interval={0}
                        tick={{ fontSize: 10, fill: '#666' }}
                    />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                        type="monotone"
                        dataKey="raised"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorRaised)"
                        name="Raised Amount"
                        strokeWidth={3}
                    />
                    <Area
                        type="monotone"
                        dataKey="goal"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorGoal)"
                        name="Goal Amount"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
