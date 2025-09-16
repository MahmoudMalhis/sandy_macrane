// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import "./App.css";
import OrderForm from "./forms/OrderForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import { Toaster } from "react-hot-toast";
import AdminSetup from "./pages/admin/Setup";
import EmailVerification from "./pages/admin/EmailVerification";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
                <OrderForm />
              </Layout>
            }
          />

          <Route
            path="/gallery"
            element={
              <Layout>
                <div>المعرض</div>
              </Layout>
            }
          />

          <Route
            path="/about"
            element={
              <Layout>
                <div>من نحن</div>
              </Layout>
            }
          />

          <Route
            path="/testimonials"
            element={
              <Layout>
                <div>آراء العملاء</div>
              </Layout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route
            path="/admin/verify-email/:token"
            element={<EmailVerification />}
          />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            {/* <Route path="albums" element={<AlbumsAdmin />} /> */}
            {/* <Route path="testimonials" element={<TestimonialsAdmin />} /> */}
            {/* <Route path="settings" element={<SettingsAdmin />} /> */}
          </Route>
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "Cairo",
              direction: "rtl",
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
