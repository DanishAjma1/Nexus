// components/entrepreneur/EntrepreneurCard.tsx
"use client";
import React from "react";
import { Entrepreneur } from "../../types";

type Props = {
  entrepreneur: Entrepreneur;
  className?: string; // allow external className
};

export const EntrepreneurCard: React.FC<Props> = ({ entrepreneur, className }) => {
  return (
    <div
  className={`p-4 rounded-md shadow-md bg-gray-900 border border-purple-700 ${className}`}
>
  <h3 className="text-lg font-semibold text-inherit">{entrepreneur.name}</h3>
  <p className="text-sm text-inherit">{entrepreneur.startupName}</p>
  <p className="text-sm mt-1 text-inherit">{entrepreneur.pitchSummary}</p>
  <p className="text-xs mt-1 text-inherit">{entrepreneur.industry}</p>
  <p className="text-xs mt-1 text-inherit">Funding Needed: {entrepreneur.fundingNeeded}</p>
</div>

  );
};
