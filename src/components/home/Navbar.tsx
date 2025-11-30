import React from "react";

export const Navbar: React.FC = () => {
  const ListItem = ({ data }) => {
    return (
      <li className="text-black py-5 px-2 hover:cursor-pointer hover:scale-105 transition-all duration-200 hover:text-white">
        {data}
      </li>
    );
  };
  const navList = ["Get started", "Compaigns", "FundRaise"];
  return (
    <div className="py-5 flex flex-row bg-black items-center">
      <div className="w-1/2 gap-3 flex items-center ml-10">
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
        <h1 className="text-white text-lg">Trust Bridge AI</h1>
      </div>
      <div className="w-1/2 flex justify-end">
        <ul className="flex flex-row px-10 rounded-tl-md rounded-bl-md bg-blue-500">
          {navList.map((item, idx) => (
            <ListItem key={idx} data={item} />
          ))}
        </ul>
      </div>
    </div>
  );
};
