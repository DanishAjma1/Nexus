// IncomingCallModal.tsx
import React from "react";

type Props = {
  from: string;
  roomId: string;
  onAccept: () => void;
  onReject: () => void;
};

const IncomingCallModal: React.FC<Props> = ({ from, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center w-96">
        <h2 className="text-xl font-bold mb-4">📞 Incoming Call</h2>
        <p className="mb-6">User <strong>{from}</strong> is calling you</p>
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
