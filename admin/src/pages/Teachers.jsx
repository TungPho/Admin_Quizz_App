import { useState, useEffect, useContext } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Download,
} from "lucide-react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import SideBar from "../components/Sidebar";

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state loading
  const [error, setError] = useState(null); // Thêm state error
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(4);
  const { collapsed } = useContext(AdminContext);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true); // Bắt đầu loading
        const teachersData = await axios.get(
          "https://backend-quizz-deploy.onrender.com/api/v1/teachers",
          {
            headers: {
              email: "admin@gmail.com",
            },
          }
        );
        console.log(teachersData.data);
        setTeachers(teachersData.data.metadata);
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setError("Không thể tải dữ liệu giáo viên");
      } finally {
        setLoading(false); // Kết thúc loading bất kể thành công hay thất bại
      }
    };
    fetchTeachers();
  }, []);

  // Filter teachers based on search term and selected school
  const filteredTeachers = teachers.filter((teacher) => {
    const nameMatch =
      teacher.user_attributes?.name
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) || false;
    const emailMatch =
      teacher.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false;
    const idMatch =
      teacher.user_attributes?.student_id?.includes(searchTerm) || false;
    const schoolMatch =
      selectedSchool === "" ||
      teacher.user_attributes?.school_name === selectedSchool;

    return (nameMatch || emailMatch || idMatch) && schoolMatch;
  });

  // Get unique schools for the filter dropdown
  const uniqueSchools = [
    ...new Set(
      teachers
        .map((teacher) => teacher.user_attributes?.school_name)
        .filter(Boolean)
    ),
  ];

  // Pagination
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  // Handle teacher deletion
  const handleDeleteTeacher = () => {
    if (teacherToDelete) {
      setTeachers(teachers.filter((teacher) => teacher.id !== teacherToDelete));
      setIsDeleteModalOpen(false);
      setTeacherToDelete(null);
    }
  };

  // Format date to display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out p-6 ${
        collapsed ? "ml-16" : "ml-64"
      }`}
    >
      <SideBar />
      <div className="w-full h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex flex-col">
          <div className="bg-white shadow-sm border-b p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Teachers Management
              </h1>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                <Plus size={18} className="mr-1" />
                Thêm giáo viên
              </button>
            </div>
          </div>

          <div className="p-4 border-b bg-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-1/2 lg:w-1/3">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, mã giáo viên..."
                  className="pl-10 p-2 border border-gray-300 rounded-md w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-48">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Filter size={18} className="text-gray-400" />
                  </div>
                  <select
                    className="pl-10 p-2 border border-gray-300 rounded-md w-full"
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                  >
                    <option value="">Tất cả trường</option>
                    {uniqueSchools.map((school, index) => (
                      <option key={index} value={school}>
                        {school}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md flex items-center">
                  <Download size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto bg-white">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-red-500">{error}</div>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      id
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      University
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Created Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentTeachers.length > 0 ? (
                    currentTeachers.map((teacher, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-4 px-4 text-gray-800">
                          {teacher.user_attributes?.name || "-"}
                        </td>
                        <td className="py-4 px-4 text-gray-800">
                          {teacher.email || "-"}
                        </td>
                        <td className="py-4 px-4 text-gray-800">
                          {teacher._id || "-"}
                        </td>
                        <td className="py-4 px-4 text-gray-800">
                          {teacher.user_attributes?.school_name || "-"}
                        </td>
                        <td className="py-4 px-4 text-gray-800">
                          {formatDate(teacher.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-gray-500"
                      >
                        Không tìm thấy giáo viên nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && filteredTeachers.length > 0 && (
            <div className="flex justify-between items-center p-4 bg-white border-t">
              <div className="text-sm text-gray-600">
                Hiển thị {indexOfFirstTeacher + 1} -{" "}
                {Math.min(indexOfLastTeacher, filteredTeachers.length)} trong{" "}
                {filteredTeachers.length} giáo viên
              </div>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &laquo; Trước
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau &raquo;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
              <p className="mb-6">
                Bạn có chắc chắn muốn xóa giáo viên này không? Hành động này
                không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={handleDeleteTeacher}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
