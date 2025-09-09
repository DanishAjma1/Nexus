import axios from "axios";
import { CollaborationRequest } from "../types";
import toast from "react-hot-toast";

const URL = process.env.BACKEND_URL;
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
