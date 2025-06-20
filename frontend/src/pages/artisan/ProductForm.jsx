import { useState } from "react";
import { createProduct, updateProduct } from "../../services/product";
import { toast } from "react-toastify";

export default function ProductForm({ initialData, onClose }) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    }
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        await updateProduct(initialData._id, form);
        toast.success("Product updated");
      } else {
        await createProduct(form);
        toast.success("Product created");
      }
      onClose();
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-4 p-4 border rounded">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        type="number"
        placeholder="Price"
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="image"
        value={form.image}
        onChange={handleChange}
        placeholder="Image URL"
        required
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {initialData ? "Update" : "Create"}
      </button>
    </form>
  );
}
