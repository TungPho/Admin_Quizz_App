import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");
  const adminEmail = localStorage.getItem("adminEmail");
  const location = useLocation(); // Lấy đường dẫn hiện tại

  // Kiểm tra nếu người dùng đang ở trang /login
  const isLoginPage = location.pathname === "/login";
  useEffect(() => {
    if ((adminToken || adminEmail) && isLoginPage) {
      navigate("/");
    }
    if (!adminToken || !adminEmail) {
      navigate("/login"); // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    }
  }, [adminEmail, adminToken, isLoginPage, navigate]);

  return (
    <div className="flex">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
