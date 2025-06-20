import { useEffect, useState } from 'react';
import API from '../utils/api';

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/orders').then((res) => setOrders(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2>All Orders</h2>
      <ul className="list-group">
        {orders.map((order) => (
          <li className="list-group-item" key={order._id}>
            Order #{order._id} - {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderList;
