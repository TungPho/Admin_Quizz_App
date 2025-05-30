import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "https://backend-quizz-deploy.onrender.com/api/v1/admin/login",
        {
          email,
          password,
        }
      );
      // Assuming the API returns a token on successful login
      console.log(response.data);
      const { adminToken, adminEmail } = response.data;
      console.log(adminToken, adminEmail);
      // Save token to localStorage
      localStorage.setItem("adminToken", adminToken);
      localStorage.setItem("adminEmail", adminEmail);

      // Redirect to admin dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quizzes Admin</h1>
          <p className="text-gray-600 mt-2">Đăng nhập để quản lý hệ thống</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            ) : (
              <LogIn size={18} className="mr-2" />
            )}
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Quên mật khẩu?
          </a>
        </div>
      </div>
    </div>
  );
}
