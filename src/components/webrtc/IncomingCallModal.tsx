// IncomingCallModal.tsx
import React from "react";

type Props = {
  callType:string;
  fromName:string;
  onAccept: () => void;
  onReject: () => void;
};

const IncomingCallModal: React.FC<Props> = ({ callType,fromName, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center w-96 z-10">
        <h2 className="text-xl font-bold mb-4">📞 Incoming Call</h2>
        <p className="mb-6"><strong>{fromName}</strong> request you for {callType} call</p>
        <div className="flex justify-around">
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
