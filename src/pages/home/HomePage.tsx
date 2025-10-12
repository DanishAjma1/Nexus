import React from "react";
import { Navbar } from "../../components/home/Navbar";

export const HomePage: React.FC = () => {
  const CompaignDiv = ({ image, title }) => {
    return (
      <div className="flex w-full h-40 justify-center hover:scale-105 transition">
        <img
          src={image}
          alt="pic"
          className="absolute w-60 h-40 rounded-md overflow-hidden shadow-inner"
        />
        <div className="bg-black bg-opacity-40 w-60 h-40 absolute" />
        <div className="flex justify-start relative w-52 mt-10">
          <h1 className="text-white text-sm underline underline-offset-2 font-bold font-mono">
            {title}
          </h1>
        </div>
      </div>
    );
  };
  const FundeRaiserDiv = ({ image, fundNeeded, company, description }) => {
    return (
      <div className="flex w-full h-40 text-white justify-center hover:scale-105 transition">
        <img
          src={image}
          alt="pic"
          className="absolute w-60 h-40 rounded-md overflow-hidden shadow-inner"
        />
        <div className="bg-black bg-opacity-40 w-60 h-40 absolute" />
        <div className="flex flex-col gap-2 relative w-52 mt-5">
          <h1 className="text-sm font-bold font-mono">{company}</h1>
          <p className="text-xs">{description}</p>
          <div className="flex text-xs justify-end items-center">
            <span className="text-red-500 underline-offset-1 underline">
              Fund Needed: $
            </span>
            <p> {fundNeeded}</p>
          </div>
          <div className="border-b-2 border-white bottom-4 left-1/2 transform -translate-x-1/2 w-2/3 absolute" />
        </div>
      </div>
    );
  };
  const SuccessfulCompanyDiv = ({ image, company, description, exits }) => {
    return (
      <div className="flex flex-col w-full text-black items-center hover:scale-105 transition">
        <div className="flex flex-col w-3/4 p-5 border-2 rounded-md shadow-md">
          <img
            src={image}
            alt="pic"
            className="h-80 rounded-md overflow-hidden shadow-inner"
          />
          {/* <div className="bg-black bg-opacity-40 w-1/3 h-80 absolute" /> */}
          <div className="flex flex-col gap-2 px-2 mt-5 justify-start">
            <h1 className="text-lg font-bold">
              <strong className="font-serif">Company: </strong>
              {company}
            </h1>
            <p>
              <strong className="font-serif">Description: </strong>
              {description}
            </p>
            <div className="flex items-center">
              <span className="text-green-500">Total exits:</span>
              <p>{exits}</p>
            </div>
            {/* <div className="border-b-2 border-white bottom-4 left-1/2 transform -translate-x-1/2 w-2/3 absolute" /> */}
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
        <div className="absolute w-full h-screen inset-0 bg-black bg-opacity-80" />
        <div className="relative z-10 w-11/12 text-white">
          <div className="flex flex-row ">
            <div className="flex flex-col w-1/5 py-5">
              <h1 className="text-xl font-bold font-serif p-5 underline-offset-4 underline shadow-sm">
                Recent Compaigns..
              </h1>
              <div className="flex flex-col gap-5  border-r-2">
                <CompaignDiv image={"app logo.jpeg"} title={"Flood incident"} />
                <CompaignDiv image={"app logo.jpeg"} title={"Flood incident"} />
                <CompaignDiv image={"app logo.jpeg"} title={"Flood incident"} />
              </div>
            </div>

            <div className="flex w-3/5 h-screen items-center py-5">
              <div className="flex flex-col h-1/3 px-5">
                <h1 className="text-2xl text-center font-mono">
                  The plateform where Entrepreneur and investors can
                  collaborate,make deals and can make secure & successful
                  transactions.{" "}
                </h1>
                <div className="flex items-center justify-center h-full gap-4">
                  <button className="px-5 py-1 bg-orange-300">
                    Getting started
                  </button>
                  <button className="px-5 py-1 bg-orange-300">About Us</button>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-1/5 py-5">
              <h1 className="text-xl font-bold font-serif p-5 underline-offset-4 underline shadow-sm">
                Fundraiser Companies..
              </h1>
              <div className="gap-5 flex flex-col border-l-2">
                <FundeRaiserDiv
                  image={"app logo.jpeg"}
                  company={"Tesla"}
                  fundNeeded={"220k"}
                  description={"You will got huge benefits by investing in it."}
                />
                <FundeRaiserDiv
                  image={"app logo.jpeg"}
                  company={"Tesla"}
                  fundNeeded={"220k"}
                  description={"You will got huge benefits by investing in it."}
                />
                <FundeRaiserDiv
                  image={"app logo.jpeg"}
                  fundNeeded={"220k"}
                  company={"Tesla"}
                  description={"You will got huge benefits by investing in it."}
                />
              </div>
            </div>
          </div>
          <div className="relative flex flex-col my-5">
            <h1 className="text-black text-2xl font-bold w-fit font-serif my-5 p-5 underline-offset-4 underline ">
              Successful Companies..
            </h1>
            <div className="grid grid-cols-3 grid-rows-1 border-2 p-3 rounded-md bg-white shadow-md">
              <div className="grid grid-cols-1">
                <SuccessfulCompanyDiv
                  image={"/app logo.jpeg"}
                  company={"tesla"}
                  description={"You will got huge benefits by investing in it."}
                  exits={4}
                />
              </div>
              <div className="grid grid-cols-1">
                <SuccessfulCompanyDiv
                  image={"/app logo.jpeg"}
                  company={"tesla"}
                  description={"You will got huge benefits by investing in it."}
                  exits={4}
                />
              </div>
              <div className="grid grid-cols-1">
                <SuccessfulCompanyDiv
                  image={"/app logo.jpeg"}
                  company={"tesla"}
                  description={"You will got huge benefits by investing in it."}
                  exits={4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
