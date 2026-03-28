import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Budgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({ category: '', limitAmount: '', timePeriod: '', startDate: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchBudgets(); }, []);

  const fetchBudgets = async () => {
    try {
      const res = await axiosInstance.get('/api/budgets', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBudgets(res.data);
    } catch (error) {
      alert('Failed to fetch budgets');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axiosInstance.put(`/api/budgets/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBudgets(budgets.map(b => b._id === editingId ? res.data : b));
        setEditingId(null);
      } else {
        const res = await axiosInstance.post('/api/budgets', formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBudgets([...budgets, res.data]);
      }
      setFormData({ category: '', limitAmount: '', timePeriod: '', startDate: '' });
    } catch (error) {
      alert('Failed to save budget');
    }
  };

  const handleEdit = (budget) => {
    setEditingId(budget._id);
    setFormData({
      category: budget.category,
      limitAmount: budget.limitAmount,
      timePeriod: budget.timePeriod,
      startDate: budget.startDate.substring(0, 10)
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await axiosInstance.delete(`/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBudgets(budgets.filter(b => b._id !== id));
    } catch (error) {
      alert('Failed to delete budget');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Budget Management</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded mb-6">
        <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit Budget' : 'Create Budget'}</h2>
        <input type="text" placeholder="Category (e.g. Food, Transport)"
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          className="w-full mb-3 p-2 border rounded" required />
        <input type="number" placeholder="Spending Limit ($)"
          value={formData.limitAmount}
          onChange={e => setFormData({ ...formData, limitAmount: e.target.value })}
          className="w-full mb-3 p-2 border rounded" required />
        <select value={formData.timePeriod}
          onChange={e => setFormData({ ...formData, timePeriod: e.target.value })}
          className="w-full mb-3 p-2 border rounded" required>
          <option value="">Select Time Period</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Custom">Custom</option>
        </select>
        <input type="date" value={formData.startDate}
          onChange={e => setFormData({ ...formData, startDate: e.target.value })}
          className="w-full mb-3 p-2 border rounded" required />
        <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded">
          {editingId ? 'Update Budget' : 'Create Budget'}
        </button>
        {editingId && (
          <button type="button"
            onClick={() => { setEditingId(null); setFormData({ category: '', limitAmount: '', timePeriod: '', startDate: '' }); }}
            className="w-full mt-2 bg-gray-400 text-white p-2 rounded">
            Cancel
          </button>
        )}
      </form>

      <div>
        {budgets.length === 0 && <p className="text-gray-500">No budgets yet.</p>}
        {budgets.map(budget => (
          <div key={budget._id} className="bg-white p-4 shadow rounded mb-3">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-bold">{budget.category} — ${budget.limitAmount} limit</p>
                <p className="text-sm text-gray-500">
                  {budget.timePeriod} · Started {new Date(budget.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm">Spent: ${budget.spentAmount} / ${budget.limitAmount}</p>
              </div>
              <div>
                <button onClick={() => handleEdit(budget)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(budget._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Budgets;