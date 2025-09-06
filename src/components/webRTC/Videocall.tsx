// client/src/components/VideoCall.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";


export const VideoCall: React.FC = () => {
  const { roomId, userId } = useParams();

  const {socket} = useSocket();
  const { user } = useAuth();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const navigate = useNavigate();

  const [joined, setJoined] = useState(false);

  useEffect(() => {
    pcRef.current = new RTCPeerConnection();

    // Handle remote stream
    pcRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    //  Connect user
    if (!joined) {
      joinRoom();
    }

    // Send ICE candidates to peer
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };

                                  // *****Socket listeners*****
    socket?.on("offer", async ({ offer }) => {
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socket?.emit("answer", { roomId, answer });
      }
    });

    //  Offer Answer
    socket?.on("answer", async ({ answer }) => {
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    //  receiver ICE
    socket?.on("ice-candidate", async ({ candidate }) => {
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    //  Accepted call
    socket?.on("call-accepted", () => {
      toast.success("user joined");
    });

    //  Call ended
    socket?.on("call-ended", () => {
      toast.success("call ended");
      navigate(`/chat/${userId}`);
    });

//  Call rejected
    socket?.on("call-rejected", () => {
      console.log("uff");
      toast.error("Your call was rejected.");
      navigate(`/chat/${userId}`);
    });


    return () => {
      socket?.off("offer");
      socket?.off("call-rejected");
      socket?.off("call-accepted");
      socket?.off("answer");
      socket?.off("ice-candidate");
    };
  }, [roomId]);

  const joinRoom = async () => {
    setJoined(true);
    socket?.emit("join-room", { roomId });

    try {
      // Get media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to connection
      stream.getTracks().forEach((track) => {
        if (pcRef.current) {
          pcRef.current.addTrack(track, stream);
        }
      });

      // Create offer
      if (pcRef.current) {
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        socket?.emit("offer", { roomId, offer });
      }

      socket?.emit("start-call", {
        from: user?.userId,
        to: userId,
        roomId: roomId,
      });
    } catch (error) {
      console.log("video call error : " + error);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-slate-900 text-white">
      {/* Video Area */}
      <div className="flex flex-1 items-center justify-center gap-4 p-4">
        {/* Local Video (small in corner) */}
        <div className="relative w-1/3 h-2/3 bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-700">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded-md">
            You
          </span>
        </div>

        {/* Remote Video (big) */}
        <div className="relative flex-1 h-5/6 bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-700 flex items-center justify-center">
          {remoteVideoRef.current !== null ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">Waiting for participant...</span>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-20 bg-slate-800 flex items-center justify-center gap-6 border-t border-slate-700">
        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 shadow-lg" onClick={(e)=>{
          e.preventDefault();
          socket?.emit("end-call",{roomId});
          navigate(`/chat/${userId}`);
        }}>
          📞
        </button>
        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-600 hover:bg-slate-700 shadow-lg">
          🎤
        </button>
        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-600 hover:bg-slate-700 shadow-lg">
          🎥
        </button>
      </div>
    </div>
  );
};
