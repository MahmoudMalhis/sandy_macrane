// src/pages/admin/EmailVerification.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { authAPI } from "../../api/auth";

export default function EmailVerification() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await authAPI.verifyEmail(token);
        setStatus("success");
        setMessage(response.message);
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "فشل في تفعيل الحساب");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div
      className="min-h-screen bg-beige flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <img
          src="/logo.jpg"
          alt="Sandy Macrame"
          className="h-20 w-20 rounded-full mx-auto mb-6"
        />

        {status === "loading" && (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple mx-auto mb-4"></div>
            <p>جاري تفعيل الحساب...</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-green-600 mb-4">
              تم التفعيل بنجاح!
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/admin/login"
              className="bg-purple text-white px-6 py-3 rounded-lg hover:bg-purple-hover transition-colors"
            >
              تسجيل الدخول
            </Link>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h2 className="text-xl font-bold text-red-600 mb-4">
              فشل في التفعيل
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                to="/admin/setup"
                className="block bg-purple text-white px-6 py-3 rounded-lg hover:bg-purple-hover transition-colors"
              >
                إعادة التسجيل
              </Link>
              <Link
                to="/admin/login"
                className="block text-purple hover:underline"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
