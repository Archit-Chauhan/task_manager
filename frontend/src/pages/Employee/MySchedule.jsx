// // src/pages/Employee/MySchedule.jsx

// import React , {useEffect,useState} from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useApi } from '../../hooks/useApi';
// /**
//  * The employee-centric view focusing on their personal shift assignments and tasks.
//  * This is where they initiate shift swap requests.
//  */
// export const MySchedule = () => {
//     const { user, role } = useAuth();

//     return (
//         <div className="p-4 space-y-6">
//             <h1 className="text-4xl font-extrabold text-blue-700 border-b pb-3">
//                 My Work Schedule & Activity
//             </h1>
            
//             <p className="text-lg text-gray-600">
//                 Hello, {user?.name}. Your current role is <span className="font-semibold uppercase">{role}</span>.
//                 Below is a summary of your week.
//             </p>

//             {/* Section for Assigned Shifts */}
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//                 <h2 className="text-2xl font-semibold text-blue-600 mb-4">Assigned Shifts This Week</h2>
//                 <div className="border border-dashed border-gray-300 p-8 text-center text-gray-500">
//                     <p>[Placeholder: List of shifts for the logged-in employee]</p>
//                 </div>
//             </div>

//             {/* Section for Swap Requests */}
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//                 <h2 className="text-2xl font-semibold text-blue-600 mb-4">My Shift Swap Requests</h2>
//                 <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
//                     + Request New Swap
//                 </button>
//                 <div className="mt-4 border border-dashed border-gray-300 p-4 text-center text-gray-500">
//                     <p>[Placeholder: List of PENDING, APPROVED, and REJECTED swaps]</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// src/pages/Employee/MySchedule.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";

export const MySchedule = () => {
  const { user, role } = useAuth();
  const { execute } = useApi();

  const [shifts, setShifts] = useState([]);
  const [myShiftId, setMyShiftId] = useState("");
  const [targetShiftId, setTargetShiftId] = useState("");
  const [showSwapModal, setShowSwapModal] = useState(false);

  /* ---------------- FETCH SHIFTS ---------------- */
  useEffect(() => {
    execute("/shifts")
      .then(setShifts)
      .catch(() => alert("Failed to load shifts"));
  }, [execute]);

  const myShifts = shifts.filter(
    (s) => s.assignedTo?._id === user?.id
  );

  const otherShifts = shifts.filter(
    (s) => 
        s.assignedTo &&
        s.assignedTo?._id !== user?.id &&
        s.status==="PUBLISHED"
  );

  /* ---------------- SUBMIT SWAP ---------------- */
  const submitSwap = async () => {
    if (!myShiftId || !targetShiftId) {
      alert("Please select both shifts");
      return;
    }

    const targetShift = shifts.find((s) => s._id === targetShiftId);

    try {
      await execute("/swaps", "post", {
        requesterShiftId: myShiftId,
        targetOwnerId: targetShift.assignedTo._id,
        targetShiftId: targetShiftId
      });

      alert("Swap request submitted successfully");
      setShowSwapModal(false);
      setMyShiftId("");
      setTargetShiftId("");
    } catch (err) {
      alert("Failed to submit swap request");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-4xl font-extrabold text-blue-700 border-b pb-3">
        My Work Schedule & Activity
      </h1>

      <p className="text-lg text-gray-600">
        Hello, {user?.name}. Your current role is{" "}
        <span className="font-semibold uppercase">{role}</span>.
      </p>

      {/* ---------------- MY SHIFTS ---------------- */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Assigned Shifts This Week
        </h2>

        {myShifts.length === 0 ? (
          <p className="text-gray-500">No shifts assigned yet.</p>
        ) : (
          myShifts.map((shift) => (
            <div
              key={shift._id}
              className="border rounded p-4 mb-3"
            >
              <p className="font-semibold">{shift.title}</p>
              <p className="text-sm text-gray-600">
                {new Date(shift.startTime).toLocaleString()} –{" "}
                {new Date(shift.endTime).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                Location: {shift.location}
              </p>
            </div>
          ))
        )}

        <button
          onClick={() => setShowSwapModal(true)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          + Request New Swap
        </button>
      </div>

      {/* ---------------- SWAP MODAL ---------------- */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">
            <h3 className="text-xl font-semibold">
              Request Shift Swap
            </h3>

            {/* My Shift */}
            <select
              value={myShiftId}
              onChange={(e) => setMyShiftId(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select your shift</option>
              {myShifts.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title}
                </option>
              ))}
            </select>

            {/* Target Shift */}
            <select
              value={targetShiftId}
              onChange={(e) => setTargetShiftId(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select target shift</option>
              {otherShifts.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title} – {s.assignedTo?.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSwapModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitSwap}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
