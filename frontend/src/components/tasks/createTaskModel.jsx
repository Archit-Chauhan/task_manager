import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"];

const CreateTaskModal = ({ onClose, onCreated }) => {
  const { execute } = useApi();

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("TODO");
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch users for assignment
  useEffect(() => {
    execute("/users").then(setUsers).catch(console.error);
  }, [execute]);

  const submit = async () => {
    if (!title.trim()) return alert("Title required");

    setLoading(true);
    try {
      const task = await execute("/tasks", "post", {
        title,
        status,
        assignedTo: assignedTo || undefined,
      });

      onCreated(task);
      onClose();
    } catch (err) {
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">
          Create New Task
        </h2>

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full border p-3 rounded mb-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          className="w-full border p-3 rounded mb-4"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign to (optional)</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
