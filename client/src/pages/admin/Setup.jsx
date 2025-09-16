import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { authAPI } from "../../api/auth";
import Button from "../../components/common/Button";

export default function AdminSetup() {
  const [needsSetup, setNeedsSetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setupLoading, setSetupLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const response = await authAPI.checkSetupStatus();
        setNeedsSetup(response.needsSetup);
      } catch (error) {
        console.error("Error checking setup status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSetupStatus();
  }, []);

  const onSubmit = async (data) => {
    setSetupLoading(true);
    try {
      await authAPI.setupFirstAdmin(data);
      toast.success("تم إنشاء الحساب! تحقق من إيميلك لتفعيل الحساب");
    } catch (error) {
      toast.error(error.message || "حدث خطأ في إنشاء الحساب");
    } finally {
      setSetupLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div>جاري التحميل...</div>
      </div>
    );
  }

  if (!needsSetup) {
    return <Navigate to="/admin/login" replace />;
  }

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
          <h1 className="text-2xl font-bold text-purple">
            إعداد أول حساب إدارة
          </h1>
          <p className="text-gray-600">ساندي مكرمية</p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">معلومات مهمة:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• سيتم إرسال رسالة تفعيل لإيميلك</li>
            <li>• رابط التفعيل صالح لمدة 24 ساعة</li>
            <li>• يمكنك تسجيل الدخول بعد التفعيل فقط</li>
          </ul>
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
              placeholder="your@email.com"
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
                  value: 8,
                  message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام",
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تأكيد كلمة المرور
            </label>
            <input
              {...register("confirmPassword", {
                required: "تأكيد كلمة المرور مطلوب",
                validate: (value) =>
                  value === password || "كلمات المرور غير متطابقة",
              })}
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={setupLoading}
            className="w-full"
            disabled={setupLoading}
          >
            {setupLoading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </Button>
        </form>
      </div>
    </div>
  );
}
