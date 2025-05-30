import React, { useState, useEffect, useContext } from "react";
import {
  Eye,
  Clock,
  FileText,
  User,
  Calendar,
  Search,
  Filter,
  Loader,
  RefreshCw,
} from "lucide-react";
import { AdminContext } from "../context/AdminContext";
import SideBar from "../components/Sidebar";

const QuizzTest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { collapsed } = useContext(AdminContext);

  // Fetch dữ liệu từ API
  const fetchAssessments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:3000/api/v1/tests");
      console.log(response);
      if (!response.ok) {
        throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      setAssessments(Array.isArray(data.metadata) ? data.metadata : []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching assessments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // Lọc và tìm kiếm
  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.teacherId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      filterSubject === "all" || assessment.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  // Định dạng ngày
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Ngày không hợp lệ";
    }
  };

  // Lấy màu cho subject
  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: "bg-blue-100 text-blue-800",
      Chemistry: "bg-green-100 text-green-800",
      Physics: "bg-purple-100 text-purple-800",
      Literature: "bg-orange-100 text-orange-800",
      Biology: "bg-teal-100 text-teal-800",
      History: "bg-red-100 text-red-800",
      English: "bg-indigo-100 text-indigo-800",
    };
    return colors[subject] || "bg-gray-100 text-gray-800";
  };

  // Lấy danh sách subjects duy nhất
  const uniqueSubjects = [
    ...new Set(assessments.map((a) => a.subject).filter(Boolean)),
  ];

  // Xử lý xem chi tiết
  const handleViewDetail = (assessmentId) => {
    console.log("Xem chi tiết bài kiểm tra:", assessmentId);
    // Có thể redirect đến trang chi tiết
    // window.location.href = `/admin/assessments/${assessmentId}`;
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out p-6 ${
        collapsed ? "ml-16" : "ml-64"
      }`}
    >
      <SideBar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quản Lý Bài Kiểm Tra
                </h1>
                <p className="text-gray-600 mt-1">
                  Danh sách tất cả các bài kiểm tra trong hệ thống
                </p>
              </div>
              <button
                onClick={fetchAssessments}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Thanh tìm kiếm và lọc */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên bài kiểm tra hoặc ID giáo viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
                >
                  <option value="all">Tất cả môn học</option>
                  {uniqueSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>Tìm thấy {filteredAssessments.length} bài kiểm tra</span>
              <span>Tổng cộng {assessments.length} bài kiểm tra</span>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <Loader className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Đang tải dữ liệu...</span>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-red-800 font-medium">
                    Không thể tải dữ liệu
                  </h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={fetchAssessments}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Danh sách bài kiểm tra */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((assessment) => (
                  <div
                    key={assessment._id || assessment.id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {assessment.title || "Không có tiêu đề"}
                        </h3>
                        {assessment.subject && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getSubjectColor(
                              assessment.subject
                            )}`}
                          >
                            {assessment.subject}
                          </span>
                        )}
                      </div>

                      {/* Thông tin chi tiết */}
                      <div className="space-y-3 mb-6">
                        {assessment.teacherId && (
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              ID: {assessment.teacherId}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="w-4 h-4 mr-2" />
                            <span>
                              {Array.isArray(assessment.questions)
                                ? assessment.questions.length
                                : assessment.questions || 0}{" "}
                              câu hỏi
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{assessment.timeLimit || 0} phút</span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            Tạo: {formatDate(assessment.createdAt)}
                          </span>
                        </div>

                        {assessment.updatedAt &&
                          assessment.updatedAt !== assessment.createdAt && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="truncate">
                                Cập nhật: {formatDate(assessment.updatedAt)}
                              </span>
                            </div>
                          )}
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t">
                        <button
                          onClick={() =>
                            handleViewDetail(assessment._id || assessment.id)
                          }
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Xem chi tiết</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không tìm thấy bài kiểm tra
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm || filterSubject !== "all"
                        ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                        : "Chưa có bài kiểm tra nào trong hệ thống"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizzTest;
