import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const UserManagement = () => {
  const { execute } = useApi();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    execute("/users").then(setUsers);
  }, [execute]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 space-x-2">
                  <button className="text-indigo-600">Edit</button>
                  <button className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
