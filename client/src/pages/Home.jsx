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

        // جلب البيانات العامة من الإعدادات
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
    const siteMeta = homeData?.settings?.site_meta;
    return {
      title: "فن المكرمية بلمسة عصرية",
      subtitle: "رحلة إبداع تبدأ من القلب",
      description:
        siteMeta?.description ||
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

  const getWhatsAppNumber = () => {
    return homeData?.settings?.whatsapp_owner || "970599123456";
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

  return (
    <div className="min-h-screen bg-beige">
      {/* سلايدر الكفر */}
      <HeroSlider sliderData={getSliderData()} />

      {/* نبذة سريعة */}
      <AboutTeaser aboutData={getAboutData()} />

      {/* الألبومات المميزة */}
      <FeaturedAlbums albums={homeData?.albums} />

      {/* سلايدر آراء العملاء */}
      <TestimonialsSlider testimonials={homeData?.reviews} />

      {/* قسم الدعوة المزدوجة */}
      <DualCTA />

      {/* زر واتساب العائم */}
      <FloatingWhatsApp
        phoneNumber={getWhatsAppNumber()}
        businessHours={{
          start: "09:00",
          end: "21:00",
          timezone: "Palestine",
        }}
      />

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
