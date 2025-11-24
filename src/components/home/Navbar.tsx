"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Campaign {
  _id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  category: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  images?: string[];
}

export const Navbar: React.FC = () => {
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchRecentCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/campaigns");
        const recent = res.data
          .filter((c: Campaign) => c.status === "active")
          .sort(
            (a: Campaign, b: Campaign) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);
        setRecentCampaigns(recent);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      }
    };
    fetchRecentCampaigns();
  }, []);

  const navList = ["Get started", "Campaigns", "FundRaise"];

  const ListItem = ({ data }: { data: string }) => (
    <li className="text-black py-5 px-3 hover:cursor-pointer hover:animate-bounce hover:text-orange-500 font-medium">
      {data}
    </li>
  );

  return (
    <div>
      {/* Navbar */}
      <div className="py-5 flex flex-row bg-black items-center px-6">
        <div className="w-1/2 flex items-center gap-3">
          <div className="w-14 h-14 bg-primary-600 rounded-md flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-white text-lg font-bold">Trust Bridge AI</h1>
        </div>
        <div className="w-1/2 flex justify-end">
          <ul className="flex flex-row gap-4 bg-orange-300 rounded-tl-md rounded-bl-md px-6">
            {navList.map((item, idx) => (
              <ListItem key={idx} data={item} />
            ))}
          </ul>
        </div>
      </div>

      {recentCampaigns.length > 0 && (
      <div className="p-4 bg-black max-w-xs">
       <h2 className="text-xl font-bold mb-6 text-white 
                drop-shadow-[0_0_6px_rgba(255,0,0,0.7)]
               text-center">
              Recent Active Campaigns
       </h2>



    <div className="flex flex-col gap-3">
      {recentCampaigns.map((c) => (
        <div
           key={c._id}
  className="bg-[#1a1a1a] hover:bg-[#2a2a2a] 
             rounded-xl p-4 shadow-md 
             hover:scale-105 transition-all duration-200"
           >
          {c.images?.[0] && (
            <img
              src={`http://localhost:5000${c.images[0]}`}
              alt={c.title}
              className="w-full h-32 object-cover rounded-md mb-3"
            />
          )}

          <h3 className="text-lg font-semibold text-white mb-1">
            Title :{c.title}
          </h3>

          <p className="text-gray-300 text-sm mb-2">
            Description: {c.description}
          </p>

          <p className="text-red-400 font-semibold mb-4">
            Goal Amount: ${c.goalAmount}k
          </p>

          <div className="w-20 h-[3px] bg-white/60 rounded mx-auto"></div>
        </div>
      ))}
    </div>
  </div>
)}


    </div>
  );
};
