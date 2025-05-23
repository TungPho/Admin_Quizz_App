import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaUsers } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import { MdClass, MdPerson, MdSchool } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { FiLogOut } from "react-icons/fi"; // Added logout icon
import { useContext, useEffect, useRef, useState } from "react";
import { AdminContext } from "../context/AdminContext";

const SideBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isMobile, setIsMobile, collapsed, setCollapsed } =
    useContext(AdminContext);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/login");
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Enable scroll
    }

    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);

      // Auto-collapse on mobile but don't auto-expand on desktop
      if (newIsMobile && !collapsed) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = "auto"; // Cleanup when unmount
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, collapsed, setCollapsed]);

  // Calculate sidebar width classes
  const sidebarWidthClass = collapsed
    ? "w-0 lg:w-20 overflow-hidden"
    : "w-72 lg:w-64";

  // Calculate content margin
  const contentMarginClass = collapsed ? "ml-0 lg:ml-20" : "ml-0 lg:ml-64";

  return (
    <div className="relative">
      {/* Mobile hamburger - only visible when sidebar is collapsed on mobile */}
      {collapsed && isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:bg-gray-100 transition-all duration-300 flex items-center justify-center w-10 h-10 lg:hidden"
          aria-label="Open menu"
        >
          <RiMenuUnfoldLine size={20} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`flex flex-col justify-between h-screen border-r border-gray-300 fixed top-0 left-0 text-gray-700 bg-white z-40 shadow-lg transition-all duration-300 ease-in-out ${sidebarWidthClass}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area with Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <NavLink
              className="text-[#31cd63] text-3xl font-bold flex items-center"
              to={"/"}
            >
              {collapsed && !isMobile ? "Q" : "Quizzes"}
            </NavLink>

            {/* Toggle button next to logo */}
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              {collapsed ? (
                <RiMenuUnfoldLine size={22} />
              ) : (
                <RiMenuFoldLine size={22} />
              )}
            </button>
          </div>

          {/* University Name */}
          {!collapsed && (
            <div className="mx-4 my-4 p-2 border border-gray-300 rounded-lg text-xs text-center bg-gray-50 shadow-sm">
              Admin Panel
            </div>
          )}

          <nav className="flex-1 px-2">
            {/*để kiểm tra giao diện mobile hay không ? có thì ẩn chữ, còn không thì hiện*/}

            <NavLink
              to={"/users"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 my-1.5 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "text-[#31cd63] bg-green-50 font-medium shadow-sm"
                    : "hover:bg-gray-100"
                } ${collapsed && !isMobile ? "justify-center" : ""}`
              }
            >
              <FaUsers
                className={`${collapsed && !isMobile ? "" : "mr-3"}`}
                size={18}
              />
              {collapsed && !isMobile ? "" : "All Users"}
            </NavLink>
            <NavLink
              to={"/students"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 my-1.5 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "text-[#31cd63] bg-green-50 font-medium shadow-sm"
                    : "hover:bg-gray-100"
                } ${collapsed && !isMobile ? "justify-center" : ""}`
              }
            >
              <MdSchool
                className={`${collapsed && !isMobile ? "" : "mr-3"}`}
                size={18}
              />
              {collapsed && !isMobile ? "" : "All Students"}
            </NavLink>
            <NavLink
              to={"/teachers"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 my-1.5 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "text-[#31cd63] bg-green-50 font-medium shadow-sm"
                    : "hover:bg-gray-100"
                } ${collapsed && !isMobile ? "justify-center" : ""}`
              }
            >
              <MdPerson
                className={`${collapsed && !isMobile ? "" : "mr-3"}`}
                size={18}
              />
              {collapsed && !isMobile ? "" : "All Teachers"}
            </NavLink>
            <NavLink
              to={"/submissions"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 my-1.5 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "text-[#31cd63] bg-green-50 font-medium shadow-sm"
                    : "hover:bg-gray-100"
                } ${collapsed && !isMobile ? "justify-center" : ""}`
              }
            >
              <FaUsers
                className={`${collapsed && !isMobile ? "" : "mr-3"}`}
                size={18}
              />
              {collapsed && !isMobile ? "" : "All Quizz Tests"}
            </NavLink>
            <NavLink
              to={"/pending_teachers"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 my-1.5 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "text-[#31cd63] bg-green-50 font-medium shadow-sm"
                    : "hover:bg-gray-100"
                } ${collapsed && !isMobile ? "justify-center" : ""}`
              }
            >
              <MdPerson
                className={`${collapsed && !isMobile ? "" : "mr-3"}`}
                size={18}
              />
              {collapsed && !isMobile ? "" : "Pending Teacher Requests"}
            </NavLink>
          </nav>

          {/* Logout button at the bottom */}
          <div className="border-t border-gray-200 p-2 mt-auto">
            <button
              onClick={handleLogout}
              className={`flex items-center py-3 px-4 w-full rounded-lg transition-colors duration-200 text-red-500 hover:bg-red-50 ${
                collapsed && !isMobile ? "justify-center" : ""
              }`}
            >
              <FiLogOut
                className={`${collapsed && !isMobile ? "" : "mr-3"}`}
                size={18}
              />
              {collapsed && !isMobile ? "" : "Logout"}
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <>
          {/* Modal Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 animate-fadeIn">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FiLogOut className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Confirm Logout
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  Are you sure you want to log out of your account?
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={cancelLogout}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Overlay for mobile when sidebar is open */}
      {!collapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Content padding when sidebar is open */}
      <div
        className={`transition-all duration-300 ease-in-out ${contentMarginClass}`}
      ></div>
    </div>
  );
};

export default SideBar;
