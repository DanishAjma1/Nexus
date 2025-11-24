import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDotsButton } from "../../components/ui/ThreeDotsButton";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { SearchIcon } from "lucide-react";
import { User } from "../../types";
import { formatDistanceToNow } from "date-fns";

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchedusers, setSearchedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [query, setQuery] = useState<string>("");
  const [searched, setSearched] = useState<string>("");

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/user/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error("Error deleting user");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/admin/get-users`
        );
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
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
          <td className="px-4 py-2 flex items-center">
            <span>{idx + 1}.</span>
            <p className="ml-5">{user.name}</p>
          </td>
          <td className="px-4 py-2">{user.email}</td>
          <td className="px-4 py-2">{user.role}</td>
          <td className="px-4 py-2">{user.location}</td>
          <td className={`px-4 py-2 `}>
            <span
              className={`px-2 text-gray-200 py-1 rounded-full ${
                user.isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {user.isOnline ? "Online" : "Offline"}
            </span>
          </td>

          {/* This td holds industry + 3-dots at far right */}
          <td className="flex items-center relative">
            {/* Industry text */}
            <span className="px-4 py-2">
              {formatDistanceToNow(user.createdAt)}
            </span>

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
                        idx >= users.length - 2
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

  if (loading) return <p className="p-4 text-gray-600">Loading users...</p>;
  if (users.length === 0)
    return <p className="p-4 text-gray-600">No users found.</p>;

  return (
    <div className="p-4">
      {/* ✔️ Users Table */}
      <h1 className="text-xl font-bold mb-10 underline underline-offset-8">
        Manange Users
      </h1>

      <div className="w-full">
        <form
          className=" flex items-start gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(query);
            const filterUsers = users.filter((ent) =>
              ent.name.toLowerCase().includes(query.toLowerCase())
            );

            if (filterUsers.length !== 0) setSearchedUsers([...filterUsers]);
            else setSearchedUsers([]);
          }}
        >
          <Input
            type="text"
            placeholder="Search users with name email or company.."
            className="w-1/2"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") {
                setSearchedUsers([]);
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
          {searched ? `Results '${searched}' searched count: ` : "Total Users:"}{" "}
        </span>
        {searched ? searchedusers.length : users.length}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border overflow-scroll max-h-80 scroll-smooth">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Is Online</th>
              <th className="px-4 py-3">When Registered</th>
            </tr>
          </thead>
          <tbody>
            {searchedusers.length !== 0 ? (
              searchedusers.map((user, idx) => (
                <TableRow user={user} idx={idx} />
              ))
            ) : searched ? (
              <div className="flex justify-center py-5">No records found..</div>
            ) : users.length !== 0 ? (
              users.map((user, idx) => <TableRow user={user} idx={idx} />)
            ) : (
              <div className="flex justify-center py-5">No records found..</div>
            )}
          </tbody>
        </table>
      </div>

      {/* ✔️ Pending Users Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pending User Approvals
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
