import { useEffect, useState } from 'react';
import API from '../utils/api';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Fetch user info
  useEffect(() => {
    API.get('/user/profile')
      .then(res => {
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch user orders
  useEffect(() => {
    API.get('/orders/myorders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  // If artisan, fetch their products
  useEffect(() => {
    if (user?.role === 'artisan') {
      API.get('/products/myproducts')
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put('/user/profile', { name, email });
      alert('Profile updated!');
      setUser({ ...user, name, email });
      setEditing(false);
    } catch (err) {
      alert('Update failed.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      alert('Product deleted');
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>

      {user && (
        <section className="mb-4">
          <h4>Profile Info</h4>
          {!editing ? (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>Edit Profile</button>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate}>
              <input
                type="text"
                className="form-control my-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                className="form-control my-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="btn btn-primary btn-sm me-2" type="submit">Save</button>
              <button className="btn btn-danger btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            </form>
          )}
        </section>
      )}

      <section className="mb-4">
        <h4>My Orders</h4>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul className="list-group">
            {orders.map(order => (
              <li key={order._id} className="list-group-item">
                <strong>Order ID:</strong> {order._id} <br />
                <strong>Status:</strong> {order.status} <br />
                <strong>Total:</strong> ${order.total} <br />
                <strong>Placed on:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Show products management only if artisan */}
      {user?.role === 'artisan' && (
        <section>
          <h4>My Products</h4>
          {products.length === 0 ? (
            <p>No products found. <a href="/artisan">Add some here</a>.</p>
          ) : (
            <ul className="list-group">
              {products.map(product => (
                <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{product.name}</strong> - ${product.price} <br />
                    {product.description}
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

export default UserDashboard;
