// src/components/ProductCard.jsx
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.category}</p>
      <p className="text-green-700 font-bold mt-1">₹{product.price}</p>
      <div className="flex gap-2 mt-3">
        <Link
          to={`/product/${product._id}`}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          View Details
        </Link>
        <button
          onClick={() => onAddToCart(product)}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
