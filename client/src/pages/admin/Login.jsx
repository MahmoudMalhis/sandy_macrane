import { Link, Navigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Button from "../../components/common/Button";
import { useEffect, useState } from "react";
import { authAPI } from "../../api/auth";
import useAuthStore from "../../api/useAuthStore";

export default function AdminLogin() {
  const { isAuthenticated, login, loading: authLoading } = useAuthStore();
  const [needsSetup, setNeedsSetup] = useState(null);
  const [checkingSetup, setCheckingSetup] = useState(true); // state محلي
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await authAPI.checkSetupStatus();
        setNeedsSetup(response.needsSetup);
      } catch (error) {
        console.error("Error checking setup:", error);
      } finally {
        setCheckingSetup(false); // استخدام المحلي
      }
    };

    checkSetup();
  }, []);

  if (checkingSetup) {
    // استخدام المحلي
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري التحميل...
      </div>
    );
  }

  if (needsSetup) {
    return <Navigate to="/admin/setup" replace />;
  }

  // Redirect if already authenticated
  const from = location.state?.from?.pathname || "/admin";
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data) => {
    const result = await login(data);

    if (result.success) {
      toast.success("تم تسجيل الدخول بنجاح");
    } else {
      toast.error(result.error || "فشل تسجيل الدخول");
    }
  };

  return (
    <div
      className="min-h-screen bg-beige flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/logo.jpg"
            alt="Sandy Macrame"
            className="h-20 w-20 rounded-full mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-purple">لوحة التحكم</h1>
          <p className="text-gray-600">ساندي مكرمية</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              {...register("email", {
                required: "البريد الإلكتروني مطلوب",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "بريد إلكتروني غير صحيح",
                },
              })}
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="admin@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <input
              {...register("password", {
                required: "كلمة المرور مطلوبة",
                minLength: {
                  value: 6,
                  message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                },
              })}
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={authLoading} // استخدام loading من Store
            className="w-full"
            disabled={authLoading}
          >
            {authLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-purple hover:text-purple-hover hover:underline">
          <Link to="/admin/setup"> إنشاء حساب جديد؟</Link>
        </div>
      </div>
    </div>
  );
}
