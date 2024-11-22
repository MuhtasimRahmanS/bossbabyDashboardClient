import { useEffect, useState } from "react";
import OrderHeader from "../element/OrderHeader";
import OrderTable from "../element/OrderTable";
import EditOrderModal from "../element/EditOrderModal";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    startDate: null,
    endDate: null,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async ({
    search = "",
    startDate = "",
    endDate = "",
    after = "",
  }) => {
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (search) queryParams.append("search", search);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (after) queryParams.append("after", after);

      const response = await fetch(
        `http://localhost:3000/api/orders?${queryParams.toString()}`
      );
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (response.ok) {
          if (after) {
            setOrders((prevOrders) => [...prevOrders, ...data.orders]);
          } else {
            setOrders(data.orders);
          }
        } else {
          throw new Error(data.message || "Failed to fetch orders.");
        }
      } else {
        throw new Error("Invalid response format. Expected JSON.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      if (after) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDateFilter = (startDate, endDate) => {
    setSelectedDate({
      startDate: startDate ? startDate.toISOString() : "",
      endDate: endDate ? endDate.toISOString() : "",
    });
  };

  useEffect(() => {
    setIsLoading(true);
    fetchOrders({
      search: searchQuery,
      startDate: selectedDate.startDate,
      endDate: selectedDate.endDate,
    });
  }, [searchQuery, selectedDate]);

  const loadMoreOrders = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const lastOrderId = orders.length > 0 ? orders[orders.length - 1]._id : "";
    fetchOrders({
      search: searchQuery,
      startDate: selectedDate.startDate,
      endDate: selectedDate.endDate,
      after: lastOrderId,
    });
  };

  const handleOpenEditModal = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedOrder(null);
  };

  const handleEditOrderSuccess = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
    handleCloseEditModal();
  };

  return (
    <div>
      <OrderHeader onSearch={handleSearch} onDateFilter={handleDateFilter} />
      {error && <div className="text-red-500">{error}</div>}
      {isLoading ? (
        <div className="text-center py-4">Loading orders...</div>
      ) : (
        <OrderTable
          orders={orders}
          loadMoreOrders={loadMoreOrders}
          isLoadingMore={isLoadingMore}
          onEdit={handleOpenEditModal}
        />
      )}
      <EditOrderModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        order={selectedOrder}
        onEditSuccess={handleEditOrderSuccess}
      />
    </div>
  );
};

export default ManageOrdersPage;
