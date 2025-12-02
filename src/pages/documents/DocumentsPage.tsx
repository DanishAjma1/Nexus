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
    <div className="space-y-6 animate-fade-in p-4 bg-black min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-300">Documents</h1>
          <p className="text-purple-400">Manage your startup's important files</p>
        </div>

        <label>
          <input type="file" multiple className="hidden" onChange={handleUpload} />
          <Button
            leftIcon={<Upload size={18} />}
            className="bg-purple-800 text-white hover:bg-purple-700 border-none"
          >
            Upload Document
          </Button>
        </label>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Storage info */}
        <Card className="lg:col-span-1 w-full bg-purple-900 border border-purple-800 text-white">
          <CardHeader>
            <h2 className="text-lg font-medium text-purple-300">Storage</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-purple-400">
                <span>Used</span>
                <span className="font-medium text-white">12.5 GB</span>
              </div>
              <div className="h-2 bg-purple-800 rounded-full">
                <div className="h-2 bg-purple-500 rounded-full w-1/2" />
              </div>
              <div className="flex justify-between text-sm text-purple-400">
                <span>Available</span>
                <span className="font-medium text-white">7.5 GB</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Document list */}
        <div className="lg:col-span-3 w-full">
          <Card className="bg-purple-900 border border-purple-800 text-white">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <h2 className="text-lg font-medium text-purple-300">All Documents</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-700 text-purple-200 hover:bg-purple-800"
                >
                  Sort by
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-700 text-purple-200 hover:bg-purple-800"
                >
                  Filter
                </Button>
              </div>
            </CardHeader>

            <CardBody>
              <div className="space-y-2">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-purple-800 rounded-lg transition-colors duration-200 gap-2"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-700 rounded-lg">
                          <FileText size={24} className="text-purple-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-white truncate">
                              {doc.name}
                            </h3>
                            {doc.shared && (
                              <Badge variant="secondary" size="sm">
                                Shared
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-purple-400">
                            <span>{doc.type}</span>
                            <span>{doc.size}</span>
                            <span>Modified {doc.lastModified}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-purple-400 hover:text-purple-200"
                          aria-label="Download"
                        >
                          <Download size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-purple-400 hover:text-purple-200"
                          aria-label="Share"
                        >
                          <Share2 size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-red-600 hover:text-red-500"
                          aria-label="Delete"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-purple-400">
                    No documents uploaded yet
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
