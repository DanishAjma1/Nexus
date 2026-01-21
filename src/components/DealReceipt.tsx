import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X, Download, Printer, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/Button";

const URL = import.meta.env.VITE_BACKEND_URL;

interface DealReceiptProps {
  dealId: string;
  onClose: () => void;
}

export const DealReceipt: React.FC<DealReceiptProps> = ({ dealId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [deal, setDeal] = useState<any>(null);
  const receiptId = "deal-receipt";
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTransactionDetails();
  }, [dealId]);

  const fetchTransactionDetails = async () => {
    try {
      const res = await axios.get(`${URL}/deal/get-transaction/${dealId}`);
      setTransactions(res.data.transactions || []);
      setSelectedTransaction(res.data.transactions?.[0] || null); // Default to first (original investment)
      setDeal(res.data.deal);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      toast.error("Failed to load receipt");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!receiptRef.current) {
      toast.error("Receipt not ready to print");
      return;
    }

    const printContents = receiptRef.current.outerHTML;
    const styles = Array.from(
      document.querySelectorAll('link[rel="stylesheet"], style')
    )
      .map((el) => el.outerHTML)
      .join("");

    const printWindow = window.open("", "_blank", "noopener,noreferrer");

    if (!printWindow) {
      toast.error("Popup blocked. Please allow popups to print.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          ${styles}
          <style>
            @page { size: A4 landscape; margin: 12mm; }
            * { box-sizing: border-box; }
            body { margin: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #fff; }
            .print-wrapper { width: 100%; }
          </style>
        </head>
        <body>
          <div class="print-wrapper">${printContents}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleDownload = async () => {
    try {
      // Using html2canvas and jsPDF for download functionality
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      if (!receiptRef.current) {
        toast.error("Receipt not ready to download");
        return;
      }

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`Investment-Receipt-${selectedTransaction?.paymentIntentId || dealId}.pdf`);
      toast.success("Receipt downloaded successfully!");
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast.error("Failed to download receipt");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!selectedTransaction || !deal || transactions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <p className="text-red-600">Receipt not found</p>
          <p className="text-sm text-gray-600 mt-2">
            {!deal && "Deal information is missing."}
            {deal && transactions.length === 0 && "No transaction records found for this deal."}
            {deal && transactions.length > 0 && !selectedTransaction && "Unable to load transaction details."}
          </p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto overflow-x-hidden">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full my-8 max-h-[95vh] flex flex-col">
        {/* Header Actions */}
        <div className="flex justify-between items-center px-5 py-3 border-b print:hidden flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Investment Receipt</h2>
            {transactions.length > 1 && (
              <select
                value={selectedTransaction._id}
                onChange={(e) => {
                  const tx = transactions.find(t => t._id === e.target.value);
                  setSelectedTransaction(tx);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              >
                {transactions.map((tx, index) => (
                  <option key={tx._id} value={tx._id}>
                    {tx.isAdditionalInvestment 
                      ? `Additional Investment #${index} - $${tx.amount?.toLocaleString()}` 
                      : `Original Investment - $${tx.amount?.toLocaleString()}`}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download PDF
            </Button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div
          ref={receiptRef}
          id={receiptId}
          className="p-6 bg-white overflow-x-hidden overflow-y-auto flex-1"
        >
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-md shadow px-5 py-3 inline-flex items-center justify-center">
              <img
                src="/big-logo.png"
                alt="Trust Bridge Logo"
                className="h-20 w-auto"
                loading="lazy"
              />
            </div>
          </div>

          {/* Header with Status Badge */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Investment Receipt</h1>
            <div className="flex justify-center items-center gap-2 mt-4">
              <CheckCircle2 className="text-green-500" size={24} />
              <span className="text-lg font-semibold text-green-600">
                {selectedTransaction.status === 'funds_released' ? 'Payment Released' : 'Payment Confirmed'}
              </span>
            </div>
          </div>

          {/* Company/Platform Info */}
          <div className="text-center mb-6 pb-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Trust Bridge Investment Platform</h2>
            <p className="text-gray-600 text-sm">Connecting Investors with Innovative Startups</p>
          </div>

          {/* Transaction Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-800 mb-3">INVESTOR DETAILS</h3>
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">{selectedTransaction.investorName}</p>
                  <p className="text-sm text-gray-600">{selectedTransaction.investorId?.email}</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-green-800 mb-3">ENTREPRENEUR DETAILS</h3>
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">{selectedTransaction.entrepreneurName}</p>
                  <p className="text-sm text-gray-700 font-semibold">{selectedTransaction.entrepreneurId?.startupName}</p>
                  <p className="text-sm text-gray-600">{selectedTransaction.entrepreneurId?.email}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-purple-800 mb-3">TRANSACTION INFO</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Receipt No:</span>
                    <span className="font-mono text-gray-900">{selectedTransaction._id?.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono text-xs text-gray-900">{selectedTransaction.paymentIntentId?.slice(0, 20)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">{new Date(selectedTransaction.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="text-gray-900">{new Date(selectedTransaction.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-indigo-800 mb-3">DEAL TERMS</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment Type:</span>
                    <span className="text-gray-900 font-medium">{deal.investmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Equity Offered:</span>
                    <span className="text-gray-900 font-medium">{deal.equityOffered}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valuation:</span>
                    <span className="text-gray-900 font-medium">${deal.postMoneyValuation?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-5 mb-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">PAYMENT BREAKDOWN</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-base">Investment Amount</span>
                <span className="text-lg font-semibold">${selectedTransaction.amount?.toLocaleString()}</span>
              </div>
              {selectedTransaction.stripeFee && (
                <div className="flex justify-between items-center text-gray-600 text-sm">
                  <span>Processing Fee</span>
                  <span>-${selectedTransaction.stripeFee?.toFixed(2)}</span>
                </div>
              )}
              {selectedTransaction.platformCommission > 0 && (
                <div className="flex justify-between items-center text-gray-600 text-sm">
                  <span>Platform Commission</span>
                  <span>-${selectedTransaction.platformCommission?.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t-2 border-gray-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Net Amount to Entrepreneur</span>
                  <span className="text-xl font-bold text-green-600">
                    ${selectedTransaction.netAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {selectedTransaction.isAdditionalInvestment && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 font-medium">
                ⚡ This is an additional investment to the existing deal.
              </p>
            </div>
          )}

          {/* Status Timeline */}
          <div className="bg-gray-50 rounded-lg p-5 mb-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3">PAYMENT STATUS</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Payment Received</p>
                  <p className="text-xs text-gray-500">{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {selectedTransaction.adminActionDate && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Funds Released to Entrepreneur</p>
                    <p className="text-xs text-gray-500">{new Date(selectedTransaction.adminActionDate).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {selectedTransaction.status === 'paid' && !selectedTransaction.adminActionDate && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Awaiting Admin Approval</p>
                    <p className="text-xs text-gray-500">Funds will be released soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-5 border-t border-gray-200 space-y-2">
            <p>This is an official receipt generated by TrustBridge Investment Platform</p>
            <p>For any queries, please contact aitrustbridge@gmail.com</p>
            <p className="font-mono">Transaction ID: {selectedTransaction.paymentIntentId}</p>
            <p className="text-gray-400 mt-4">Generated on {new Date().toLocaleString()}</p>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t bg-white print:hidden flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>

      {/* Print Styles */}
        <style>{`
        @page {
          size: A4 landscape;
          margin: 12mm;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .print\:hidden {
            display: none !important;
          }
          #${receiptId}, 
          #${receiptId} * {
            visibility: visible;
          }
          #${receiptId} {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
