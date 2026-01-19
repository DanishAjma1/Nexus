import React, { useState, useEffect } from "react";
import { FileText, Upload, Download, Trash2, CheckCircle2, AlertCircle, FileUp, Loader2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import axios from "axios";
import toast from "react-hot-toast";
import { PdfPreviewModal } from "../../components/ui/PdfPreviewModal";
import { Eye } from "lucide-react";

interface DBDocument {
  _id: string;
  type: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
}

const DOCUMENT_TYPES = [
  {
    id: "pitch_deck",
    name: "Pitch Deck",
    requirements: [
      "Problem & Solution", "Product / Demo", "Market Size (TAM, SAM, SOM)",
      "Business Model", "Traction & Growth", "Competition", "Team",
      "Financial Highlights", "Funding Ask & Equity Offered", "Exit Strategy"
    ]
  },
  {
    id: "business_plan",
    name: "Business Plan",
    requirements: [
      "Company Overview", "Vision & Mission", "Detailed Market Analysis",
      "Product / Service Details", "Marketing & Sales Strategy", "Operations Plan",
      "Team & Roles", "Legal Structure", "Risk Analysis", "Long-term Growth Plan"
    ]
  },
  {
    id: "financial_projections",
    name: "Financial Projections",
    requirements: [
      "3–5 Year Revenue Forecast", "Expense Forecast", "Profit & Loss Statement",
      "Cash Flow Projection", "Break-Even Analysis", "Burn Rate & Runway",
      "Unit Economics (CAC, LTV)", "Valuation Assumptions"
    ]
  },
  {
    id: "legal_docs",
    name: "Company Registration & Legal Docs",
    requirements: [
      "Certificate of Incorporation", "SECP Registration", "NTN / Tax Registration",
      "Memorandum & Articles", "Shareholder Agreements"
    ]
  },
  {
    id: "revenue_traction",
    name: "Revenue & Traction Report",
    requirements: [
      "Monthly Active Users", "Revenue Growth", "Customer Acquisition",
      "Retention Rate", "Partnerships", "Contracts / LOIs"
    ]
  },
  {
    id: "use_of_funds",
    name: "Use of Funds",
    requirements: [
      "Product Development", "Marketing", "Hiring", "Operations",
      "Legal & Compliance", "Runway Timeline"
    ]
  }
];

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DBDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ url: string; name: string } | null>(null);

  const URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${URL}/document`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data.documents);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, typeName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Format must be PDF");
      return;
    }

    setUploading(typeName);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", typeName);

    try {
      await axios.post(`${URL}/document/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success(`${typeName} uploaded successfully`);
      fetchDocuments();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await axios.get(fileUrl, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await axios.delete(`${URL}/document/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Document deleted");
      fetchDocuments();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Startup Documents</h1>
          <p className="text-gray-600 italic">Complete your profile by uploading these key documents. You can upload them when you want.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOCUMENT_TYPES.map((docType) => {
          const uploadedDoc = documents.find(d => d.type === docType.name);

          return (
            <Card key={docType.id} className="flex flex-col h-full border hover:border-primary-300 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden">
              <CardHeader className={`${uploadedDoc ? 'bg-green-50' : 'bg-blue-50/50'} border-b flex flex-row items-center justify-between py-4`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${uploadedDoc ? 'bg-green-100' : 'bg-primary-100'}`}>
                    <FileText className={uploadedDoc ? 'text-green-600' : 'text-primary-600'} size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">{docType.name}</h3>
                </div>
                {uploadedDoc ? (
                  <Badge variant="success" className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle2 size={12} className="mr-1" /> Completed
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200 text-[10px] uppercase tracking-wider">
                    Pending
                  </Badge>
                )}
              </CardHeader>
              <CardBody className="flex-1 flex flex-col p-5">
                <div className="mb-4">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center">
                    <AlertCircle size={12} className="mr-1" /> What to Include:
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {docType.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start text-xs text-gray-600">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                        {req}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-5 border-t border-dashed border-gray-200">
                  {uploadedDoc ? (
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="text-gray-400 shrink-0" size={18} />
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{uploadedDoc.fileName}</p>
                            <p className="text-[10px] text-gray-500">Uploaded on {new Date(uploadedDoc.uploadedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-4">
                          <button
                            onClick={() => setPreviewDoc({ url: `${URL}${uploadedDoc.fileUrl}`, name: uploadedDoc.fileName })}
                            className="p-2 hover:bg-white rounded-lg text-gray-600 hover:text-blue-600 transition-colors border border-transparent hover:border-gray-200"
                            title="View PDF"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDownload(`${URL}${uploadedDoc.fileUrl}`, uploadedDoc.fileName)}
                            className="p-2 hover:bg-white rounded-lg text-gray-600 hover:text-green-600 transition-colors border border-transparent hover:border-gray-200"
                            title="Download PDF"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(uploadedDoc._id)}
                            className="p-2 hover:bg-white rounded-lg text-red-400 hover:text-red-600 transition-colors border border-transparent hover:border-gray-200"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="block">
                        <input
                          id={`replace-${docType.id}`}
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => handleUpload(e, docType.name)}
                          disabled={uploading === docType.name}
                        />
                        <Button
                          variant="outline"
                          fullWidth
                          className="text-xs bg-white h-10 border-gray-300 hover:bg-gray-50"
                          disabled={uploading === docType.name}
                          type="button"
                          onClick={() => document.getElementById(`replace-${docType.id}`)?.click()}
                        >
                          {uploading === docType.name ? <Loader2 size={14} className="animate-spin" /> : <FileUp size={14} className="mr-2" />}
                          Replace PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="block">
                      <input
                        id={`upload-${docType.id}`}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => handleUpload(e, docType.name)}
                        disabled={uploading === docType.name}
                      />
                      <Button
                        fullWidth
                        className="bg-primary-600 hover:bg-primary-700 text-white h-12 shadow-sm font-semibold"
                        disabled={uploading === docType.name}
                        type="button"
                        onClick={() => document.getElementById(`upload-${docType.id}`)?.click()}
                      >
                        {uploading === docType.name ? (
                          <div className="flex items-center">
                            <Loader2 size={18} className="animate-spin mr-2" />
                            Uploading...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Upload size={18} className="mr-2" />
                            Upload {docType.name}
                          </div>
                        )}
                      </Button>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 text-center mt-2 italic">* Only PDF format accepted</p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {previewDoc && (
        <PdfPreviewModal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          fileUrl={previewDoc.url}
          fileName={previewDoc.name}
        />
      )}
    </div>
  );
};

export default DocumentsPage;
