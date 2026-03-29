import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-500 mt-1">Here is your financial overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow rounded-lg border-l-4 border-red-500">
          <h2 className="text-lg font-bold mb-1 text-gray-700">Expenses</h2>
          <p className="text-gray-400 text-sm mb-4">Track and manage spending</p>
          <Link to="/expenses"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">
            View Expenses
          </Link>
        </div>

        <div className="bg-white p-6 shadow rounded-lg border-l-4 border-green-500">
          <h2 className="text-lg font-bold mb-1 text-gray-700">Income</h2>
          <p className="text-gray-400 text-sm mb-4">Track your earnings</p>
          <Link to="/income"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
            View Income
          </Link>
        </div>

        <div className="bg-white p-6 shadow rounded-lg border-l-4 border-purple-500">
          <h2 className="text-lg font-bold mb-1 text-gray-700">Budgets</h2>
          <p className="text-gray-400 text-sm mb-4">Plan your spending limits</p>
          <Link to="/budgets"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm">
            View Budgets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;