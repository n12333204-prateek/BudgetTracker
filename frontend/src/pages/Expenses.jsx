import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ amount: '', category: '', date: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axiosInstance.get('/api/expenses', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setExpenses(res.data);
    } catch (error) {
      alert('Failed to fetch expenses');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axiosInstance.put(`/api/expenses/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setExpenses(expenses.map(ex => ex._id === editingId ? res.data : ex));
        setEditingId(null);
      } else {
        const res = await axiosInstance.post('/api/expenses', formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setExpenses([...expenses, res.data]);
      }
      setFormData({ amount: '', category: '', date: '', description: '' });
    } catch (error) {
      alert('Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setFormData({
      amount: expense.amount,
      category: expense.category,
      date: expense.date.substring(0, 10),
      description: expense.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await axiosInstance.delete(`/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setExpenses(expenses.filter(ex => ex._id !== id));
    } catch (error) {
      alert('Failed to delete expense');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Expense Management</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded mb-6">
        <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit Expense' : 'Add Expense'}</h2>
        <input type="number" placeholder="Amount" value={formData.amount}
          onChange={e => setFormData({ ...formData, amount: e.target.value })}
          className="w-full mb-3 p-2 border rounded" required />
        <input type="text" placeholder="Category (e.g. Food, Transport)"
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          className="w-full mb-3 p-2 border rounded" required />
        <input type="date" value={formData.date}
          onChange={e => setFormData({ ...formData, date: e.target.value })}
          className="w-full mb-3 p-2 border rounded" required />
        <input type="text" placeholder="Description (optional)"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full mb-3 p-2 border rounded" />
        <button type="submit" className="w-full bg-red-600 text-white p-2 rounded">
          {editingId ? 'Update Expense' : 'Add Expense'}
        </button>
        {editingId && (
          <button type="button"
            onClick={() => { setEditingId(null); setFormData({ amount: '', category: '', date: '', description: '' }); }}
            className="w-full mt-2 bg-gray-400 text-white p-2 rounded">
            Cancel
          </button>
        )}
      </form>

      <div>
        {expenses.length === 0 && <p className="text-gray-500">No expenses yet.</p>}
        {expenses.map(expense => (
          <div key={expense._id} className="bg-white p-4 shadow rounded mb-3 flex justify-between items-center">
            <div>
              <p className="font-bold">{expense.category} - <span className="text-red-600">${expense.amount}</span></p>
              <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
              {expense.description && <p className="text-sm">{expense.description}</p>}
            </div>
            <div>
              <button onClick={() => handleEdit(expense)}
                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(expense._id)}
                className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expenses;