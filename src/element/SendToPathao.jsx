import { useState } from "react";

const SendToPathao = ({ order, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendToPathao = async () => {
    setLoading(true);
    setError(null);

    try {
      // Example request to send the order to Pathao's API
      const response = await fetch("/api/send-to-pathao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order._id,
          name: order.name,
          phone: order.phone,
          address: order.address,
          products: order.cart.map((item) => ({
            productId: item.productId,
            name: item.productName,
            size: item.selectedSize,
            quantity: item.quantity,
          })),
          totalPrice: order.totalPrice,
          deliveryCharge: order.deliveryCharge,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // If successful, update the order status to 'shipped'
        onStatusUpdate("shipped");
        alert("Order sent to Pathao successfully!");
      } else {
        throw new Error(result.message || "Failed to send order to Pathao.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleSendToPathao}
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 ${
          loading || order.status === "shipped" ? "cursor-not-allowed" : ""
        }`}
        disabled={loading || order.status === "shipped"}
      >
        {loading ? "Sending..." : "Send to Pathao"}
      </button>
      {error && (
        <p className="text-red-500 mt-2">
          {error} Please try again or contact support.
        </p>
      )}
    </div>
  );
};

export default SendToPathao;
