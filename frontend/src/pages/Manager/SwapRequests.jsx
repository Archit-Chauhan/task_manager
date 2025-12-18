import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const SwapRequests = () => {
  // Protect route
  const { isAccessGranted } = useProtectedRoute(["MANAGER", "ADMIN"]);
  const { execute, isLoading } = useApi();

  const [swaps, setSwaps] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch swaps
  useEffect(() => {
    execute("/swaps").then(setSwaps).catch(() => {
      alert("Failed to load swap requests");
    });
  }, [execute]);

  if (!isAccessGranted) return null;

  const handleRespond = async (swapId, action) => {
    if (!window.confirm(`Are you sure you want to ${action.toLowerCase()} this swap?`)) {
      return;
    }

    try {
      setActionLoading(swapId);

      await execute(`/swaps/${swapId}/respond`, "post", {
        action
      });

      // Update UI immediately
      setSwaps((prev) =>
        prev.map((s) =>
          s._id === swapId ? { ...s, status: action } : s
        )
      );

      alert(`Swap ${action.toLowerCase()}ed successfully`);
    } catch (err) {
      alert("Failed to process swap");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold text-indigo-700">
        Swap Requests Approval
      </h1>

      {isLoading ? (
        <p className="text-gray-600">Loading swap requests...</p>
      ) : swaps.length === 0 ? (
        <p className="text-gray-500">No swap requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {swaps.map((swap) => (
            <Card key={swap._id}>
              <div className="space-y-2">
                <p className="font-semibold">
                  Requester:{" "}
                  <span className="text-gray-700">
                    {swap.requesterId?.name}
                  </span>
                </p>

                <p className="text-sm text-gray-600">
                  Requested Shift:{" "}
                  {swap.requesterShiftId?.title || "N/A"}
                </p>

                <p className="text-sm text-gray-600">
                  Target Employee:{" "}
                  {swap.targetOwnerId?.name}
                </p>

                <p className="text-sm text-gray-600">
                  Target Shift:{" "}
                  {swap.targetShiftId?.title || "N/A"}
                </p>

                <p
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    swap.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : swap.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {swap.status}
                </p>

                {swap.status === "PENDING" && (
                  <div className="flex gap-3 pt-3">
                    <Button
                      variant="primary"
                      disabled={actionLoading === swap._id}
                      onClick={() => handleRespond(swap._id, "APPROVE")}
                    >
                      Approve
                    </Button>

                    <Button
                      variant="danger"
                      disabled={actionLoading === swap._id}
                      onClick={() => handleRespond(swap._id, "REJECT")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SwapRequests;
