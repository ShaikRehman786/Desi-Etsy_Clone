

import { useEffect, useState } from 'react';
import { getAllProducts } from '../../services/product';
import ProductCard from '../artisan/ProductCard';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [fade, setFade] = useState(true);

  const { addToCart } = useCart();


  const categories = ['Furniture', 'Home Décor', 'Lighting', 'Handmade'];

  const banners = [
    { src: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5f95c489862467.5e03d189dc6f2.png', alt: 'Handmade Sale' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2nOCvqwhf-ZGyKXP0v2R6FGstniNNUv92LQ&s', alt: 'New Arrivals' },
    { src: 'https://img.freepik.com/free-vector/vintage-craft-youtube-channel-art_23-2148888980.jpg', alt: 'Free Shipping' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res);
        setFilteredProducts(res);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    if (minPrice !== '') {
      filtered = filtered.filter(product => product.price >= Number(minPrice));
    }
    if (maxPrice !== '') {
      filtered = filtered.filter(product => product.price <= Number(maxPrice));
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategories, minPrice, maxPrice, products]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
  };

const handleAddToCart = async (product) => {
  try {
    await addToCart(product);
    toast.success(`${product.name} added to cart!`);
  } catch (error) {
    console.error("Add to Cart Error:", error.message);
    toast.error("Failed to add to cart: " + error.message);
  }
};


  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentBanner(prev => (prev + 1) % banners.length);
        setFade(true);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0; 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f7fa;
          color: #333;
        }
        .search-container {
          width: 100%;
          max-width: 800px;
          margin: 2rem auto 1rem auto;
          padding: 0 1rem;
        }
        .search-input {
          width: 100%;
          padding: 0.6rem 1rem;
          font-size: 1rem;
          border-radius: 8px;
          border: 1px solid #ccc;
          transition: border-color 0.3s ease;
          outline-offset: 3px;
          outline-color: #2563eb;
        }
        .search-input:focus {
          border-color: #2563eb;
        }
        .banner-container {
          margin-top: 1rem;
          width: 100%;
          max-width: 1200px;
          height: 320px;
          margin: 0 auto 2rem auto;
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0; left: 0;
          opacity: 1;
          transition: opacity 0.6s ease-in-out;
          border-radius: 12px;
        }
        .banner-image.fade-out {
          opacity: 0;
        }
        .container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1rem;
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }
        .sidebar {
          flex: 0 0 220px;
          background: white;
          border-radius: 8px;
          padding: 1rem 1.25rem;
          box-shadow: 0 4px 10px rgb(0 0 0 / 0.1);
          position: sticky;
          top: 1rem;
          height: fit-content;
        }
        .sidebar h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 0.25rem;
          color: #2563eb;
        }
        .category-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          cursor: pointer;
          font-size: 0.95rem;
        }
        .category-item input {
          margin-right: 0.6rem;
          width: 16px;
          height: 16px;
        }
        .price-inputs input {
          width: 100%;
          padding: 0.4rem 0.5rem;
          margin-bottom: 0.8rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 0.95rem;
          outline-offset: 2px;
          outline-color: #2563eb;
          transition: border-color 0.2s ease;
        }
        .price-inputs input:focus {
          border-color: #2563eb;
        }
        button.clear-filters {
          width: 100%;
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: background-color 0.2s ease;
          margin-top: 0.5rem;
        }
        button.clear-filters:hover {
          background-color: #dc2626;
        }
        .main-content {
          flex: 1;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.5rem;
        }
        .no-products {
          font-style: italic;
          color: #777;
          margin-top: 1rem;
          font-size: 1.1rem;
          text-align: center;
        }
      `}</style>

      {/* Search at Top */}
      <div className="search-container">
        <input
          type="text"
          aria-label="Search products"
          placeholder="Search by name..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Banner */}
      <div className="banner-container" aria-label="Promotional Banners">
        <img
          src={banners[currentBanner].src}
          alt={banners[currentBanner].alt}
          className={`banner-image ${fade ? '' : 'fade-out'}`}
        />
      </div>

      <div className="container">
        {/* Sidebar */}
        <aside className="sidebar" aria-label="Filter Products">
          <h2>Filter by Category</h2>
          {categories.map(category => (
            <label key={category} className="category-item">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              {category}
            </label>
          ))}

          <h2 style={{ marginTop: '2rem' }}>Filter by Price</h2>
          <div className="price-inputs">
            <input
              type="number"
              min="0"
              placeholder="Min Price (₹)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="Max Price (₹)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <button className="clear-filters" onClick={clearFilters}>
            Clear Filters
          </button>
        </aside>

        {/* Product Grid */}
        <main className="main-content">
          {filteredProducts.length === 0 ? (
            <p className="no-products">No products found.</p>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
