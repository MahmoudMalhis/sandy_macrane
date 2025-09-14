// src/pages/Home.jsx
import Layout from "../components/layout/Layout";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-96 bg-gray-200">
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center p-4">
          <h1 className="text-4xl font-bold mb-4">مكرمية مصنوعة بحب</h1>
          <p className="text-xl mb-6">تفاصيل تلامس روحك</p>
          {/* سيتم إضافة الصور لاحقاً */}
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-purple mb-4">
            فن المكرمية بلمسة عصرية
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
            نقدم لكم قطع مكرمية مصنوعة يدوياً بشغف وإتقان
          </p>
        </div>
      </section>
    </>
  );
}
