import React, { useState, useEffect, useContext } from "react";
import {
  Users,
  FileText,
  GraduationCap,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { AdminContext } from "../context/AdminContext";
import SideBar from "../components/Sidebar";
import axios from "axios";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const { collapsed } = useContext(AdminContext);
  const [submissions, setSubmissions] = useState([]);
  const [tests, setTests] = useState([]);

  const calAverageScore = (submissions) => {
    // Kiểm tra nếu mảng rỗng hoặc undefined
    if (!submissions || submissions.length === 0) {
      return 0;
    }

    let totalScore = 0;
    for (let submit of submissions) {
      totalScore += submit.score;
    }
    console.log(totalScore);
    return (totalScore / submissions.length).toFixed(2); // Làm tròn 2 chữ số thập phân
  };

  const getPointsPercentage = (minScore, maxScore, submissionsData) => {
    // Sử dụng parameter submissionsData thay vì state submissions
    if (!submissionsData || submissionsData.length === 0) {
      return "0.00";
    }

    console.log(submissionsData);
    const totalSubmissions = submissionsData.length;

    const submissionsInRange = submissionsData.filter(
      (submit) => submit.score >= minScore && submit.score <= maxScore
    );

    const percentage = (submissionsInRange.length / totalSubmissions) * 100;
    console.log(percentage);
    return percentage.toFixed(2);
  };

  const getAverageTimeOfAllTests = (testsData) => {
    // Kiểm tra nếu mảng rỗng hoặc undefined
    if (!testsData || testsData.length === 0) {
      return "0 phút";
    }

    let totalTime = 0;
    for (let test of testsData) {
      // Sử dụng timeLimit thay vì duration
      totalTime += test.timeLimit || 0;
    }

    const averageTime = totalTime / testsData.length;

    // Chuyển đổi sang định dạng phù hợp
    if (averageTime >= 60) {
      const hours = Math.floor(averageTime / 60);
      const minutes = Math.round(averageTime % 60);
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} phút`;
    } else {
      return `${Math.round(averageTime)} phút`;
    }
  };

  // Mock data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const studentsData = await axios.get(
          "https://backend-quizz-deploy.onrender.com/api/v1/students",
          {
            headers: {
              email: "admin@gmail.com",
            },
          }
        );
        const teachersData = await axios.get(
          "https://backend-quizz-deploy.onrender.com/api/v1/teachers",
          {
            headers: {
              email: "admin@gmail.com",
            },
          }
        );

        const totalExamData = await axios.get(
          " https://backend-quizz-deploy.onrender.com/api/v1/tests",
          {
            headers: {
              email: "admin@gmail.com",
            },
          }
        );
        const totalSubmissionData = await axios.get(
          " https://backend-quizz-deploy.onrender.com/api/v1/submissions",
          {
            headers: {
              email: "admin@gmail.com",
            },
          }
        );

        // Lấy dữ liệu submissions từ response
        const submissionsData = totalSubmissionData.data.metadata || [];
        const testsData = totalExamData.data.metadata || [];

        // Set state
        setSubmissions(submissionsData);
        setTests(testsData);

        console.log(totalSubmissionData);

        // Tính điểm trung bình với dữ liệu vừa lấy được
        const averageScore = calAverageScore(submissionsData);
        // Tính thời gian trung bình các bài test
        const averageTestTime = getAverageTimeOfAllTests(testsData);

        setTimeout(() => {
          setDashboardData({
            overview: {
              totalTests: testsData.length,
              totalStudents: studentsData.data.metadata?.length || 0,
              totalTeachers: teachersData.data.metadata?.length || 0,
              avgScore: averageScore,
              avgTestTime: averageTestTime,
            },
            subjectDistribution: [
              { name: "Toán học", value: 45, color: "#3B82F6" },
              { name: "Hóa học", value: 32, color: "#10B981" },
              { name: "Vật lý", value: 28, color: "#8B5CF6" },
              { name: "Sinh học", value: 25, color: "#F59E0B" },
              { name: "Văn học", value: 18, color: "#EF4444" },
              { name: "Tiếng Anh", value: 8, color: "#6B7280" },
            ],
            scoreDistribution: [
              {
                range: "0-2",
                percent: getPointsPercentage(0, 2, submissionsData),
              },
              {
                range: "2-4",
                percent: getPointsPercentage(2, 4, submissionsData),
              },
              {
                range: "4-6",
                percent: getPointsPercentage(4, 6, submissionsData),
              },
              {
                range: "6-8",
                percent: getPointsPercentage(6, 8, submissionsData),
              },
              {
                range: "8-10",
                percent: getPointsPercentage(8, 10, submissionsData),
              },
            ],
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
        // Set default data in case of error
        setDashboardData({
          overview: {
            totalTests: 0,
            totalStudents: 0,
            totalTeachers: 0,
            avgScore: 0,
            avgTestTime: "0 phút",
          },
          subjectDistribution: [],
          scoreDistribution: [],
        });
      }
    };

    fetchDashboardData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

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
                  Dashboard Thống Kê
                </h1>
                <p className="text-gray-600 mt-1">
                  Tổng quan hoạt động ứng dụng thi trắc nghiệm
                </p>
              </div>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="3months">3 tháng qua</option>
                <option value="1year">1 năm qua</option>
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Tổng bài thi
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.overview?.totalTests || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GraduationCap className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Tổng học sinh
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.overview?.totalStudents || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Tổng giáo viên
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.overview?.totalTeachers || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Điểm TB</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.overview?.avgScore || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Subject Distribution */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Phân bố bài thi theo môn học
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData?.subjectDistribution || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {(dashboardData?.subjectDistribution || []).map(
                      (entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Score Distribution */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Phân bố điểm số
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData?.scoreDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Số học sinh"]}
                  />
                  <Bar dataKey="percent" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {submissions.length}
                </div>
                <div className="text-sm text-gray-600">
                  Tổng lượt nộp bài thi
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  87.5%
                </div>
                <div className="text-sm text-gray-600">
                  Tỷ lệ hoàn thành trung bình
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {dashboardData?.overview?.avgTestTime || "0 phút"}
                </div>
                <div className="text-sm text-gray-600">
                  Thời gian trung bình/bài thi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
