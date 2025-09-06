import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export const AudioCall = () => {
  const {roomId} = useParams();
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const pcRef = useRef(null);

  const [joined, setJoined] = useState(false);

  useEffect(() => {
    pcRef.current = new RTCPeerConnection();

    //  Handle remote stream
    pcRef.current.ontrack = (event) => {
      remoteAudioRef.current.srcObject = event.streams[0];
    };

    //  connect the user
    if(!joined){
      joinRoom();
    }

    //  Send ICE candidate to peer
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, roomId });
      }
    };

    //  Socket listeners
    socket.on("offer", async ({ offer }) => {
      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async ({ answer }) => {
      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });
    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId]);

  const joinRoom = async() => {
    setJoined(true);

    socket.emit("join-room", roomId);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localAudioRef.current.srcObject = stream;

    stream.getTracks().forEach((track) => {
      pcRef.current.addTrack(track, stream);
    });

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("offer", { roomId, offer });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
};
