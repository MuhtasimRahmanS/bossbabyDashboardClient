import React, { useState } from "react";

const EditOrderModal = ({ isOpen, onClose, order, onEditSuccess }) => {
  const [updatedOrder, setUpdatedOrder] = useState(order);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCartChange = (index, field, value) => {
    const updatedCart = [...updatedOrder.cart];
    updatedCart[index][field] = value;
    setUpdatedOrder((prev) => ({
      ...prev,
      cart: updatedCart,
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        const updatedOrderData = await response.json();
        onEditSuccess(updatedOrderData);
        onClose();
        alert("Order updated successfully!");
      } else {
        const result = await response.json();
        alert(`Failed to update order: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("An error occurred while updating the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Edit Order</h2>
          <form>
            {/* Customer Details */}
            <div className="mb-4">
              <label className="block mb-1">Customer Name:</label>
              <input
                type="text"
                name="name"
                value={updatedOrder.name}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Phone Number:</label>
              <input
                type="text"
                name="phone"
                value={updatedOrder.phone}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Address:</label>
              <textarea
                name="address"
                value={updatedOrder.address}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Cart Items */}
            <h3 className="text-lg font-semibold mt-4 mb-2">Order Items</h3>
            {updatedOrder.cart.map((item, index) => (
              <div key={item.productId} className="mb-4 border p-2 rounded">
                <div className="flex items-center gap-2">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <div className="mt-1">
                      <label>Quantity:</label>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) =>
                          handleCartChange(
                            index,
                            "quantity",
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="w-20 border rounded p-1 ml-2"
                      />
                    </div>
                    <div className="mt-1">
                      <label>Size:</label>
                      <input
                        type="number"
                        value={item.selectedSize}
                        min="1"
                        onChange={(e) =>
                          handleCartChange(
                            index,
                            "selectedSize",
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="w-20 border rounded p-1 ml-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Note */}
            <div className="mb-4">
              <label className="block mb-1">Note:</label>
              <textarea
                name="note"
                value={updatedOrder.note}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditOrderModal;
