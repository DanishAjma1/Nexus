import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { ThreeDotsButton } from "../../components/ui/ThreeDotsButton";
import { Input } from "../../components/ui/Input";
import { SearchIcon } from "lucide-react";

interface Investor {
  _id: string;
  name: string;
  email: string;
  role: string;
  totalInvestments?: number;
  successfullExits?: number;
}

export const Investors: React.FC = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [searchedInvestors, setSearchedInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [query, setQuery] = useState<string>("");
  const [searched, setSearched] = useState<string>("");

  // Dummy pending entrepreneurs (NO API TOUCH)
  const pendingEntrepreneurs = [
    { _id: "1", name: "John Doe", business: "TechWave Solutions" },
    { _id: "2", name: "Sarah Khan", business: "Green Foods Pvt Ltd" },
  ];

  // Fetch investors
  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users`
      );
      const data = await res.json();

      const filtered = data.filter((u: User) => u.role === "investor");
      setInvestors(filtered);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load investors");
    } finally {
      setLoading(false);
    }
  };

  const deleteInvestor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this investor?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/user/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Investor deleted successfully");
      setInvestors((prev) => prev.filter((i) => i._id !== id));
    } catch (error) {
      toast.error("Error deleting investor");
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  const dialogRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // Close only if click is outside dialog AND outside button
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowDialog(false);
        setIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const TableRow = ({ inv, idx }) => {
    return (
      <>
        <tr key={idx} className="border-t hover:bg-gray-50 relative group">
          <td className="px-4 py-2">{inv.name}</td>
          <td className="px-4 py-2">{inv.email}</td>
          <td className="px-4 py-2">{inv.totalInvestments ?? 0}</td>

          <td className="flex items-center">
            <span className="px-4 py-2 text-center">
              {inv.successfullExits ?? 0}
            </span>
            <ThreeDotsButton
              variant="ghost"
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setIndex(idx);
                setShowDialog((prev) => !prev);
              }}
            />

            {showDialog && idx === index && (
              <div
                ref={dialogRef}
                className={`absolute right-0 w-28 bg-white shadow-md rounded-md border flex flex-col z-50
                      ${
                        idx >= investors.length - 2
                          ? "bottom-full mb-2"
                          : "top-full mt-2"
                      }
                      `}
              >
                <Button
                  variant="ghost"
                  className="border-b hover:text-yellow-500 focus:text-white focus:bg-yellow-500"
                >
                  Suspend
                </Button>
                <Button
                  variant="ghost"
                  className="border-b hover:text-red-500 focus:text-white focus:bg-red-500"
                >
                  Block
                </Button>
              </div>
            )}
          </td>
        </tr>
      </>
    );
  };

  const ActionButtons = () => {
    return (
      <div className="flex flex-row gap-x-1">
        <Button variant="success">Accept</Button>
        <Button variant="warning">Decline</Button>
      </div>
    );
  };

  if (loading) return <p className="p-4 text-gray-600">Loading investors...</p>;

  if (investors.length === 0)
    return <p className="p-4 text-gray-600">No investors found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold underline underline-offset-8 mb-10">
        Manage Investor
      </h1>

      <div className="w-full">
        <form
          className=" flex items-start gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(query);
            const filterInvestors = investors.filter((ent) =>
              ent.name.toLowerCase().includes(query.toLowerCase())
            );

            if (filterInvestors.length !== 0)
              setSearchedInvestors([...filterInvestors]);
            else setSearchedInvestors([]);
          }}
        >
          <Input
            type="text"
            placeholder="Search investors with name email or total investments.."
            className="w-1/2"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") {
                setSearchedInvestors([]);
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
            : "Total Investors:"}{" "}
        </span>
        {searched ? searchedInvestors.length : investors.length}
      </div>

      {/* EXISTING TABLE (UNCHANGED) */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border mb-10">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Total Investments</th>
              <th className="px-4 py-3">Successful Exits</th>
            </tr>
          </thead>
          <tbody>
            {searchedInvestors.length !== 0 ? (
              searchedInvestors.map((user, idx) => (
                <TableRow inv={user} idx={idx} />
              ))
            ) : searched ? (
              <div className="flex justify-center py-5">No records found..</div>
            ) : investors.length !== 0 ? (
              investors.map((user, idx) => <TableRow inv={user} idx={idx} />)
            ) : (
              <div className="flex justify-center py-5">No records found..</div>
            )}
          </tbody>
        </table>
      </div>

      {/* NEW DUMMY TABLE */}
      <h2 className="text-lg font-semibold mb-3">Pending Investors</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Business Name</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingEntrepreneurs.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.business}</td>
                <td className="px-4 py-2 text-center">
                  <ActionButtons />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
