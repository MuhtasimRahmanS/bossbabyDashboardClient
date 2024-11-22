import { useState, useEffect } from "react";
import AddProductForm from "../element/AddProductForm";
import EditProductForm from "../element/EditProductForm";
import useAxiosPublic from "../hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const ManageProducts = () => {
  const axios = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [pagination, setPagination] = useState({ page: 1, hasMore: true });
  const [modalState, setModalState] = useState({
    isAddModalOpen: false,
    isEditModalOpen: false,
    selectedProduct: null,
  });
  const [allProducts, setAllProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products", {
        params: {
          search: searchTerm,
          category,
          page: pagination.page,
          limit: 10,
        },
      });
      return response.data; // Assuming data contains { products, totalPages }
    } catch (error) {
      toast.error("Failed to load products.");
      return { products: [], totalPages: 0 };
    }
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", searchTerm, category, pagination.page],
    queryFn: fetchProducts,
    keepPreviousData: true,
    staleTime: 5000,
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 0;

  // Update products whenever new page data is fetched
  useEffect(() => {
    setAllProducts((prevProducts) => {
      if (pagination.page === 1) {
        return products;
      }
      const productIds = new Set(prevProducts.map((p) => p._id));
      const uniqueProducts = products.filter((p) => !productIds.has(p._id));
      return [...prevProducts, ...uniqueProducts];
    });

    setPagination((prev) => ({
      ...prev,
      hasMore: pagination.page < totalPages,
    }));
  }, [products, pagination.page, totalPages]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination({ page: 1, hasMore: true });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPagination({ page: 1, hasMore: true });
  };

  const handleScroll = (e) => {
    if (
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight &&
      pagination.hasMore &&
      !isLoading
    ) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleDeleteItem = async (product) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`/products/${product._id}`);
        if (res.data.deletedCount > 0) {
          toast.success(`${product.name} has been deleted`);
          setAllProducts((prev) => prev.filter((p) => p._id !== product._id));
        }
      } catch (error) {
        toast.error("Failed to delete the product.");
      }
    }
  };

  const openModal = () =>
    setModalState({ ...modalState, isAddModalOpen: true });
  const closeModal = () =>
    setModalState({ ...modalState, isAddModalOpen: false });

  const openEditModal = (product) =>
    setModalState({ isEditModalOpen: true, selectedProduct: product });
  const closeEditModal = () =>
    setModalState({ isEditModalOpen: false, selectedProduct: null });

  return (
    <div>
      <div className="bg-white shadow-md p-4 flex flex-col sm:flex-row justify-between items-center mb-4 w-full">
        <h1 className="text-xl font-semibold hidden sm:block">
          Manage Products
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products..."
            className="border rounded px-4 py-2 focus:outline-none w-full sm:w-auto"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="border rounded px-4 py-2 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Boy">Boy</option>
            <option value="Girl">Girl</option>
            <option value="Newborn">Newborn</option>
          </select>
          <button
            onClick={openModal}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>
      </div>

      <div
        className="overflow-x-auto"
        style={{ height: "calc(100vh - 100px)", overflowY: "auto" }}
        onScroll={handleScroll}
      >
        {isLoading && pagination.page === 1 ? (
          <div className="text-center py-4">Loading...</div>
        ) : isError ? (
          <div className="text-center py-4">Error loading products.</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 w-36 sm:w-40 text-left">Image</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Sizes</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Discount</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="px-4 h-36 w-36 sm:h-40 sm:w-40 py-2">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-36 w-36 object-cover sm:h-40 sm:w-40"
                    />
                  </td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">
                    {product.sizes.map((size) => (
                      <span key={size.size} className="block">
                        {size.size}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    {product.sizes.map((size) => (
                      <span key={size.size} className="block">
                        {size.stock}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    {product.sizes.map((size) => (
                      <span key={size.size} className="block">
                        {size.price}৳
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    {product.sizes.map((size) => (
                      <span key={size.size} className="block">
                        {size.discountPrice}৳
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-start sm:justify-center">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDeleteItem(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!pagination.hasMore && pagination.page > 1 && (
          <div className="text-center py-4">No more products to load.</div>
        )}
      </div>

      {/* Add Product Modal */}
      {modalState.isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <AddProductForm
            className="bg-white p-4 rounded shadow-md"
            onClose={closeModal}
            onSuccess={() => {
              refetch();
              closeModal();
            }}
          />
        </div>
      )}

      {/* Edit Product Modal */}
      {modalState.isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <EditProductForm
            className="bg-white p-4 rounded shadow-md"
            product={modalState.selectedProduct}
            onClose={closeEditModal}
            onSuccess={() => {
              refetch();
              closeEditModal();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
