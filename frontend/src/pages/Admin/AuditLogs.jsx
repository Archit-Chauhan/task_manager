import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const AuditLogs = () => {
  const { execute } = useApi();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    execute("/admin/activity-logs")
      .then(setLogs)
      .catch(() => alert("Failed to load audit logs"))
      .finally(() => setLoading(false));
  }, [execute]);

  if (loading) return <p className="p-6">Loading audit logs...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        Audit Logs
      </h1>

      {logs.length === 0 ? (
        <p>No activity recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white p-4 rounded shadow border-l-4 border-purple-600"
            >
              <p className="font-semibold">{log.type}</p>
              <p className="text-gray-700">{log.message}</p>
              <p className="text-sm text-gray-500">
                {log.actorRole} •{" "}
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
