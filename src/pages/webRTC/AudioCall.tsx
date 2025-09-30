import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";
import AgoraRTC, { ILocalTrack } from "agora-rtc-sdk-ng";
import axios from "axios";

export const AudioCall: React.FC = () => {
  const { roomId, userId, isIncommingCall } = useParams();
  const [isMute, setIsMute] = useState<boolean>(false);
  const { socket } = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();
  const APP_ID = "5e3db4d74aaa43ff8eeee3ad9f08efd8";
  const CHANNEL = String(roomId);
  const [joined, setJoined] = useState(false);
  const localAudioRef = useRef<HTMLDivElement | null>(null);
  const remoteAudioRef = useRef<HTMLDivElement | null>(null);
  const localTracksRef = useRef<ILocalTrack[]>([]);
  const clientRef = useRef<AgoraRTC.Client | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchToken = async () => {
      const uid = String(Date.now()); // simple unique uid
      setUid(uid);

      try {
        const res = await axios.get(`${URL}/agora/rtc/${CHANNEL}/${uid}`, {
          withCredentials: true,
        });
        setToken(res.data.token);
      } catch (err) {
        console.error("Failed to fetch token:", err);
      }
    };

    fetchToken();
  }, [CHANNEL, URL]);

  useEffect(() => {
    if (!token || !uid) return;

    AgoraRTC.setLogLevel(0);

    const init = async () => {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      // 🔹 Set up listeners BEFORE joining/publishing
      client.on("user-published", async (user, mediaType) => {
        if (user.uid === uid) return; // skip own stream
        await client.subscribe(user, mediaType);
        console.log("Subscribed to:", user.uid);

        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio" && remoteAudioRef.current) {
          remoteAudioRef.current.innerHTML = "";
        }
      });

      try {
        await client.join(APP_ID, CHANNEL, token, uid);

        // create local tracks
        localTracksRef.current = [await AgoraRTC.createMicrophoneAudioTrack()];

        // publish AFTER listeners are ready
        await client.publish(localTracksRef.current);

        localTracksRef.current[0].play(localAudioRef.current!);
        setJoined(true);
      } catch (err) {
        console.error("Agora join error:", err);
      }

      // Outgoing call
      const isIncoming = isIncommingCall === "true";
      if (!isIncoming) {
        socket?.emit("start-call", {
          from: user?.userId,
          to: userId,
          roomId: CHANNEL,
          callType: "audio",
          fromName: user?.name,
        });
      }
    };

    init();

    return () => {
      cleanup();
    };
  }, [CHANNEL, isIncommingCall, user, userId, token, uid, socket]);

  // === Cleanup ===
  const cleanup = async () => {
    localTracksRef.current.forEach((track) => {
      track.stop();
      track.close();
    });
    if (clientRef.current) {
      clientRef.current.removeAllListeners(); // ✅ avoid duplicate handlers
      await clientRef.current.leave();
    }
    setJoined(false);
  };

  // Mute mic
  const muteMic = async () => {
    if (localTracksRef.current[0]) {
      await localTracksRef.current[0].setEnabled(false);
      setIsMute(true);
      console.log("Microphone muted");
    }
  };

  // Unmute mic
  const unmuteMic = async () => {
    if (localTracksRef.current[0]) {
      await localTracksRef.current[0].setEnabled(true);

      setIsMute(false);
      console.log("Microphone unmuted");
    }
  };

  useEffect(() => {
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

    socket?.on("receiver-offline", async () => {
      toast.error("The receiver is offline.");
      await cleanup();
      navigate(`/chat/${userId}`);
    });

    return () => {
      socket?.off("call-accepted");
      socket?.off("receiver-offline");
      socket?.off("call-rejected");
      socket?.off("call-ended");
    };
  }, [socket, userId]);
  return (
    <div className="flex h-lvh flex-col items-center bg-white p-3 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold my-4">Agora 1-to-1 Audio Call</h2>
      <div className="flex h-full w-full justify-center relative">
        <div className="w-full flex justify-center">
          <div className=" relative w-5/6 h-5/6 bg-white">
            <div
              ref={remoteAudioRef}
              className="w-full h-full absolute bg-black overflow-hidden rounded-md flex justify-center items-center"
            >
              <h1 className="text-5xl text-white bg-red-500 px-8 py-6 rounded-full">
                P
              </h1>
            </div>
            {/* Local audio as overlay (picture-in-picture) */}
            <div
              ref={localAudioRef}
              className="w-[250px] h-[150px] bg-white rounded-md flex justify-center items-center absolute bottom-4 right-4 shadow-lg z-20"
            >
              <h1 className="text-2xl text-white bg-red-500 px-5 py-3 rounded-full">
                U
              </h1>
            </div>
          </div>
        </div>

        <div className="bottom-0 absolute justify-center flex flex-col items-center w-2/6">
          {joined ? (
            <p className="my-2 text-green-600 ">📡 Call in Progress...</p>
          ) : (
            <p className="my-2 text-red-600">Not connected</p>
          )}
          <div className="flex gap-6">
            {/* End Call */}
            <button
              onClick={(e) => {
                e.preventDefault();
                cleanup();
                navigate(`/chat/${userId}`);
                socket?.emit("end-call", { to: userId, roomId: CHANNEL });
              }}
              className="rounded-full p-3 bg-red-600 text-white"
            >
              📞
            </button>

            {/* Mic Control */}
            {isMute ? (
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  await unmuteMic();
                }}
                className="rounded-full p-3 bg-green-600 text-white"
              >
                🎤
              </button>
            ) : (
              <button
                onClick={muteMic}
                className="rounded-full p-3 bg-yellow-500 text-white"
              >
                🔇
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
