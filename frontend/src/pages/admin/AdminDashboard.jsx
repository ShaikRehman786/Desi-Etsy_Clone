import { useEffect, useState } from 'react';
import API from '../../utils/api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get('/admin/users').then((res) => setUsers(res.data)).catch(console.error);
  }, []);

  const approveUser = async (id) => {
    await API.put(`/admin/approve/${id}`);
    alert('User Approved');
    setUsers(users.map(u => u._id === id ? { ...u, approved: true } : u));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul className="list-group">
        {users.map((user) => (
          <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
            {user.name} ({user.email}) - {user.approved ? '✅ Approved' : '❌ Not Approved'}
            {!user.approved && (
              <button className="btn btn-success btn-sm" onClick={() => approveUser(user._id)}>Approve</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
