// src/components/layout/Layout.jsx
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-beige">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
