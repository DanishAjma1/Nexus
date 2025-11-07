import React, { useState } from "react";
import { FileText, Upload, Download, Trash2, Share2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
}

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedDocs: Document[] = Array.from(files).map((file, idx) => ({
      id: documents.length + idx + 1,
      name: file.name,
      type: file.type || "Unknown",
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      lastModified: new Date(file.lastModified).toISOString().split("T")[0],
      shared: false,
    }));

    setDocuments((prev) => [...prev, ...uploadedDocs]);
  };

  return (
    <div className="space-y-6 bg-black min-h-screen p-6 text-gray-200 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">Documents</h1>
          <p className="text-gray-400">Manage your startup's important files</p>
        </div>

        <label>
          <input type="file" multiple className="hidden" onChange={handleUpload} />
          <Button
            leftIcon={<Upload size={18} />}
            asChild
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded-lg transition"
          >
            Upload Document
          </Button>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Storage info */}
        <Card className="lg:col-span-1 bg-neutral-900 border border-yellow-600 text-gray-200">
          <CardHeader>
            <h2 className="text-lg font-semibold text-yellow-400">Storage</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Used</span>
                <span className="font-medium text-yellow-300">12.5 GB</span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full">
                <div
                  className="h-2 bg-yellow-500 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Available</span>
                <span className="font-medium text-yellow-300">7.5 GB</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Document list */}
        <div className="lg:col-span-3">
          <Card className="bg-neutral-900 border border-yellow-600 text-gray-200">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-yellow-400">All Documents</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                >
                  Sort by
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                >
                  Filter
                </Button>
              </div>
            </CardHeader>

            <CardBody>
              {documents.length === 0 ? (
                <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center p-4 bg-black border border-yellow-700/30 hover:border-yellow-500 rounded-lg transition duration-200"
                    >
                      {/* File icon */}
                      <div className="p-2 bg-yellow-500/20 rounded-lg mr-4">
                        <FileText size={24} className="text-yellow-500" />
                      </div>

                      {/* File details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-yellow-300 truncate">
                            {doc.name}
                          </h3>
                          {doc.shared && (
                            <Badge className="bg-yellow-500 text-black text-xs">Shared</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                          <span>Modified {doc.lastModified}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-yellow-400 hover:text-yellow-300 transition"
                          aria-label="Download"
                        >
                          <Download size={18} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-yellow-400 hover:text-yellow-300 transition"
                          aria-label="Share"
                        >
                          <Share2 size={18} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-red-500 hover:text-red-400 transition"
                          aria-label="Delete"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
