import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";

export const VideoCall: React.FC = () => {
  const { roomId, userId } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const navigate = useNavigate();

  const [joined, setJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    pcRef.current = new RTCPeerConnection();

    // Handle remote stream
    pcRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // ICE candidates → send to other peer
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };

    const stopStream = () => {
      const stream = localVideoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop(); // stops both mic and camera
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
      }

      // Close peer connection
      pcRef.current?.close();
      pcRef.current = null;
      socket?.emit("end-call", { to: userId, roomId });
    };

    // ===== SOCKET LISTENERS =====
    socket?.on("offer", async ({ offer }) => {
      try {
        await pcRef.current?.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        // Create answer
        const answer = await pcRef.current?.createAnswer();
        await pcRef.current?.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    });

    socket?.on("answer", async ({ answer }) => {
      try {
        if (pcRef.current && !pcRef.current.remoteDescription) {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        }
      } catch (err) {
        console.error("Error setting remote description:", err);
      }
    });

    socket?.on("ice-candidate", async ({ candidate }) => {
      try {
        if (pcRef.current?.remoteDescription) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    socket?.on("call-accepted", () => {
      toast.success("Call accepted");
    });

    socket?.on("call-ended", () => {
      toast.success("Call ended");
      navigate(`/chat/${userId}`);
    });

    socket?.on("call-rejected", () => {
      toast.error("Your call is declined.");
      navigate(`/chat/${userId}`);
    });

    socket?.on("receiver-offline", () => {
      toast.error("The receiver is offline.");
      navigate(`/chat/${userId}`);
    });

    if (!joined) joinRoom();

    return () => {
      socket?.off("offer");
      socket?.off("answer");
      socket?.off("ice-candidate");
      socket?.off("call-accepted");
      socket?.off("call-rejected");
      socket?.off("call-ended");
    };
  }, [roomId]);

  const joinRoom = async () => {
    setJoined(true);
    socket?.emit("join-room", { roomId });

    try {
      // Get media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks
      if (pcRef.current?.getSenders().length === 0) {
        stream
          .getTracks()
          .forEach((track) => pcRef.current?.addTrack(track, stream));
      }

      // Caller creates offer
      if (user?.userId !== userId) {
        // Only caller
        const offer = await pcRef.current?.createOffer();
        await pcRef.current?.setLocalDescription(offer);
        socket?.emit("offer", { roomId, offer });
        socket?.emit("start-call", { from: user?.userId, to: userId, roomId });
      }
    } catch (error) {
      console.log("Video call error:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-slate-900 text-white">
      {/* Video Area */}
      <div className="flex flex-1 items-center justify-center gap-4 p-4">
        {/* Local Video */}
        <div
          className={`relative w-1/3 h-2/3 bg-black rounded-2xl overflow-hidden shadow-lg border-2  ${
            isMuted ? "border-red-700" : "border-gray-700"
          }`}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            // muted
            className={`w-full h-full object-cover`}
          />
          <span className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded-md">
            You
          </span>
        </div>

        {/* Remote Video */}
        <div className="relative flex-1 h-5/6 bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-700 flex items-center justify-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            // muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-20 bg-slate-800 flex items-center justify-center gap-6 border-t border-slate-700">
        <button
          className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
          onClick={async (e) => {
            e.preventDefault();

            const stream = localVideoRef.current?.srcObject as MediaStream;
            if (stream) {
              // Stop all tracks (camera + mic)
              stream.getTracks().forEach((track) => {
                track.stop();
              });

              // Clear local video element
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
              }
            }

            // Close peer connection
            if (pcRef.current) {
              pcRef.current
                .getSenders()
                .forEach((sender) => sender.track?.stop());
              pcRef.current.close();
              pcRef.current = null;
            }

            // Also clear remote video element (so frozen video doesn’t stay visible)
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }

            // Tell server call ended
            socket?.emit("end-call", { to: userId, roomId });
            navigate(`/chat/${userId}`);
          }}
        >
          📞
        </button>
      </div>
    </div>
  );
};
