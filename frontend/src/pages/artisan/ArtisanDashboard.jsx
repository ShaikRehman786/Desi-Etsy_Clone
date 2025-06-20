import { useEffect, useState } from "react";
import { getMyProducts, deleteProduct } from "../../services/product";
import { toast } from "react-toastify";
import ProductForm from "./ProductForm";

export default function ArtisanDashboard() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const data = await getMyProducts();
      setProducts(data);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Products</h1>

      <button
        onClick={() => {
          setEditProduct(null);
          setShowForm(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Product
      </button>

      {showForm && (
        <ProductForm
          initialData={editProduct}
          onClose={() => {
            setShowForm(false);
            fetchProducts();
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((prod) => (
          <div
            key={prod._id}
            className="border p-4 rounded shadow flex flex-col justify-between"
          >
            <div>
              <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover rounded" />
              <h3 className="font-semibold text-lg mt-2">{prod.name}</h3>
              <p className="text-sm">{prod.description}</p>
              <p className="text-green-600 font-bold mt-1">₹{prod.price}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setEditProduct(prod);
                  setShowForm(true);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(prod._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
