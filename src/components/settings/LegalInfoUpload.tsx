import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Upload, CheckCircle2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

interface UserDocument {
  _id: string;
  type: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
}

const LEGAL_ITEMS = [
  {
    type: "Government ID (CNIC/Passport)",
    label: "Government ID (CNIC/Passport)",
    description: "Upload your CNIC or passport (PDF, JPG, PNG).",
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    type: "Selfie Photo",
    label: "Selfie with ID",
    description: "Upload a clear selfie holding your ID (JPG, PNG).",
    accept: ".jpg,.jpeg,.png",
  },
];

export const LegalInfoUpload: React.FC = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const { user: authUser } = useAuth();
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<"unsubmitted" | "pending" | "verified" | "rejected">("unsubmitted");
  const [deleting, setDeleting] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameraBusyType, setCameraBusyType] = useState<string | null>(null);

  const deleteDocument = async (id: string) => {
    if (!token) return;
    await axios.delete(`${URL}/document/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const fetchKycData = async () => {
    if (!token || !authUser?.userId) return;
    try {
      setLoading(true);
      const [docRes, userRes] = await Promise.all([
        axios.get(`${URL}/document`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${URL}/user/get-user-by-id/${authUser.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const docs = docRes.data.documents || [];
      setDocuments(docs);

      const status = userRes.data?.user?.kycStatus?.status || "unsubmitted";
      setKycStatus(status);

      // If rejected, remove previous uploads so the user can re-upload fresh
      if (status === "rejected" && docs.length > 0) {
        setDeleting(true);
        try {
          await Promise.all(docs.map((d: UserDocument) => deleteDocument(d._id)));
          setDocuments([]);
        } catch (err) {
          console.error("Failed to clear rejected docs", err);
          toast.error("Could not clear rejected documents. Please try again.");
        } finally {
          setDeleting(false);
        }
      }
    } catch (error) {
      console.error("Failed to load legal info", error);
      toast.error("Could not load legal info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (file: File | Blob | null, type: string) => {
    if (!file) return;
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    if (kycStatus === "verified") {
      toast.error("KYC already verified. No further uploads needed.");
      return;
    }

    const fileForUpload = file instanceof File ? file : new File([file], "selfie.png", { type: "image/png" });

    const isImage = fileForUpload.type.startsWith("image/");
    const isPdf = fileForUpload.type === "application/pdf";
    if (!isImage && !isPdf) {
      toast.error("Only PDF, JPG, or PNG files are allowed");
      return;
    }

    setUploadingType(type);
    const formData = new FormData();
    formData.append("file", fileForUpload);
    formData.append("type", type);

    try {
      await axios.post(`${URL}/document/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(`${type} uploaded`);
      fetchKycData();
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || "Upload failed";
      toast.error(msg);
    } finally {
      setUploadingType(null);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
    setCameraBusyType(null);
  };

  const startCamera = async (type: string) => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      streamRef.current = stream;
      setCameraActive(true);
      setCameraBusyType(type);
    } catch (err) {
      console.error(err);
      setCameraError("Camera access denied or unavailable");
      stopCamera();
    }
  };

  const capturePhoto = async (type: string) => {
    if (!cameraActive || cameraBusyType !== type || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      handleUpload(blob, type);
    }, "image/png");
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayStatus =
    kycStatus === "unsubmitted" && documents.length === 0 ? "pending" : kycStatus;

  const isVerified = kycStatus === "verified";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Legal Verification</h2>
              <p className="text-sm text-gray-600">
                Upload your government ID and selfie to verify your account. Files are stored securely with your profile.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${{
                  verified: "bg-green-50 text-green-700 border-green-200",
                  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
                  rejected: "bg-red-50 text-red-700 border-red-200",
                  unsubmitted: "bg-gray-50 text-gray-600 border-gray-200",
                }[displayStatus] || "bg-gray-50 text-gray-600 border-gray-200"}`}
              >
                {`Status: ${displayStatus}`}
              </span>
              {loading && <span className="text-xs text-gray-500">Loading...</span>}
            </div>
          </div>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEGAL_ITEMS.map((item) => {
            const existing = documents.find((doc) => doc.type === item.type);
            const inputId = `legal-upload-${item.type.replace(/\s+/g, "-")}`;
            return (
              <div
                key={item.type}
                className="border rounded-lg p-4 flex flex-col gap-3 bg-gray-50/60 hover:border-primary-200 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary-50 text-primary-700">
                    <Upload size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>

                {existing ? (
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                    <CheckCircle2 size={16} />
                    <div>
                      <div className="font-medium">{existing.fileName}</div>
                      <div className="text-xs text-green-800">Uploaded {new Date(existing.uploadedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                    <AlertTriangle size={16} />
                    <span>No file uploaded yet</span>
                  </div>
                )}

                {!isVerified && (
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor={inputId}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border shadow-sm cursor-pointer transition-colors ${
                        uploadingType === item.type || deleting
                          ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                          : "bg-white text-primary-700 border-primary-200 hover:bg-primary-50"
                      }`}
                    >
                      <Upload size={16} />
                      {uploadingType === item.type ? "Uploading..." : existing ? "Replace" : "Upload"}
                    </label>
                    <input
                      id={inputId}
                      type="file"
                      accept={item.accept}
                      className="hidden"
                      onChange={(e) => handleUpload(e.target.files?.[0] || null, item.type)}
                      disabled={uploadingType === item.type || deleting}
                    />
                    <span className="text-xs text-gray-500">Allowed: {item.accept.replace(/\./g, "").replace(/,/g, ", ")}</span>
                  </div>
                )}

                {item.type === "Selfie Photo" && !isVerified && (
                  <div className="space-y-3">
                    {cameraError && <div className="text-xs text-red-600">{cameraError}</div>}
                    <div className="flex items-center gap-3 flex-wrap">
                      {!cameraActive ? (
                        <button
                          type="button"
                          onClick={() => startCamera(item.type)}
                          className="px-4 py-2 rounded-md text-sm font-medium border bg-white text-primary-700 border-primary-200 hover:bg-primary-50"
                        >
                          Use Camera
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => capturePhoto(item.type)}
                            className="px-4 py-2 rounded-md text-sm font-medium border bg-primary-600 text-white border-primary-700 hover:bg-primary-700"
                          >
                            Capture & Upload
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="px-3 py-2 rounded-md text-sm font-medium border bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                          >
                            Stop Camera
                          </button>
                        </>
                      )}
                      {cameraActive && <span className="text-xs text-gray-600">Camera ready</span>}
                    </div>
                    {cameraActive && (
                      <div className="rounded-lg overflow-hidden border border-gray-200 bg-black/70">
                        <video ref={videoRef} className="w-full max-h-64 object-contain" muted playsInline />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardBody>
      </Card>
    </div>
  );
};
