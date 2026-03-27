import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
      <p className="text-gray-500 mb-6">Manage your finances below</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-bold mb-2 text-blue-600">Expenses</h2>
          <p className="text-gray-500 mb-4">Track your spending</p>
          <Link to="/expenses" className="bg-blue-600 text-white px-4 py-2 rounded">
            View Expenses
          </Link>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-bold mb-2 text-green-600">Income</h2>
          <p className="text-gray-500 mb-4">Track your earnings</p>
          <Link to="/income" className="bg-green-600 text-white px-4 py-2 rounded">
            View Income
          </Link>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-bold mb-2 text-purple-600">Budgets</h2>
          <p className="text-gray-500 mb-4">Plan your spending limits</p>
          <Link to="/budgets" className="bg-purple-600 text-white px-4 py-2 rounded">
            View Budgets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;