// client/src/pages/Home.jsx - محدث لاستخدام الإعدادات الجديدة
import { useState, useEffect } from "react";
import { settingsAPI } from "../api/settings";
import HeroSlider from "../components/home/HeroSlider";
import AboutTeaser from "../components/home/AboutTeaser";
import FeaturedAlbums from "../components/home/FeaturedAlbums";
import TestimonialsSlider from "../components/home/TestimonialsSlider";
import DualCTA from "../components/home/DualCTA";
import FloatingWhatsApp from "../components/home/FloatingWhatsApp";

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // جلب جميع إعدادات الصفحة الرئيسية
        const settingsResponse = await settingsAPI.getPublic();

        // يمكن إضافة API calls أخرى للألبومات والتقييمات هنا
        // const albumsResponse = await albumsAPI.getFeatured();
        // const reviewsResponse = await reviewsAPI.getFeatured();

        const data = {
          settings: settingsResponse.data || settingsResponse,
          // albums: albumsResponse.data || [],
          // reviews: reviewsResponse.data || []
        };

        setHomeData(data);
      } catch (err) {
        console.error("Error fetching home data:", err);
        setError("فشل في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // تحضير البيانات للمكونات
  const getSliderData = () => {
    if (!homeData?.settings?.home_slider) return null;

    const slider = homeData.settings.home_slider;
    return [
      {
        id: 1,
        type: "macrame",
        title: slider.macrame?.title || "مكرمية مصنوعة بحب",
        subtitle: slider.macrame?.subtitle || "تفاصيل تلامس روحك",
        buttonText: slider.macrame?.button_text || "اطلب الآن",
        image: slider.macrame?.image || "/images/macrame-hero.jpg",
        bgGradient: "from-purple to-pink",
      },
      {
        id: 2,
        type: "frames",
        title: slider.frames?.title || "براويز مكرمية تُخلّد لحظاتك",
        subtitle: slider.frames?.subtitle || "إبداع يدوي يحفظ ذكرياتك الجميلة",
        buttonText: slider.frames?.button_text || "اطلب الآن",
        image: slider.frames?.image || "/images/frames-hero.jpg",
        bgGradient: "from-green to-purple",
      },
    ];
  };

  const getAboutData = () => {
    const aboutSettings = homeData?.settings?.home_about;

    if (aboutSettings) {
      return aboutSettings;
    }

    // البيانات الافتراضية
    return {
      title: "فن المكرمية بلمسة عصرية",
      subtitle: "رحلة إبداع تبدأ من القلب",
      description:
        "نقدم لكم قطع مكرمية مصنوعة يدوياً بشغف وإتقان، حيث تتلاقى الحرفية التقليدية مع التصميم العصري لنخلق لكم قطعاً فنية تضيف الدفء والجمال لمساحاتكم.",
      highlights: [
        {
          icon: "❤️",
          title: "صنع بحب",
          description: "كل قطعة تحمل لمسة شخصية",
        },
        {
          icon: "✨",
          title: "تصاميم فريدة",
          description: "إبداعات لا تتكرر",
        },
        {
          icon: "🏆",
          title: "جودة عالية",
          description: "مواد خام مختارة بعناية",
        },
      ],
      buttonText: "تعرف علينا أكثر",
      image: "/images/about-hero.jpg",
    };
  };

  const getCTAData = () => {
    const ctaSettings = homeData?.settings?.home_cta;

    if (ctaSettings) {
      return ctaSettings;
    }

    // البيانات الافتراضية
    return {
      section_title: "ابدأ رحلتك معنا",
      section_description:
        "اختر الطريقة التي تناسبك للحصول على قطعة مكرمية أو برواز مميز",
      custom_design: {
        title: "اطلب تصميم مخصص",
        subtitle: "حوّل أفكارك إلى قطعة فنية فريدة",
        description:
          "احصل على تصميم مكرمية أو برواز مخصص حسب ذوقك الشخصي ومساحتك",
        button_text: "ابدأ التصميم",
        image: "/images/custom-design.jpg",
      },
      gallery: {
        title: "اذهب للمعرض",
        subtitle: "استكشف مجموعتنا الكاملة",
        description:
          "تصفح جميع منتجاتنا المتاحة واختر ما يناسب ذوقك من تشكيلة واسعة",
        button_text: "زيارة المعرض",
        image: "/images/gallery-preview.jpg",
      },
    };
  };

  const getAlbumsSettings = () => {
    return (
      homeData?.settings?.home_albums || {
        section_title: "منتجاتنا المميزة",
        section_description:
          "اكتشف أحدث إبداعاتنا من المكرمية والبراويز المصنوعة بعناية فائقة",
        button_text: "عرض جميع المنتجات",
        show_count: 6,
        sort_by: "view_count",
      }
    );
  };

  const getTestimonialsSettings = () => {
    return (
      homeData?.settings?.home_testimonials || {
        section_title: "ماذا يقول عملاؤنا",
        section_description:
          "آراء حقيقية من عملائنا الكرام حول تجربتهم مع منتجاتنا",
        button_text: "شاهد جميع التقييمات",
        show_count: 4,
        min_rating: 4,
        autoplay: true,
        autoplay_delay: 6000,
      }
    );
  };

  const getWhatsAppSettings = () => {
    const whatsappSettings = homeData?.settings?.home_whatsapp;
    const phoneNumber = homeData?.settings?.whatsapp_owner;

    return {
      phoneNumber: phoneNumber || "970599123456",
      enabled: whatsappSettings?.enabled !== false,
      showAfterScroll: whatsappSettings?.show_after_scroll || 300,
      businessHours: whatsappSettings?.business_hours || {
        enabled: true,
        start: "09:00",
        end: "21:00",
        timezone: "Palestine",
      },
      quickMessages: whatsappSettings?.quick_messages || [
        { id: 1, text: "أريد طلب قطعة مكرمية", icon: "🕸️" },
        { id: 2, text: "أود طلب برواز مخصص", icon: "🖼️" },
        { id: 3, text: "استفسار عن الأسعار", icon: "💰" },
        { id: 4, text: "معلومات عن التوصيل", icon: "🚚" },
      ],
    };
  };

  const getSectionsVisibility = () => {
    return (
      homeData?.settings?.home_sections || {
        hero_slider: { enabled: true, order: 1 },
        about: { enabled: true, order: 2 },
        featured_albums: { enabled: true, order: 3 },
        testimonials: { enabled: true, order: 4 },
        dual_cta: { enabled: true, order: 5 },
        whatsapp_float: { enabled: true, order: 0 },
      }
    );
  };

  // ترتيب الأقسام حسب الإعدادات
  const getSortedSections = () => {
    const sections = getSectionsVisibility();
    const sectionsArray = Object.entries(sections)
      .filter(([key, config]) => config.enabled && key !== "whatsapp_float")
      .sort(([, a], [, b]) => a.order - b.order);

    return sectionsArray.map(([key]) => key);
  };

  // رندر القسم حسب النوع
  const renderSection = (sectionType) => {
    switch (sectionType) {
      case "hero_slider":
        return <HeroSlider key="hero" sliderData={getSliderData()} />;

      case "about":
        return <AboutTeaser key="about" aboutData={getAboutData()} />;

      case "featured_albums":
        const albumsSettings = getAlbumsSettings();
        return (
          <FeaturedAlbums
            key="albums"
            albums={homeData?.albums}
            settings={albumsSettings}
          />
        );

      case "testimonials":
        const testimonialsSettings = getTestimonialsSettings();
        return (
          <TestimonialsSlider
            key="testimonials"
            testimonials={homeData?.reviews}
            settings={testimonialsSettings}
          />
        );

      case "dual_cta":
        return <DualCTA key="cta" ctaData={getCTAData()} />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-purple mb-2">
            جاري التحميل...
          </h2>
          <p className="text-gray-600">نحضر لك أجمل المحتويات</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            عذراً، حدث خطأ
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple text-white px-6 py-3 rounded-lg hover:bg-purple-hover transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const sortedSections = getSortedSections();
  const whatsappSettings = getWhatsAppSettings();
  const sectionsVisibility = getSectionsVisibility();

  return (
    <div className="min-h-screen bg-beige">
      {/* رندر الأقسام حسب الترتيب المحدد */}
      {sortedSections.map((sectionType) => renderSection(sectionType))}

      {/* زر واتساب العائم - يظهر إذا كان مفعلاً */}
      {sectionsVisibility.whatsapp_float?.enabled &&
        whatsappSettings.enabled && (
          <FloatingWhatsApp
            phoneNumber={whatsappSettings.phoneNumber}
            showAfterScroll={whatsappSettings.showAfterScroll}
            businessHours={whatsappSettings.businessHours}
            quickMessages={whatsappSettings.quickMessages}
          />
        )}

      {/* تحسين الأداء - Lazy Loading للصور */}
      <style>{`
        img {
          loading: lazy;
        }

        /* تحسينات CSS إضافية */
        .animate-fade-up {
          animation: fadeUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* تحسين التمرير السلس */
        html {
          scroll-behavior: smooth;
        }

        /* تحسين الأداء للأنيميشن */
        * {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* تحسين الخطوط */
        body {
          font-display: swap;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
};

export default Home;
