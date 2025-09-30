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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {incomingCall && (
        <IncomingCallModal
          callType={incomingCall.callType}
          fromName={incomingCall.fromName}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      <Navbar />

      <div className="flex-0 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
