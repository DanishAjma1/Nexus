import React, { useEffect, useRef, useState } from "react";
import { Input } from "../../components/ui/Input";
import { SearchIcon } from "lucide-react";
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
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [searchedSupporters, setSearchedSupporters] = useState<Supporter[]>([]);
  const [query, setQuery] = useState<string>("");
  const [searched, setSearched] = useState<string>("");

  useEffect(() => {
    // Dummy data
    const dummySupporters: Supporter[] = [
      { _id: "1", name: "Ali Raza", email: "ali@example.com", campaign: "Eco-Friendly Water Bottles", amount: 5000 },
      { _id: "2", name: "Jessica Smith", email: "jessica@example.com", campaign: "AI Study Planner App", amount: 12000 },
      { _id: "3", name: "Hassan Khan", email: "hassan@example.com", campaign: "Organic Farming Project", amount: 3000 },
    ];
    setSupporters(dummySupporters);
  }, []);

  const [showDialog, setShowDialog] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setShowDialog(false);
        setIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const TableRow = ({ sup, idx }: { sup: Supporter; idx: number }) => (
    <tr className="border-t hover:bg-purple-800/50 relative group text-white">
      <td className="px-4 py-2">{sup.name}</td>
      <td className="px-4 py-2">{sup.email}</td>
      <td className="px-4 py-2">{sup.campaign}</td>
      <td className="flex items-center relative">
        <span className="px-4 py-2 font-semibold text-green-400">${sup.amount.toLocaleString()}</span>

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

        {/* Dropdown menu */}
        {showDialog && index === idx && (
          <div
            ref={dialogRef}
            className="absolute right-0 top-full mt-2 w-28 bg-purple-900 border border-purple-700 shadow-md rounded-md z-50 flex flex-col"
          >
            <Button
              variant="ghost"
              className="border-b text-xs text-white hover:text-blue-400"
              onClick={() => {
                alert(`Mail to ${sup.name}`);
                setShowDialog(false);
              }}
            >
              Mail to
            </Button>
            <Button
              variant="ghost"
              className="border-b text-xs text-white hover:text-red-500"
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

  return (
    <div className="p-5 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 underline underline-offset-8 text-purple-300">Crowdfund Supporters</h1>

      {/* Search bar */}
      <div className="w-full mb-4">
        <form
          className="flex items-start gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(query);
            const filtered = supporters.filter((ent) =>
              ent.name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchedSupporters(filtered);
          }}
        >
          <Input
            type="text"
            placeholder="Search supporters by name, email or campaign..."
            className="w-1/2 bg-purple-900 border border-purple-700 text-white placeholder-gray-400"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") {
                setSearchedSupporters([]);
                setSearched("");
              }
            }}
          />
          <div className="flex justify-start items-center">
            <button
              type="submit"
              className="hover:cursor-pointer text-white border-2 border-l-0 bg-purple-800 hover:bg-purple-700 focus:bg-purple-900 px-5 py-1.5 rounded-md"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-end text-xs p-2 gap-2 text-purple-300">
        <span>
          {searched ? `Results for '${searched}' count: ` : "Total Supporters:"}
        </span>
        {searched ? searchedSupporters.length : supporters.length}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-purple-900/80 rounded-lg shadow border border-purple-700">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-purple-800 uppercase text-xs font-semibold text-white">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Amount Invested</th>
            </tr>
          </thead>
          <tbody>
            {searchedSupporters.length > 0
              ? searchedSupporters.map((user, idx) => <TableRow sup={user} idx={idx} key={user._id} />)
              : searched
              ? <tr><td colSpan={4} className="text-center py-5">No records found.</td></tr>
              : supporters.length > 0
              ? supporters.map((user, idx) => <TableRow sup={user} idx={idx} key={user._id} />)
              : <tr><td colSpan={4} className="text-center py-5">No records found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
