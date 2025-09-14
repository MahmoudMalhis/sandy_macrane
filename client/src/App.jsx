// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<div>المعرض</div>} />
          <Route path="/about" element={<div>من نحن</div>} />
          <Route path="/testimonials" element={<div>آراء العملاء</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
