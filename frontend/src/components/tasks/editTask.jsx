import React, { useState } from "react";
import { useApi } from "../../hooks/useApi";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"];

const EditTaskModal = ({ task, onClose, onUpdated, onDeleted }) => {
  const { execute } = useApi();

  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);

  const update = async () => {
    const updated = await execute(`/tasks/${task._id}`, "put", {
      title,
      status,
    });
    onUpdated(updated);
    onClose();
  };

  const remove = async () => {
    if (!confirm("Delete this task?")) return;
    await execute(`/tasks/${task._id}`, "delete");
    onDeleted(task._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>

        <input
          className="w-full border p-3 rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full border p-3 rounded mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <div className="flex justify-between">
          <button onClick={remove} className="text-red-600">
            Delete
          </button>

          <div className="flex gap-3">
            <button onClick={onClose}>Cancel</button>
            <button
              onClick={update}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
