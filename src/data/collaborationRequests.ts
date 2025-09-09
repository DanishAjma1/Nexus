import axios from "axios";
import { CollaborationRequest } from "../types";
import toast from "react-hot-toast";

export const collaborationRequests: CollaborationRequest[] = [
  {
    id: "req1",
    investorId: "i1",
    entrepreneurId: "e1",
    message:
      "Id like to explore potential investment in TechWave AI. Your AI-driven financial analytics platform aligns well with my investment thesis.",
    status: "pending",
    createdAt: "2023-08-10T15:30:00Z",
  },
  {
    id: "req2",
    investorId: "i2",
    entrepreneurId: "e1",
    message:
      "Interested in discussing how TechWave AI can incorporate sustainable practices. Lets connect to explore potential collaboration.",
    status: "accepted",
    createdAt: "2023-08-05T11:45:00Z",
  },
  {
    id: "req3",
    investorId: "i3",
    entrepreneurId: "e3",
    message:
      "Your HealthPulse platform addresses a critical need in mental healthcare. Id like to learn more about your traction and roadmap.",
    status: "pending",
    createdAt: "2023-08-12T09:20:00Z",
  },
  {
    id: "req4",
    investorId: "i2",
    entrepreneurId: "e2",
    message:
      "GreenLifes biodegradable packaging solutions align with my focus on sustainable investments. Lets discuss scaling possibilities.",
    status: "accepted",
    createdAt: "2023-07-28T14:15:00Z",
  },
  {
    id: "req5",
    investorId: "i1",
    entrepreneurId: "e4",
    message:
      "Your UrbanFarm concept is fascinating. Im interested in learning more about your IoT implementation and market validation.",
    status: "rejected",
    createdAt: "2023-08-03T16:50:00Z",
  },
];

const URL = "http://localhost:5000";
// Helper function to get collaboration requests for an entrepreneur
export const getRequestsForEntrepreneur = async (
  enter_id: string
): CollaborationRequest[] => {
  const res = await axios.get(
    URL + "/requests/get-request-for-enterpreneur/" + enter_id,
    {
      withCredentials: true,
    }
  );
  const { requests } = res.data;
  return requests;
};

// Helper function to get collaboration requests sent by an investor
export const getRequestsFromInvestor = async (
  inves_id: string
): CollaborationRequest[] => {
  const res = await axios.post(
    URL + "/requests/get-request-for-investor",
    { inves_id },
    {
      withCredentials: true,
    }
  );
  const { requests } = res.data;
  return requests;
};
export const checkRequestsFromInvestor = async (
  inves_id: string,
  enter_id: string
): Promise<boolean> => {
  try {
    const body = { inves_id, enter_id };
    const res = await axios.post(
      URL + "/requests/check-request-for-investor",
      body,
      { withCredentials: true }
    );

    const { request } = res.data;
    return !!request; // true if found, false otherwise
  } catch (error) {
    console.error("checkRequestsFromInvestor error:", error);
    return false;
  }
};

// Helper function to update a collaboration request status
export const updateRequestStatus = async (
  requestId: string,
  newStatus: "pending" | "accepted" | "rejected"
): CollaborationRequest => {
  const res = await axios.put(
    URL + "/requests/update-status",
    { requestId, newStatus },
    { withCredentials: true }
  );
  const {request} = res.data;
  toast.success("request status updated");
  return request;
};

// Helper function to create a new collaboration request
export const createCollaborationRequest = async (
  inves_id: string,
  enter_id: string,
  message: string
): CollaborationRequest => {
  const newRequest = {
    inves_id,
    enter_id,
    message,
    requestStatus: "pending",
  };
  try {
    const res = await axios.post(URL + "/requests/save-request", newRequest, {
      withCredentials: true,
    });
    toast.success("Request sent..");
    return res.data.request as CollaborationRequest;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
