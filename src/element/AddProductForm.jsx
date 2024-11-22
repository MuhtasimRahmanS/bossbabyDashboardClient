import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;

const AddProductForm = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Boy");
  const [type, setType] = useState("Sneaker");
  const [color, setColor] = useState("");
  const [sizes, setSizes] = useState([
    { size: "", price: "", discountPrice: "", stock: "" },
  ]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddSize = () => {
    setSizes([...sizes, { size: "", price: "", discountPrice: "", stock: "" }]);
  };

  const handleRemoveSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][field] = value;
    setSizes(updatedSizes);
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Upload images to ImgBB
      const imgUploadPromises = images.map(async (image) => {
        const formData = new FormData();
        formData.append("image", image);
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${image_hosting_key}`,
          formData
        );
        return response.data.data.url; // Get the direct image URL
      });

      const imageUrls = await Promise.all(imgUploadPromises);

      // Step 2: Prepare product data
      const productData = {
        name,
        category,
        type,
        color,
        sizes: sizes.map((size) => ({
          size: parseInt(size.size),
          price: parseFloat(size.price),
          discountPrice: parseFloat(size.discountPrice),
          stock: parseInt(size.stock),
        })),
        images: imageUrls,
      };

      // Step 3: Post product data to your backend
      const response = await axios.post(
        "http://localhost:3000/products",
        productData
      );
      toast.success("Product added successfully");

      console.log("Product added successfully:", response.data);
      setLoading(false);
      onClose(); // Close the modal after successful submission
      onSuccess();
    } catch (error) {
      console.error("Error adding product:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4  rounded-xl max-h-screen overflow-y-auto"
      >
        <span className="text-xl font-medium mb-5">Add new product</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          required
          className="border rounded px-4 py-2 w-full mb-4"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-4 py-2 w-full mb-4"
        >
          <option value="Boy">Boy</option>
          <option value="Girl">Girl</option>
          <option value="Newborn">Newborn</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded px-4 py-2 w-full mb-4"
        >
          <option value="Sneaker">Sneaker</option>
          <option value="Sandal">Sandal</option>
          <option value="">None</option>
        </select>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Color"
          required
          className="border rounded px-4 py-2 w-full mb-4"
        />

        {/* Size Inputs */}
        {sizes.map((size, index) => (
          <div key={index} className="mb-4 flex gap-2">
            <input
              type="number"
              value={size.size}
              onChange={(e) => handleSizeChange(index, "size", e.target.value)}
              placeholder="Size"
              required
              className="border rounded px-4 py-2 w-full"
            />
            <input
              type="number"
              value={size.price}
              onChange={(e) => handleSizeChange(index, "price", e.target.value)}
              placeholder="Price"
              required
              className="border rounded px-4 py-2 w-full"
            />
            <input
              type="number"
              value={size.discountPrice}
              onChange={(e) =>
                handleSizeChange(index, "discountPrice", e.target.value)
              }
              placeholder="Discount Price"
              required
              className="border rounded px-4 py-2 w-full"
            />
            <input
              type="number"
              value={size.stock}
              onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
              placeholder="Stock"
              required
              className="border rounded px-4 py-2 w-full"
            />
            <button
              type="button"
              onClick={() => handleRemoveSize(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSize}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Size
        </button>

        {/* Image Upload */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
