import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    getRequestsForEntrepreneur,
    updateRequestStatus,
} from "../../data/collaborationRequests";
import { CollaborationRequest } from "../../types";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { Check, X, Clock } from "lucide-react";
import toast from "react-hot-toast";

export const EntrepreneurRequests: React.FC = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<CollaborationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = async () => {
        if (user?.userId) {
            try {
                const data = await getRequestsForEntrepreneur(user.userId);
                setRequests(data);
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user?.userId]);

    const handleStatusUpdate = async (
        requestId: string,
        newStatus: "accepted" | "rejected"
    ) => {
        try {
            await updateRequestStatus(requestId, newStatus);
            toast.success(`Request ${newStatus}`);
            fetchRequests(); // Refresh list
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (isLoading) {
        return <div className="p-6">Loading requests...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Collaboration Requests</h1>

            {requests.length === 0 ? (
                <Card>
                    <CardBody className="text-center py-8 text-gray-500">
                        No collaboration requests found.
                    </CardBody>
                </Card>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <Card key={request._id} className="overflow-hidden">
                            <CardBody className="p-4 sm:flex sm:items-center sm:justify-between gap-4">
                                <div className="flex items-start space-x-4">
                                    <Avatar
                                        src={request.inves_id?.avatarUrl}
                                        alt={request.inves_id?.name || "Investor"}
                                        size="lg"
                                    />
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {request.inves_id?.name || "Unknown Investor"}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-2">
                                            {new Date(request.time).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-700 bg-gray-50 p-3 rounded-md text-sm">
                                            "{request.message}"
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2 min-w-[150px] justify-end">
                                    {request.requestStatus === "pending" ? (
                                        <>
                                            <Button
                                                variant="ghost"
                                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                leftIcon={<X size={16} />}
                                                onClick={() => handleStatusUpdate(request._id, "rejected")}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                leftIcon={<Check size={16} />}
                                                onClick={() => handleStatusUpdate(request._id, "accepted")}
                                            >
                                                Accept
                                            </Button>
                                        </>
                                    ) : (
                                        <div className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${request.requestStatus === "accepted"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}>
                                            {request.requestStatus === "accepted" ? (
                                                <Check size={14} className="mr-1" />
                                            ) : (
                                                <X size={14} className="mr-1" />
                                            )}
                                            {request.requestStatus.charAt(0).toUpperCase() + request.requestStatus.slice(1)}
                                        </div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
