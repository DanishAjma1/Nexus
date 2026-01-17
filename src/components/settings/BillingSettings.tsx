import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { CreditCard, Download, X, Edit } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

interface PaymentMethod {
  id: string;
  cardNumber: string;
  last4: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
}

interface CardFormData {
  cardNumber: string;
  cardholderName: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export const BillingSettings: React.FC = () => {
  const { user } = useAuth();
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CardFormData>({
    cardNumber: "",
    cardholderName: "",
    cvv: "",
    expiryMonth: "",
    expiryYear: "",
    isDefault: false,
  });

  const [invoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      date: "2025-11-01",
      amount: 29.99,
      status: "paid",
      description: "Monthly Subscription - November 2025",
    },
    {
      id: "INV-002",
      date: "2025-10-01",
      amount: 29.99,
      status: "paid",
      description: "Monthly Subscription - October 2025",
    },
    {
      id: "INV-003",
      date: "2025-09-01",
      amount: 29.99,
      status: "paid",
      description: "Monthly Subscription - September 2025",
    },
  ]);

  // Fetch cards from backend
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsFetching(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${URL}/user/cards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPaymentMethods(response.data.cards || []);
      } catch (error: any) {
        console.error("Error fetching cards:", error);
        if (error.response?.status !== 404) {
          toast.error("Failed to fetch cards");
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchCards();
  }, [URL]);

  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${URL}/user/cards/${id}/set-default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update local state
      setPaymentMethods((prev) =>
        prev.map((method) => ({
          ...method,
          isDefault: method.id === id,
        }))
      );
      toast.success("Card set as default successfully");
    } catch (error: any) {
      console.error("Error setting default card:", error);
      toast.error(error.response?.data?.message || "Failed to set default card");
    }
  };

  const handleEditCard = async (id: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${URL}/user/cards/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const card = response.data.card;
      setFormData({
        cardNumber: card.cardNumber,
        cardholderName: card.cardholderName,
        cvv: card.cvv,
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        isDefault: card.isDefault,
      });
      setEditingCardId(id);
      setIsModalOpen(true);
    } catch (error: any) {
      console.error("Error fetching card for edit:", error);
      toast.error(error.response?.data?.message || "Failed to load card details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCard = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this card?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${URL}/user/cards/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
      toast.success("Card removed successfully");
    } catch (error: any) {
      console.error("Error removing card:", error);
      toast.error(error.response?.data?.message || "Failed to remove card");
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cardNumber || !formData.cardholderName || !formData.cvv || !formData.expiryMonth || !formData.expiryYear) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate card number (should be 16 digits)
    const cardNumberDigits = formData.cardNumber.replace(/\s/g, "");
    if (cardNumberDigits.length !== 16 || !/^\d+$/.test(cardNumberDigits)) {
      toast.error("Please enter a valid 16-digit card number");
      return;
    }

    // Validate CVV (should be 3-4 digits)
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      toast.error("Please enter a valid CVV (3-4 digits)");
      return;
    }

    // Validate expiry month (01-12)
    if (!/^(0[1-9]|1[0-2])$/.test(formData.expiryMonth)) {
      toast.error("Please enter a valid month (01-12)");
      return;
    }

    // Validate expiry year (should be 2 digits)
    if (!/^\d{2}$/.test(formData.expiryYear)) {
      toast.error("Please enter a valid year (2 digits)");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (editingCardId) {
        // Update existing card
        await axios.put(
          `${URL}/user/cards/${editingCardId}`,
          {
            cardNumber: cardNumberDigits,
            cardholderName: formData.cardholderName,
            cvv: formData.cvv,
            expiryMonth: formData.expiryMonth,
            expiryYear: formData.expiryYear,
            isDefault: formData.isDefault,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Card updated successfully");
      } else {
        // Add new card
        await axios.post(
          `${URL}/user/cards`,
          {
            cardNumber: cardNumberDigits,
            cardholderName: formData.cardholderName,
            cvv: formData.cvv,
            expiryMonth: formData.expiryMonth,
            expiryYear: formData.expiryYear,
            isDefault: formData.isDefault,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Card added successfully");
      }

      // Refresh cards list
      const response = await axios.get(`${URL}/user/cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPaymentMethods(response.data.cards || []);

      // Reset form and close modal
      setFormData({
        cardNumber: "",
        cardholderName: "",
        cvv: "",
        expiryMonth: "",
        expiryYear: "",
        isDefault: false,
      });
      setEditingCardId(null);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving card:", error);
      toast.error(error.response?.data?.message || `Failed to ${editingCardId ? "update" : "add"} card`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    // Add spaces every 4 digits
    value = value.replace(/(.{4})/g, "$1 ").trim();
    setFormData({ ...formData, cardNumber: value });
  };

  const handleOpenAddModal = () => {
    setEditingCardId(null);
    setFormData({
      cardNumber: "",
      cardholderName: "",
      cvv: "",
      expiryMonth: "",
      expiryYear: "",
      isDefault: false,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCardId(null);
    setFormData({
      cardNumber: "",
      cardholderName: "",
      cvv: "",
      expiryMonth: "",
      expiryYear: "",
      isDefault: false,
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log("Downloading invoice:", invoiceId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Payment Methods
            </h2>
            <Button variant="outline" size="sm" onClick={handleOpenAddModal}>
              Add Card
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {isFetching ? (
            <div className="text-center py-8 text-gray-500">Loading cards...</div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No cards added yet</div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="text-gray-600" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {method.cardNumber}
                        </h3>
                        {method.isDefault && (
                          <Badge variant="primary">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {method.cardholderName} • Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCard(method.id)}
                      leftIcon={<Edit size={16} />}
                    >
                      Edit
                    </Button>
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveCard(method.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add/Edit Card Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCardId ? "Edit Card" : "Add New Card"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddCard} className="space-y-4">
                <div>
                  <Input
                    label="Card Number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    fullWidth
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Cardholder Name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.cardholderName}
                    onChange={(e) =>
                      setFormData({ ...formData, cardholderName: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <Input
                      label="CVV"
                      type="text"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setFormData({ ...formData, cvv: value });
                      }}
                      maxLength={4}
                      fullWidth
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      label="Month"
                      type="text"
                      placeholder="MM"
                      value={formData.expiryMonth}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                        setFormData({ ...formData, expiryMonth: value });
                      }}
                      maxLength={2}
                      fullWidth
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      label="Year"
                      type="text"
                      placeholder="YY"
                      value={formData.expiryYear}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                        setFormData({ ...formData, expiryYear: value });
                      }}
                      maxLength={2}
                      fullWidth
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                    Set as default card
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={handleCloseModal}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                  >
                    {editingCardId ? "Update Card" : "Save Card"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Billing History</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {invoice.id}
                    </h3>
                    <Badge
                      variant={
                        invoice.status === "paid"
                          ? "success"
                          : invoice.status === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{invoice.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{invoice.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            Billing Information
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Your Company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Address
              </label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="123 Main St"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Lahore"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="54000"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Update Billing Info</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
