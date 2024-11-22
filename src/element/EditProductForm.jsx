import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;

const EditProductForm = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product.name || "",
    category: product.category || "",
    type: product.type || "",
    color: product.color || "",
    sizes: product.sizes || [],
    images: product.images || [],
  });

  const [newSize, setNewSize] = useState({
    size: "",
    price: "",
    discountPrice: "",
    stock: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeChange = (index, e) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][e.target.name] = e.target.value;
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const addSize = () => {
    if (
      newSize.size &&
      newSize.price &&
      newSize.discountPrice &&
      newSize.stock
    ) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize],
      }));
      setNewSize({ size: "", price: "", discountPrice: "", stock: "" });
    }
  };

  const removeSize = (index) => {
    const updatedSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        imageFormData,
        {
          params: {
            key: `${image_hosting_key}`,
          },
        }
      );
      const imageUrl = response.data.data.url;
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.patch(
        `http://localhost:3000/products/${product._id}`,
        formData
      ); // Change to PATCH
      onSuccess();
      toast.success("Update Successfull");
    } catch (error) {
      console.error("Failed to update product", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-h-screen overflow-y-auto   ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md w-full max-w-3xl mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">Update Product</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border rounded px-4 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="border rounded px-4 py-2 w-full"
          >
            <option value="Boy">Boy</option>
            <option value="Girl">Girl</option>
            <option value="Newborn">Newborn</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="border rounded px-4 py-2 w-full"
          >
            <option value="">None</option>
            <option value="Sneaker">Sneaker</option>
            <option value="Sandal">Sandal</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Color</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="border rounded px-4 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Sizes</label>
          <div className="grid grid-cols-4 gap-2 text-sm font-medium mb-2">
            <div>Size</div>
            <div>Price</div>
            <div>Discount Price</div>
            <div>Stock</div>
          </div>
          {formData.sizes.map((size, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 mb-2">
              <input
                type="text"
                name="size"
                value={size.size}
                onChange={(e) => handleSizeChange(index, e)}
                className="border rounded px-2 py-1"
                placeholder="Size"
              />
              <input
                type="number"
                name="price"
                value={size.price}
                onChange={(e) => handleSizeChange(index, e)}
                className="border rounded px-2 py-1"
                placeholder="Price"
              />
              <input
                type="number"
                name="discountPrice"
                value={size.discountPrice}
                onChange={(e) => handleSizeChange(index, e)}
                className="border rounded px-2 py-1"
                placeholder="Discount Price"
              />
              <input
                type="number"
                name="stock"
                value={size.stock}
                onChange={(e) => handleSizeChange(index, e)}
                className="border rounded px-2 py-1"
                placeholder="Stock"
              />
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="bg-red-500 text-white px-2 rounded col-span-4"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              name="size"
              value={newSize.size}
              onChange={(e) =>
                setNewSize((prev) => ({ ...prev, size: e.target.value }))
              }
              className="border rounded px-2 py-1 w-1/4"
              placeholder="New Size"
            />
            <input
              type="number"
              name="price"
              value={newSize.price}
              onChange={(e) =>
                setNewSize((prev) => ({ ...prev, price: e.target.value }))
              }
              className="border rounded px-2 py-1 w-1/4"
              placeholder="Price"
            />
            <input
              type="number"
              name="discountPrice"
              value={newSize.discountPrice}
              onChange={(e) =>
                setNewSize((prev) => ({
                  ...prev,
                  discountPrice: e.target.value,
                }))
              }
              className="border rounded px-2 py-1 w-1/4"
              placeholder="Discount Price"
            />
            <input
              type="number"
              name="stock"
              value={newSize.stock}
              onChange={(e) =>
                setNewSize((prev) => ({ ...prev, stock: e.target.value }))
              }
              className="border rounded px-2 py-1 w-1/4"
              placeholder="Stock"
            />
            <button
              type="button"
              onClick={addSize}
              className="bg-blue-500 text-white px-2 rounded"
            >
              Add Size
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Images</label>
          <div className="grid grid-cols-2 gap-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2"
          />
          {isUploading && <p>Uploading...</p>}
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Product"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProductForm;
