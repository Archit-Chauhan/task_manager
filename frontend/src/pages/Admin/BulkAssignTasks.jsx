import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const BulkAssignTasks = () => {
  const { execute } = useApi();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch tasks
  useEffect(() => {
    execute("/tasks").then(setTasks);
    execute("/users").then(setUsers);
  }, [execute]);

  const toggleTask = (taskId) => {
    setSelected((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const assign = async () => {
    if (!userId) {
      alert("Please select a user");
      return;
    }

    if (selected.length === 0) {
      alert("Please select at least one task");
      return;
    }

    try {
      setLoading(true);

      await execute("/admin/bulk-assign", "post", {
        taskIds: selected,
        userId
      });

      alert("Tasks assigned successfully");
      setSelected([]);
    } catch (err) {
      alert("Bulk assign failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bulk Assign Tasks</h1>

      {/* User Select */}
      <select
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border p-2 rounded w-64"
      >
        <option value="">Select User</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name} ({u.role})
          </option>
        ))}
      </select>

      {/* Task List */}
      <div className="bg-white p-4 rounded-lg shadow space-y-2">
        {tasks.map((t) => (
          <label key={t._id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selected.includes(t._id)}
              onChange={() => toggleTask(t._id)}
            />
            <span>{t.title}</span>
          </label>
        ))}
      </div>

      {/* Assign Button */}
      <button
        onClick={assign}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Assigning..." : "Assign Selected Tasks"}
      </button>
    </div>
  );
};

export default BulkAssignTasks;
