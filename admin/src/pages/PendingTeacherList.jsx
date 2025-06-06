import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import SideBar from "../components/Sidebar";
import axios from "axios";
const PendingTeacherList = () => {
  const { collapsed } = useContext(AdminContext);
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://backend-quizz-deploy.onrender.com/api/v1/teachers_request",
          {
            headers: {
              email: "admin@gmail.com",
            },
          }
        );
        setTeacherRequests(response.data.metadata);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch teacher requests");
        setLoading(false);
      }
    };

    fetchTeacherRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const req = await axios.post(
        `https://backend-quizz-deploy.onrender.com/api/v1/teachers_request/${id}`,
        {},
        {
          headers: {
            email: "admin@gmail.com",
          },
        }
      );
      console.log(req);
      // Update the list after approval
      setTeacherRequests(
        teacherRequests.filter((teacher) => teacher._id !== id)
      );
    } catch (err) {
      setError("Failed to approve teacher");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(
        `https://backend-quizz-deploy.onrender.com/api/v1/reject_teacher/${id}`,
        {},
        {
          headers: {
            email: "admin@gmail.com",
          },
        }
      );
      // Update the list after rejection
      setTeacherRequests(
        teacherRequests.filter((teacher) => teacher._id !== id)
      );
    } catch (err) {
      setError("Failed to reject teacher");
    }
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        collapsed ? "ml-16" : "ml-64"
      }`}
    >
      <SideBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Pending Teacher Requests</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : teacherRequests.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded text-center">
            No pending teacher requests
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">School</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Created At</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teacherRequests.map((teacher) => (
                  <tr
                    key={teacher._id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      {teacher.user_attributes.name}
                    </td>
                    <td className="py-4 px-4">{teacher.email}</td>
                    <td className="py-4 px-4">
                      {teacher.user_attributes.school_name}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {teacher.user_attributes.is_active
                          ? "Active"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {new Date(teacher.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 space-x-2">
                      <button
                        onClick={() => handleApprove(teacher._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(teacher._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingTeacherList;
