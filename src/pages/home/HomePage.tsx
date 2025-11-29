import React from "react";
import { Navbar } from "../../components/home/Navbar";
import { Button } from "../../components/ui/Button";

interface CampaignProps {
  image: string;
  title: string;
  description: string;
  goalAmount: string;
}

interface FundraiserProps {
  image: string;
  fundNeeded: string;
  company: string;
  description: string;
}

interface SuccessfulCompanyProps {
  image: string;
  company: string;
  description: string;
  exits: number;
}

export const HomePage: React.FC = () => {
  const CampaignDiv: React.FC<CampaignProps> = ({
    image,
    title,
    description,
    goalAmount,
  }) => {
    return (
      <div className="flex w-full h-40 justify-center hover:scale-105 transition relative">
        <img
          src={image}
          alt="pic"
          className="absolute w-60 h-40 rounded-md overflow-hidden shadow-inner"
        />
        <div className="bg-black bg-opacity-40 w-60 h-40 absolute rounded-md" />

        <div className="flex flex-col gap-1 relative w-52 mt-5 text-white">
          <h1 className="text-sm font-bold font-mono underline underline-offset-2">
            Title: {title}
          </h1>
          <p className="text-xs">Description: {description}</p>

          <p className="text-xs text-red-400 font-bold">
            Goal Amount: ${goalAmount}
          </p>

          <div className="border-b-2 border-gray-300 w-2/3 mt-2 mx-auto" />
        </div>
      </div>
    );
  };

  const FundraiserDiv: React.FC<FundraiserProps> = ({
    image,
    fundNeeded,
    company,
    description,
  }) => {
    return (
      <div className="flex w-full h-40 text-white justify-center hover:scale-105 transition">
        <img
          src={image}
          alt="pic"
          className="absolute w-60 h-40 rounded-md overflow-hidden shadow-inner"
        />
        <div className="bg-black bg-opacity-40 w-60 h-40 absolute rounded-md" />

        <div className="flex flex-col gap-2 relative w-52 mt-5">
          <h1 className="text-sm font-bold font-mono">{company}</h1>
          <p className="text-xs">{description}</p>
          <div className="flex text-xs justify-end items-center">
            <span className="text-red-500 underline">Fund Needed: $</span>
            <p>{fundNeeded}</p>
          </div>

          <div className="border-b-2 border-white w-2/3 absolute bottom-2 left-1/2 transform -translate-x-1/2" />
        </div>
      </div>
    );
  };

  const SuccessfulCompanyDiv: React.FC<SuccessfulCompanyProps> = ({
    image,
    company,
    description,
    exits,
  }) => {
    return (
      <div className="flex flex-col w-full text-black items-center hover:scale-105 transition">
        <div className="flex flex-col w-3/4 p-5 border-2 rounded-md shadow-md">
          <img
            src={image}
            alt="pic"
            className="h-80 rounded-md overflow-hidden shadow-inner"
          />

          <div className="flex flex-col gap-2 px-2 mt-5">
            <h1 className="text-lg font-bold">
              <strong className="font-serif">Company: </strong>
              {company}
            </h1>

            <p>
              <strong className="font-serif">Description: </strong>
              {description}
            </p>

            <div className="flex items-center">
              <span className="text-green-500 mr-1">Total exits:</span>
              <p>{exits}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />

      <div className="w-full flex justify-center relative">
        <img
          src="app logo.jpeg"
          className="absolute inset-0 w-full h-screen object-cover"
        />

        <div className="absolute w-full h-screen bg-black bg-opacity-80" />

        <div className="relative z-10 w-11/12 text-white">
          <div className="flex flex-row">
            {/* LEFT SIDE — Recent Campaigns */}
            <div className="flex flex-col w-1/5 py-5">
              <h1 className="text-xl font-bold font-serif p-5 underline underline-offset-4 shadow-sm">
                Recent Campaigns..
              </h1>

              <div className="flex flex-col gap-5 border-r-2 pr-2">
                <CampaignDiv
                  image="app logo.jpeg"
                  title="mr"
                  description="3456"
                  goalAmount="12345k"
                />
                <CampaignDiv
                  image="app logo.jpeg"
                  title="rfgh"
                  description="12345"
                  goalAmount="1234k"
                />
                <CampaignDiv
                  image="app logo.jpeg"
                  title="mr"
                  description="rdftyu"
                  goalAmount="1234k"
                />
              </div>
            </div>

            {/* MID CONTENT */}
            <div className="flex w-3/5 h-screen items-center py-5">
              <div className="flex flex-col h-1/3 px-5">
                <h1 className="text-2xl text-center font-mono">
                  The platform where Entrepreneurs and Investors collaborate,
                  make deals and build successful ventures.
                </h1>

                <div className="flex items-center justify-center h-full gap-4">
                  <Button className="px-5 py-1 bg-orange-300 text-black">
                    Getting started
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE — Fundraisers */}
            <div className="flex flex-col w-1/5 py-5">
              <h1 className="text-xl font-bold font-serif p-5 underline underline-offset-4 shadow-sm">
                Fundraisers..
              </h1>

              <div className="gap-5 flex flex-col border-l-2 pl-2">
                <FundraiserDiv
                  image="app logo.jpeg"
                  company="Tesla"
                  fundNeeded="220k"
                  description="You will get huge benefits by investing."
                />
                <FundraiserDiv
                  image="app logo.jpeg"
                  company="Tesla"
                  fundNeeded="220k"
                  description="You will get huge benefits by investing."
                />
                <FundraiserDiv
                  image="app logo.jpeg"
                  company="Tesla"
                  fundNeeded="220k"
                  description="You will get huge benefits by investing."
                />
              </div>
            </div>
          </div>

          {/* SUCCESSFUL ENTREPRENEURS */}
          <div className="relative flex flex-col my-5">
            <h1 className="text-black text-2xl font-bold w-fit font-serif my-5 p-5 underline underline-offset-4">
              Successful Entrepreneurs..
            </h1>

            <div className="grid grid-cols-3 gap-4">
              <SuccessfulCompanyDiv
                image="app logo.jpeg"
                company="Tesla"
                description="You will gain huge benefits."
                exits={4}
              />
              <SuccessfulCompanyDiv
                image="app logo.jpeg"
                company="Tesla"
                description="You will gain huge benefits."
                exits={4}
              />
              <SuccessfulCompanyDiv
                image="app logo.jpeg"
                company="Tesla"
                description="You will gain huge benefits."
                exits={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
