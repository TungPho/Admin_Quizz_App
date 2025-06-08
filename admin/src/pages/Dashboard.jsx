import React, { useState, useEffect, useContext } from "react";
import {
  Users,
  FileText,
  GraduationCap,
  TrendingUp,
  BarChart3,
  Download,
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
import * as XLSX from "xlsx";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const { collapsed } = useContext(AdminContext);
  const [submissions, setSubmissions] = useState([]);
  const [tests, setTests] = useState([]);

  const calculateAverageScore = (submissions) => {
    // Check if array is empty or undefined
    if (!submissions || submissions.length === 0) {
      return 0;
    }

    let totalScore = 0;
    for (let submit of submissions) {
      totalScore += submit.score;
    }
    console.log(totalScore);
    return (totalScore / submissions.length).toFixed(2); // Round to 2 decimal places
  };

  const getPointsPercentage = (minScore, maxScore, submissionsData) => {
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
    // Check if array is empty or undefined
    if (!testsData || testsData.length === 0) {
      return "0 minutes";
    }

    let totalTime = 0;
    for (let test of testsData) {
      // Use timeLimit instead of duration
      totalTime += test.timeLimit || 0;
    }

    const averageTime = totalTime / testsData.length;

    // Convert to appropriate format
    if (averageTime >= 60) {
      const hours = Math.floor(averageTime / 60);
      const minutes = Math.round(averageTime % 60);
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;
    } else {
      return `${Math.round(averageTime)} minutes`;
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    if (!dashboardData) return;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Overview data
    const overviewData = [
      ["Metric", "Value"],
      ["Total Tests", dashboardData.overview.totalTests],
      ["Total Students", dashboardData.overview.totalStudents],
      ["Total Teachers", dashboardData.overview.totalTeachers],
      ["Average Score", dashboardData.overview.avgScore],
      ["Average Test Time", dashboardData.overview.avgTestTime],
      ["Total Submissions", submissions.length],
    ];

    // Subject distribution data
    const subjectData = [
      ["Subject", "Number of Tests", "Percentage"],
      ...dashboardData.subjectDistribution.map((item) => [
        item.name,
        item.value,
        `${(
          (item.value /
            dashboardData.subjectDistribution.reduce(
              (sum, s) => sum + s.value,
              0
            )) *
          100
        ).toFixed(1)}%`,
      ]),
    ];

    // Score distribution data
    const scoreData = [
      ["Score Range", "Percentage"],
      ...dashboardData.scoreDistribution.map((item) => [
        item.range,
        `${item.percent}%`,
      ]),
    ];

    // Submissions data (if available)
    const submissionData = [
      ["Submission ID", "Score", "Date"],
      ...submissions.map((sub, index) => [
        sub.id || `SUB-${index + 1}`,
        sub.score,
        sub.createdAt || new Date().toLocaleDateString(),
      ]),
    ];

    // Tests data (if available)
    const testData = [
      ["Test ID", "Time Limit (minutes)", "Subject"],
      ...tests.map((test, index) => [
        test.id || `TEST-${index + 1}`,
        test.timeLimit || 0,
        test.subject || "N/A",
      ]),
    ];

    // Create worksheets
    const overviewWS = XLSX.utils.aoa_to_sheet(overviewData);
    const subjectWS = XLSX.utils.aoa_to_sheet(subjectData);
    const scoreWS = XLSX.utils.aoa_to_sheet(scoreData);
    const submissionWS = XLSX.utils.aoa_to_sheet(submissionData);
    const testWS = XLSX.utils.aoa_to_sheet(testData);

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(wb, overviewWS, "Overview");
    XLSX.utils.book_append_sheet(wb, subjectWS, "Subject Distribution");
    XLSX.utils.book_append_sheet(wb, scoreWS, "Score Distribution");
    XLSX.utils.book_append_sheet(wb, submissionWS, "Submissions");
    XLSX.utils.book_append_sheet(wb, testWS, "Tests");

    // Generate filename with current date
    const currentDate = new Date().toISOString().split("T")[0];
    const filename = `Dashboard_Report_${currentDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

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

        // Get submissions data from response
        const submissionsData = totalSubmissionData.data.metadata || [];
        const testsData = totalExamData.data.metadata || [];

        // Set state
        setSubmissions(submissionsData);
        setTests(testsData);

        console.log(totalSubmissionData);

        // Calculate average score with newly fetched data
        const averageScore = calculateAverageScore(submissionsData);
        // Calculate average time of all tests
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
              { name: "Mathematics", value: 45, color: "#3B82F6" },
              { name: "Chemistry", value: 32, color: "#10B981" },
              { name: "Physics", value: 28, color: "#8B5CF6" },
              { name: "Biology", value: 25, color: "#F59E0B" },
              { name: "Literature", value: 18, color: "#EF4444" },
              { name: "English", value: 8, color: "#6B7280" },
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
            avgTestTime: "0 minutes",
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
          <p className="text-gray-600">Loading statistical data...</p>
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
                  Statistics Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Overview of quiz application activities
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={exportToExcel}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </button>
              </div>
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
                    Total Tests
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
                    Total Students
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
                    Total Teachers
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
                  <p className="text-sm font-medium text-gray-500">Avg Score</p>
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
                Test Distribution by Subject
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
                Score Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData?.scoreDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "Students"]} />
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
                  Total Test Submissions
                </div>
              </div>
            </div>

            {/* <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  87.5%
                </div>
                <div className="text-sm text-gray-600">
                  Average Completion Rate
                </div>
              </div>
            </div> */}

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {dashboardData?.overview?.avgTestTime || "0 minutes"}
                </div>
                <div className="text-sm text-gray-600">
                  Average Time per Test
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
