import React, { useEffect, useRef, useState } from "react";
import { Input } from "../../components/ui/Input";
import { SearchIcon, Trash } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { ThreeDotsButton } from "../../components/ui/ThreeDotsButton";

interface Supporter {
  _id: string;
  name: string;
  email: string;
  campaign: string;
  amount: number;
}

export const Supporters: React.FC = () => {
  const [supporters, setSupportors] = useState<Supporter[]>([]);
  const [searchedSupportors, setSearchedSupportors] = useState<Supporter[]>([]);
  const [query, setQuery] = useState<string>("");
  const [searched, setSearched] = useState<string>("");

  useEffect(() => {
    // DUMMY SUPPORTERS DATA
    const dumySupporters: Supporter[] = [
      {
        _id: "1",
        name: "Ali Raza",
        email: "ali@example.com",
        campaign: "Eco-Friendly Water Bottles",
        amount: 5000,
      },
      {
        _id: "2",
        name: "Jessica Smith",
        email: "jessica@example.com",
        campaign: "AI Study Planner App",
        amount: 12000,
      },
      {
        _id: "3",
        name: "Hassan Khan",
        email: "hassan@example.com",
        campaign: "Organic Farming Project",
        amount: 3000,
      },
    ];
    setSupportors(dumySupporters);
  }, []);
  const [showDialog, setShowDialog] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef(null);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        setShowDialog(false);
        setIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const TableRow = ({ sup, idx }) => {
    return (
      <tr key={idx} className="border-t hover:bg-gray-50 relative group">
        <td className="px-4 py-2">{sup.name}</td>
        <td className="px-4 py-2">{sup.email}</td>
        <td className="px-4 py-2">{sup.campaign}</td>

        <td className="flex items-center relative">
          <span className="px-4 py-2 font-semibold text-green-700">
            ${sup.amount.toLocaleString()}
          </span>

          {/* 3-dots button */}
          <ThreeDotsButton
            variant="ghost"
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setIndex(idx);
              setShowDialog((prev) => !prev);
            }}
          />

          {/* dropdown menu */}
          {showDialog && index === idx && (
            <div
              ref={dialogRef}
              className="absolute right-0 top-full mt-2 w-28 bg-white border shadow-md rounded-md z-50 flex flex-col"
            >
              <Button
                variant="ghost"
                className="border-b text-xs hover:text-blue-500"
                onClick={() => {
                  alert(`Viewing ${sup.name}`);
                  setShowDialog(false);
                }}
              >
                Mail to
              </Button>

              <Button
                variant="ghost"
                className="border-b text-xs hover:text-red-500"
                onClick={() => {
                  alert(`Deleting supporter ${sup.name}`);
                  setShowDialog(false);
                }}
              >
                Delete
              </Button>
            </div>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-10 underline underline-offset-8">
        Crowdfund Supporters
      </h1>

      <div className="w-full">
        <form
          className=" flex items-start gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(query);
            const filterSupportors = supporters.filter((ent) =>
              ent.name.toLowerCase().includes(query.toLowerCase())
            );

            if (filterSupportors.length !== 0)
              setSearchedSupportors([...filterSupportors]);
            else setSearchedSupportors([]);
          }}
        >
          <Input
            type="text"
            placeholder="Search supportors with name email or compaign.."
            className="w-1/2"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") {
                setSearchedSupportors([]);
                setSearched("");
              }
            }}
          />
          <div className="flex justify-start items-center">
            <button
              type="submit"
              className="hover:cursor-pointer text-white border-2 border-l-0 bg-gray-700 hover:bg-gray-500 focus:bg-black px-5 py-1.5 rounded-md"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-end text-xs p-2 gap-2">
        <span>
          {searched
            ? `Results '${searched}' searched count: `
            : "Total Supportors:"}{" "}
        </span>
        {searched ? searchedSupportors.length : supporters.length}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-gray-100 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Amount Invested</th>
            </tr>
          </thead>

          <tbody>
            {searchedSupportors.length !== 0 ? (
              searchedSupportors.map((user, idx) => (
                <TableRow sup={user} idx={idx} />
              ))
            ) : searched ? (
              <div className="flex justify-center py-5">No records found..</div>
            ) : supporters.length !== 0 ? (
              supporters.map((user, idx) => <TableRow sup={user} idx={idx} />)
            ) : (
              <div className="flex justify-center py-5">No records found..</div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
