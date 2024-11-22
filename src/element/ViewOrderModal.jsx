const ViewOrderModal = ({ order, onClose }) => {
  if (!order) return null;

  const calculateSubtotal = () =>
    order.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>

        <div className="mb-4 space-y-2">
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Customer Name:</strong> {order.name}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
          <p>
            <strong>Additional Note:</strong> {order.note || "N/A"}
          </p>
          <p>
            <strong>Order Date:</strong> {order.orderDate}
          </p>
          <p>
            <strong>Order Time:</strong> {order.orderTime}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Ordered Products</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Image</th>
                <th className="text-left py-2">Product Name</th>
                <th className="text-left py-2">Size</th>
                <th className="text-left py-2">Quantity</th>
                <th className="text-left py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.cart.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2">{item.productName}</td>
                  <td className="py-2">{item.selectedSize}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">{item.price} TK</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-1">
          <p>
            <strong>Subtotal:</strong> {calculateSubtotal()} TK
          </p>
          <p>
            <strong>Delivery Charge:</strong> {order.deliveryCharge} TK
          </p>
          <p>
            <strong>Total Price:</strong> {order.totalPrice} TK
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderModal;
