import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useSocket } from "../../context/SocketContext";
import IncomingCallModal from "../webrtc/IncomingCallModal";

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [incomingCall, setIncomingCall] = useState<{
    from: string;
    roomId: string;
    callType: string;
    fromName: string;
  } | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const acceptCall = () => {
    if (incomingCall) {
      socket?.emit("accept-call", { to: incomingCall.from });
      navigate(
        `/chat/${incomingCall.from}/${incomingCall.callType}-call/${
          incomingCall.roomId
        }/${true}`
      );
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      socket?.emit("reject-call", { to: incomingCall.from });
      setIncomingCall(null);
    }
  };

  useEffect(() => {
    const handleIncoming = ({
      from,
      roomId,
      callType,
      fromName,
    }: {
      from: string;
      roomId: string;
      callType: string;
      fromName: string;
    }) => {
      setIncomingCall({ from, roomId, callType, fromName });
    };

    socket?.on("incoming-call", handleIncoming);
    return () => {
      socket?.off("incoming-call", handleIncoming);
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-black text-purple-200 flex flex-col">
      {incomingCall && (
        <IncomingCallModal
          callType={incomingCall.callType}
          fromName={incomingCall.fromName}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {/* Navbar with mobile menu toggle */}
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for large screens */}
        <Sidebar
          className={`hidden md:flex md:flex-shrink-0`}
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
            <Sidebar
              className="relative flex w-64 bg-black"
              sidebarOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-black">
          <div className="max-w-7xl mx-auto">{/* Outlet content */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
