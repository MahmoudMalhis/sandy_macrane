import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Image,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  FileText,
} from "lucide-react";
import useAuthStore from "../../api/useAuthStore";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const menuItems = [
    { icon: Home, label: "الرئيسية", path: "/admin" },
    { icon: Image, label: "الألبومات", path: "/admin/albums" },
    { icon: MessageSquare, label: "آراء العملاء", path: "/admin/testimonials" },
    { icon: Users, label: "الاستعلامات", path: "/admin/inquiries" },
    { icon: Settings, label: "الإعدادات", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex" dir="rtl">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } md:w-64`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2
              className={`font-bold text-purple ${
                sidebarOpen ? "block" : "hidden"
              } md:block`}
            >
              لوحة التحكم
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-700 hover:bg-purple hover:text-white transition-colors ${
                  isActive ? "bg-purple text-white" : ""
                }`
              }
            >
              <item.icon size={20} />
              <span
                className={`mr-3 ${sidebarOpen ? "block" : "hidden"} md:block`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 right-4 left-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span
              className={`mr-3 ${sidebarOpen ? "block" : "hidden"} md:block`}
            >
              تسجيل الخروج
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
