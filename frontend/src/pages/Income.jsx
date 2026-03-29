import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Income = () => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [formData, setFormData] = useState({ amount: '', source: '', date: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchIncome(); }, []);

  const fetchIncome = async () => {
    try {
      const res = await axiosInstance.get('/api/income', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setIncomes(res.data);
    } catch (error) {
      alert('Failed to fetch income');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axiosInstance.put(`/api/income/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setIncomes(incomes.map(inc => inc._id === editingId ? res.data : inc));
        setEditingId(null);
      } else {
        const res = await axiosInstance.post('/api/income', formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setIncomes([...incomes, res.data]);
      }
      setFormData({ amount: '', source: '', date: '', description: '' });
    } catch (error) {
      alert('Failed to save income');
    }
  };

  const handleEdit = (income) => {
    setEditingId(income._id);
    setFormData({
      amount: income.amount,
      source: income.source,
      date: income.date.substring(0, 10),
      description: income.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income record?')) return;
    try {
      await axiosInstance.delete(`/api/income/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setIncomes(incomes.filter(inc => inc._id !== id));
    } catch (error) {
      alert('Failed to delete income');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Income Management</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded mb-6">
        <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit Income' : 'Add Income'}</h2>
        <input type="number" placeholder="Amount" value={formData.amount}
          onChange={e => setFormData({ ...formData, amount: e.target.value })}
          className="w-full mb-3 p-2 border rounded" required />
        <input type="text" placeholder="Source (e.g. Salary, Freelance)"
          value={formData.source}
          onChange={e => setFormData({ ...formData, source: e.target.value })}
          className="w-full mb-3 p-2 border rounded" required />
        <input type="date" value={formData.date}
          onChange={e => setFormData({ ...formData, date: e.target.value })}
          className="w-full mb-3 p-2 border rounded" required />
        <input type="text" placeholder="Description (optional)"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full mb-3 p-2 border rounded" />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          {editingId ? 'Update Income' : 'Add Income'}
        </button>
        {editingId && (
          <button type="button"
            onClick={() => { setEditingId(null); setFormData({ amount: '', source: '', date: '', description: '' }); }}
            className="w-full mt-2 bg-gray-400 text-white p-2 rounded">
            Cancel
          </button>
        )}
      </form>

      <div>
        {incomes.length === 0 && <p className="text-gray-500">No income records yet.</p>}
        {incomes.map(income => (
          <div key={income._id} className="bg-white p-4 shadow rounded mb-3 flex justify-between items-center">
            <div>
              <p className="font-bold">{income.source} - ${income.amount}</p>
              <p className="text-sm text-gray-500">{new Date(income.date).toLocaleDateString()}</p>
              {income.description && <p className="text-sm">{income.description}</p>}
            </div>
            <div>
              <button onClick={() => handleEdit(income)}
                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(income._id)}
                className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Income;