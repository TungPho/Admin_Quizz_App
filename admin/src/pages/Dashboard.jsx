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

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const { collapsed } = useContext(AdminContext);

  // Mock data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setTimeout(() => {
        setDashboardData({
          overview: {
            totalTests: 3,
            totalStudents: 10,
            totalTeachers: 1,
            avgScore: 6.3,
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
            { range: "0-2", percent: 5 },
            { range: "2-4", percent: 15 },
            { range: "4-6", percent: 25 },
            { range: "6-8", percent: 35 },
            { range: "8-10", percent: 20 },
          ],
          dailyActivity: [
            { day: "T2", tests: 45, students: 234 },
            { day: "T3", tests: 52, students: 267 },
            { day: "T4", tests: 48, students: 245 },
            { day: "T5", tests: 61, students: 289 },
            { day: "T6", tests: 55, students: 278 },
            { day: "T7", tests: 23, students: 156 },
            { day: "CN", tests: 12, students: 89 },
          ],
          monthlyPerformance: [
            { month: "T1", avgScore: 75.2, completionRate: 82 },
            { month: "T2", avgScore: 76.8, completionRate: 85 },
            { month: "T3", avgScore: 78.1, completionRate: 87 },
            { month: "T4", avgScore: 77.5, completionRate: 86 },
            { month: "T5", avgScore: 78.3, completionRate: 88 },
          ],
        });
        setLoading(false);
      }, 1000);
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
                    {dashboardData.overview.totalTests}
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
                    {dashboardData.overview.totalStudents}
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
                    {dashboardData.overview.totalTeachers}
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
                    {dashboardData.overview.avgScore}
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
                    data={dashboardData.subjectDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {dashboardData.subjectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
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
                <BarChart data={dashboardData.scoreDistribution}>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Daily Activity */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hoạt động hàng ngày
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tests"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Số bài thi"
                  />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Lượt thi"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Performance */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hiệu suất theo tháng
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" domain={[70, 85]} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[75, 95]}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="avgScore"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name="Điểm trung bình"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="completionRate"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    name="Tỷ lệ hoàn thành (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  3,456
                </div>
                <div className="text-sm text-gray-600">Tổng lượt thi</div>
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
                  24h
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
