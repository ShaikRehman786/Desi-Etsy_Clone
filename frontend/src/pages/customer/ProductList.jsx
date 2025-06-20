// src/components/customer/ProductList.jsx
import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/product";
import ProductCard from "../artisan/ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [cart, setCart] = useState([]);

  const fetchProducts = async () => {
    const data = await getAllProducts();
    console.log("Fetched products:", data);
    setProducts(data);
    setFiltered(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filteredList = products;

    if (search.trim()) {
      filteredList = filteredList.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredList = filteredList.filter((p) => p.category === category);
    }

    setFiltered(filteredList);
  }, [search, category, products]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    console.log("Added to cart:", product);
  };

  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((prod) => (
            <ProductCard
              key={prod._id}
              product={prod}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
