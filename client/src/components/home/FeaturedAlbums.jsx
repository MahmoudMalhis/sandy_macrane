/* eslint-disable no-unused-vars */
// client/src/components/home/FeaturedAlbums.jsx - محدث لاستخدام الإعدادات
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Heart, ArrowLeft } from "lucide-react";
import Badge from "../common/Badge";
import ApplyNow from "../ApplyNow";

const FeaturedAlbums = ({ albums, settings }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredAlbum, setHoveredAlbum] = useState(null);

  // بيانات افتراضية للعرض
  const defaultAlbums = [
    {
      id: 1,
      title: "مكرمية الورود",
      category: "macrame",
      cover_image: "/images/macrame-1.jpg",
      view_count: 245,
      status: "new",
      description: "تصميم رائع بنمط الورود",
      media: [
        { url: "/images/macrame-1.jpg", alt: "صورة 1" },
        { url: "/images/macrame-2.jpg", alt: "صورة 2" },
      ],
    },
    {
      id: 2,
      title: "برواز الذكريات",
      category: "frame",
      cover_image: "/images/frame-1.jpg",
      view_count: 189,
      status: "featured",
      description: "برواز مميز للصور العائلية",
      media: [{ url: "/images/frame-1.jpg", alt: "صورة 1" }],
    },
    {
      id: 3,
      title: "مكرمية النجوم",
      category: "macrame",
      cover_image: "/images/macrame-3.jpg",
      view_count: 312,
      status: "featured",
      description: "تصميم نجوم ساحر",
      media: [{ url: "/images/macrame-3.jpg", alt: "صورة 1" }],
    },
  ];

  // الإعدادات الافتراضية
  const defaultSettings = {
    section_title: "منتجاتنا المميزة",
    section_description:
      "اكتشف أحدث إبداعاتنا من المكرمية والبراويز المصنوعة بعناية فائقة",
    button_text: "عرض جميع المنتجات",
    show_count: 6,
    sort_by: "view_count",
  };

  const albumsSettings = { ...defaultSettings, ...settings };
  const displayAlbums = albums || defaultAlbums;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("featured-albums");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const getBadgeVariant = (status) => {
    switch (status) {
      case "new":
        return "new";
      case "featured":
        return "featured";
      default:
        return "category";
    }
  };

  const getBadgeText = (status) => {
    switch (status) {
      case "new":
        return "جديد";
      case "featured":
        return "مميز";
      default:
        return "";
    }
  };

  const getCategoryText = (category) => {
    return category === "macrame" ? "مكرمية" : "برواز";
  };

  // تطبيق الترتيب والعدد حسب الإعدادات
  const getSortedAlbums = () => {
    let sortedAlbums = [...displayAlbums];

    // تطبيق الترتيب
    switch (albumsSettings.sort_by) {
      case "view_count":
        sortedAlbums.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
      case "created_at":
        sortedAlbums.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
        break;
      case "random":
        sortedAlbums = sortedAlbums.sort(() => Math.random() - 0.5);
        break;
      default:
        break;
    }

    // تطبيق العدد المحدد
    return sortedAlbums.slice(0, albumsSettings.show_count);
  };

  const sortedAlbums = getSortedAlbums();

  return (
    <section id="featured-albums" className="py-16 lg:py-24 bg-beige">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-purple mb-4">
            {albumsSettings.section_title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {albumsSettings.section_description}
          </p>
          <div className="w-24 h-1 bg-pink mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* شبكة الألبومات */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedAlbums.map((album, index) => (
            <motion.div
              key={album.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onMouseEnter={() => setHoveredAlbum(album.id)}
              onMouseLeave={() => setHoveredAlbum(null)}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform group-hover:scale-105 group-hover:shadow-2xl transition-all duration-500">
                {/* الصورة */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={album.cover_image || album.media?.[0]?.url}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* تدرج */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

                  {/* الشارات */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {album.status && (
                      <Badge variant={getBadgeVariant(album.status)}>
                        {getBadgeText(album.status)}
                      </Badge>
                    )}
                    <Badge variant="category">
                      {getCategoryText(album.category)}
                    </Badge>
                  </div>

                  {/* معلومات عند التمرير */}
                  <div
                    className={`absolute bottom-4 left-4 right-4 transform transition-all duration-300 ${
                      hoveredAlbum === album.id
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                  >
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          <span className="text-sm">{album.view_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={16} />
                          <span className="text-sm">
                            {Math.floor(album.view_count / 10)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* المحتوى */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-purple mb-2 group-hover:text-pink transition-colors duration-300">
                    {album.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {album.description}
                  </p>

                  {/* إحصائيات */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{album.media?.length || 1} صورة</span>
                      <span>{album.view_count} مشاهدة</span>
                    </div>
                  </div>

                  {/* الأزرار */}
                  <div className="flex gap-3">
                    <ApplyNow album={album} className="flex-1 text-sm">
                      اطلب الآن
                    </ApplyNow>

                    <button className="px-4 py-2 border-2 border-purple text-purple hover:bg-purple hover:text-white rounded-full transition-all duration-300 flex items-center gap-2">
                      <span className="text-sm">عرض</span>
                      <ArrowLeft size={16} />
                    </button>
                  </div>
                </div>

                {/* تأثير الانعكاس */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* زر عرض المزيد */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button className="bg-purple text-white px-8 py-4 rounded-full hover:bg-purple-hover transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-3 mx-auto">
            <span className="font-bold">{albumsSettings.button_text}</span>
            <ArrowLeft size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedAlbums;
