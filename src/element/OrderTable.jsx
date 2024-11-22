import { useEffect, useState } from "react";
import ViewOrderModal from "./ViewOrderModal";
import PrintInvoice from "./PrintInvoice";
import SendToPathao from "./SendToPathao";
import StatusSelect from "./StatusSelect";
import EditOrderModal from "./EditOrderModal";
import DeleteOrder from "./DeleteOrder";

const OrderTable = ({
  orders,
  loadMoreOrders,
  isLoadingMore,
  updateOrderStatus,
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Handle infinite scroll with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreOrders(); // Load more orders when the anchor is in view
        }
      },
      { threshold: 0.1 }
    );

    const scrollAnchor = document.querySelector("#scroll-anchor");
    if (scrollAnchor) {
      observer.observe(scrollAnchor);
    }

    return () => {
      if (scrollAnchor) observer.unobserve(scrollAnchor);
    };
  }, [loadMoreOrders]);

  const handleDeleteSuccess = (deletedOrderId) => {
    // Handle deletion success by removing the order from the list
    setSelectedOrder(null); // Clear the selected order if it's deleted
    loadMoreOrders(); // Optionally refresh the order list after deletion
  };

  return (
    <div
      className="overflow-x-auto"
      style={{ height: "calc(100vh - 100px)", overflowY: "auto" }}
    >
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Products</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.name}</td>
              <td>{order.address}</td>
              <td>{order.phone}</td>
              <td>
                <img
                  src={order.cart[0].productImage}
                  alt={order.cart[0].productName}
                  className="w-16 h-16 object-cover"
                />
                {/* Display only the first product image */}
              </td>
              <td>{order.totalPrice} TK</td>
              <td>
                <StatusSelect
                  order={order}
                  onStatusChange={(newStatus) =>
                    updateOrderStatus(order._id, newStatus)
                  }
                  status={order.status}
                />
              </td>
              <td>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsViewModalOpen(true);
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  View
                </button>
                <PrintInvoice order={order} />
                <SendToPathao
                  order={order}
                  onStatusUpdate={(newStatus) =>
                    updateOrderStatus(order._id, newStatus)
                  }
                  disabled={order.status === "shipped"}
                />
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsEditModalOpen(true);
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <DeleteOrder
                  orderId={order._id}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoadingMore && (
        <div className="text-center py-4">Loading more orders...</div>
      )}
      <div id="scroll-anchor" className="h-1"></div>
      {isViewModalOpen && selectedOrder && (
        <ViewOrderModal
          order={selectedOrder}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
      {isEditModalOpen && selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrderTable;
