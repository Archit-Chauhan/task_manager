import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import ChartCard from "../../components/admin/ChartCard";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { execute } = useApi();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await execute("/admin/analytics", "get");
        setAnalytics(data);
      } catch (err) {
        setError("Failed to load admin analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [execute]);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  const chartData = [
  { name: "Users", value: analytics.users },
  { name: "Shifts", value: analytics.totalShifts },
  { name: "Tasks", value: analytics.openTasks },
  { name: "Swaps", value: analytics.pendingSwaps }
];


  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.name}. System-wide overview & controls.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={analytics.users} icon="👥" />
        <StatCard title="Total Shifts" value={analytics.totalShifts} icon="🗓️" />
        <StatCard title="Open Tasks" value={analytics.openTasks} icon="📋" />
        <StatCard title="Pending Swaps" value={analytics.pendingSwaps} icon="🔄" />
      </div>

      {/* Analytics Chart */}
      <ChartCard data={chartData} />


      {/* Actions */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Bulk Actions
        </h2>

        <button className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
          Bulk Assign Tasks
        </button>
      </div>

    </div>
  );
};

/* ---------- Reusable Stat Card ---------- */

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);
