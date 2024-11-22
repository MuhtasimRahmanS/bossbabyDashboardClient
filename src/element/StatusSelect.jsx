import { useState } from "react";

const StatusSelect = ({ order, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const statusOptions = [
    "pending",
    "confirm",
    "pack",
    "shipped",
    "return",
    "successful",
  ];

  const handleStatusChange = async (newStatus) => {
    setLoading(true);

    try {
      // Update the status in the database via API call
      const response = await fetch(`/api/orders/${order._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setSelectedStatus(newStatus);
        onStatusChange(newStatus);

        // If the status is changed to 'return', handle stock updates
        if (newStatus === "return") {
          // Call function to update stock in your database if needed
          await updateProductStock(order.cart);
        }

        alert(`Status updated to ${newStatus} successfully!`);
      } else {
        const result = await response.json();
        throw new Error(result.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error.message);
      alert("Error updating status: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProductStock = async (cart) => {
    try {
      const response = await fetch("/api/update-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product stock.");
      }
    } catch (error) {
      console.error("Stock update error:", error);
      alert("Stock update error: " + error.message);
    }
  };

  return (
    <div className="relative">
      <select
        value={selectedStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
        disabled={loading}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
      {loading && <p className="text-blue-500">Updating status...</p>}
    </div>
  );
};

export default StatusSelect;
