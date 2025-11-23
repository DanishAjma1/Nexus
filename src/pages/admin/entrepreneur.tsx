import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDotsButton } from "../../components/ui/ThreeDotsButton";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { SearchIcon } from "lucide-react";

interface Entrepreneur {
  _id: string;
  name: string;
  email: string;
  role: string;
  startupName?: string;
  foundedYear?: string;
  location?: string;
  industry?: string;
}

export const Entrepreneurj: React.FC = () => {
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [searchedentrepreneurs, setSearchedEntrepreneurs] = useState<
    Entrepreneur[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [query, setQuery] = useState<string>("");
  const [searched, setSearched] = useState<string>("");

  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users/entrepreneurs`
      );
      const data = await res.json();
      const filtered = data.filter(
        (u: Entrepreneur) => u.role === "entrepreneur"
      );
      setEntrepreneurs(filtered);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load entrepreneurs");
    } finally {
      setLoading(false);
    }
  };

  const deleteEntrepreneur = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entrepreneur?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/user/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Entrepreneur deleted successfully");
      setEntrepreneurs((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error("Error deleting entrepreneur");
    }
  };

  useEffect(() => {
    fetchEntrepreneurs();
  }, []);

  const dialogRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowDialog(false);
        setIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ActionButtons = () => {
    return (
      <div className="flex flex-row gap-x-1">
        <Button variant="success">Accept</Button>
        <Button variant="warning">Decline</Button>
      </div>
    );
  };

  const TableRow = ({ user, idx }) => {
    return (
      <>
        <tr key={idx} className="border-t hover:bg-gray-50 relative group">
          <td className="px-4 py-2">{user.name}</td>
          <td className="px-4 py-2">{user.email}</td>
          <td className="px-4 py-2">{user.startupName}</td>
          <td className="px-4 py-2">{user.foundedYear}</td>
          <td className="px-4 py-2">{user.location}</td>

          {/* This td holds industry + 3-dots at far right */}
          <td className="flex items-center relative">
            {/* Industry text */}
            <span className="px-4 py-2">{user.industry || "Gujrat fans"}</span>

            {/* 3-dots — hidden normally, visible on row hover */}
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
                        idx >= entrepreneurs.length - 2
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

  if (loading)
    return <p className="p-4 text-gray-600">Loading entrepreneurs...</p>;
  if (entrepreneurs.length === 0)
    return <p className="p-4 text-gray-600">No entrepreneurs found.</p>;

  return (
    <div className="p-4">
      {/* ✔️ Entrepreneurs Table */}
      <h1 className="text-xl font-bold mb-10 underline underline-offset-8">
        Manange Entrepreneurs
      </h1>

      <div className="w-full">
        <form
          className=" flex items-start gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(query);
            const filterEntrepreneurs = entrepreneurs.filter((ent) =>
              ent.name.toLowerCase().includes(query.toLowerCase())
            );

            if (filterEntrepreneurs.length !== 0)
              setSearchedEntrepreneurs([...filterEntrepreneurs]);
            else setSearchedEntrepreneurs([]);
          }}
        >
          <Input
            type="text"
            placeholder="Search entrepreneurs with name email or company.."
            className="w-1/2"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") {
                setSearchedEntrepreneurs([]);
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
            : "Total Entrepreneurs:"}{" "}
        </span>
        {searched ? searchedentrepreneurs.length : entrepreneurs.length}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Startup Name</th>
              <th className="px-4 py-3">Founded Year</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Industry</th>
            </tr>
          </thead>
          <tbody>
            {searchedentrepreneurs.length !== 0 ? (
              searchedentrepreneurs.map((user, idx) => (
                <TableRow user={user} idx={idx} />
              ))
            ) : searched ? (
              <div className="flex justify-center py-5">No records found..</div>
            ) : entrepreneurs.length !== 0 ? (
              entrepreneurs.map((user, idx) => (
                <TableRow user={user} idx={idx} />
              ))
            ) : (
              <div className="flex justify-center py-5">No records found..</div>
            )}
          </tbody>
        </table>
      </div>

      {/* ✔️ Pending Entrepreneurs Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pending Entrepreneur Approvals
        </h2>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                  Business Name
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">John Carter</td>
                <td className="px-6 py-4 text-sm text-gray-700">Carter Tech</td>
                <td className="px-6 py-4">
                  <ActionButtons />
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Sarah Khan</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  SK Enterprises
                </td>
                <td className="px-6 py-4">
                  <ActionButtons />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
