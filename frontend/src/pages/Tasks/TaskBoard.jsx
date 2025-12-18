import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import CreateTaskModal from "../../components/tasks/createTaskModel";
import EditTaskModal from "../../components/tasks/editTask";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"];

export const TaskBoard = () => {
  const { role } = useAuth();
  const { execute } = useApi();

  const [tasks, setTasks] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);

  //refs for drop detection
  const columnRefs = useRef({});

  useEffect(() => {
    const endpoint = role === "EMPLOYEE" ? "/tasks/my" : "/tasks";

    execute(endpoint)
      .then(setTasks)
      .catch((err) => {
        console.error(err);
        alert("Failed to load tasks");
      });
  }, [execute, role]);

  /* GROUP TASKS BY STATUS */
  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = tasks.filter((t) => t.status === s);
    return acc;
  }, {});
  const handleDragEnd = async (event, task) => {
    const { point } = event;

    for (const status of STATUSES) {
      const rect = columnRefs.current[status]?.getBoundingClientRect();
      if (!rect) continue;

      const droppedInside =
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom;

      if (droppedInside && task.status !== status) {
        try {
          const updated = await execute(
            `/tasks/${task._id}`,
            "put",
            { status }
          );

          setTasks((prev) =>
            prev.map((t) =>
              t._id === updated._id ? updated : t
            )
          );
        } catch (err) {
          console.error(err);
          alert("Failed to update task status");
        }
        break;
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold text-purple-700">
        Task Management System
      </h1>

      {/* BOARD */}
      <div className="flex gap-4 overflow-x-auto">
        {STATUSES.map((status) => (
          <motion.div
            key={status}
            ref={(el) => (columnRefs.current[status] = el)}
            className="w-80 bg-gray-100 rounded p-3 min-h-[300px]"
          >
            <h2 className="font-bold text-center mb-3">
              {status}
            </h2>

            {byStatus[status].map((task) => (
              <motion.div
                key={task._id}
                drag={role === "EMPLOYEE"}
                dragMomentum={false}
                whileDrag={{ scale: 1.05, zIndex: 50 }}
                onDragEnd={(e) => handleDragEnd(e, task)}
                onClick={() =>
                  role !== "EMPLOYEE" && setEditTask(task)
                }
                className="bg-white p-4 mb-3 rounded shadow cursor-pointer"
              >
                <h3 className="font-semibold">{task.title}</h3>

                {task.assignedTo && (
                  <p className="text-sm text-gray-500">
                    Assigned to: {task.assignedTo.name}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* MANAGER / ADMIN CREATE BUTTON */}
      {(role === "ADMIN" || role === "MANAGER") && (
        <button
          onClick={() => setShowCreate(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          + Create New Task
        </button>
      )}

      {/* CREATE MODAL */}
      {showCreate && (
        <CreateTaskModal
          onClose={() => setShowCreate(false)}
          onCreated={(task) =>
            setTasks((prev) => [...prev, task])
          }
        />
      )}

      {/* EDIT MODAL */}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onUpdated={(updated) =>
            setTasks((prev) =>
              prev.map((t) =>
                t._id === updated._id ? updated : t
              )
            )
          }
          onDeleted={(id) =>
            setTasks((prev) =>
              prev.filter((t) => t._id !== id)
            )
          }
        />
      )}
    </div>
  );
};
