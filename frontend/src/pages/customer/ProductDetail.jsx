
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/product";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext"; // ✅ Import the context

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  const { addToCart } = useCart(); // ✅ Use the context

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(product); // ✅ Use the context method with the product object
      toast.success("Product added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 rounded shadow"
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>
          <p className="text-xl text-green-700 font-bold mb-3">₹{product.price}</p>
          <p className="mb-4">{product.description}</p>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`px-4 py-2 rounded text-white ${
              adding ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
            }`}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
