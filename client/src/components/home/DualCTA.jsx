/* eslint-disable no-unused-vars */
// client/src/components/home/DualCTA.jsx - مُصحح
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, Eye, ArrowLeft, Sparkles } from "lucide-react";
import ApplyNow from "../ApplyNow";

const DualCTA = ({ ctaData }) => {
  const [isVisible, setIsVisible] = useState(false);

  // البيانات الافتراضية
  const defaultData = {
    section_title: "ابدأ رحلتك معنا",
    section_description:
      "اختر الطريقة التي تناسبك للحصول على قطعة مكرمية أو برواز مميز",
    custom_design: {
      title: "اطلب تصميم مخصص",
      subtitle: "حوّل أفكارك إلى قطعة فنية فريدة",
      description:
        "احصل على تصميم مكرمية أو برواز مخصص حسب ذوقك الشخصي ومساحتك",
      button_text: "ابدأ التصميم",
      icon: Palette,
      bgColor: "from-purple to-pink",
      image: "/images/custom-design.jpg",
    },
    gallery: {
      title: "اذهب للمعرض",
      subtitle: "استكشف مجموعتنا الكاملة",
      description:
        "تصفح جميع منتجاتنا المتاحة واختر ما يناسب ذوقك من تشكيلة واسعة",
      button_text: "زيارة المعرض",
      icon: Eye,
      bgColor: "from-green to-purple",
      image: "/images/gallery-preview.jpg",
    },
  };

  // دمج البيانات المرسلة مع البيانات الافتراضية
  const data = {
    section_title: ctaData?.section_title || defaultData.section_title,
    section_description:
      ctaData?.section_description || defaultData.section_description,
    custom_design: {
      ...defaultData.custom_design,
      ...(ctaData?.custom_design || {}),
    },
    gallery: {
      ...defaultData.gallery,
      ...(ctaData?.gallery || {}),
    },
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("dual-cta");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const CTACard = ({ ctaInfo, index, isCustom }) => {
    const [isHovered, setIsHovered] = useState(false);

    // التأكد من وجود جميع الخصائص المطلوبة
    const safeCtaInfo = {
      title: ctaInfo?.title || "عنوان القسم",
      subtitle: ctaInfo?.subtitle || "وصف القسم",
      description: ctaInfo?.description || "وصف تفصيلي للقسم",
      button_text: ctaInfo?.button_text || "اضغط هنا",
      image: ctaInfo?.image || "/images/default-cta.jpg",
      icon: ctaInfo?.icon || Palette,
      bgColor: ctaInfo?.bgColor || "from-purple to-pink",
    };

    return (
      <motion.div
        className="relative group cursor-pointer"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105">
          {/* صورة الخلفية */}
          <div className="absolute inset-0">
            <img
              src={safeCtaInfo.image}
              alt={safeCtaInfo.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              onError={(e) => {
                // في حالة فشل تحميل الصورة، استخدم صورة افتراضية
                e.target.src = "/images/default-cta.jpg";
              }}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br ${safeCtaInfo.bgColor} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
            ></div>
            <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>

          {/* المحتوى */}
          <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-8">
            {/* الأيقونة */}
            <motion.div
              className="mb-6"
              animate={
                isHovered ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full">
                <safeCtaInfo.icon size={48} className="text-white" />
              </div>
            </motion.div>

            {/* النصوص */}
            <motion.h3
              className="text-2xl lg:text-3xl font-bold mb-3"
              animate={isHovered ? { y: -5 } : { y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {safeCtaInfo.title}
            </motion.h3>

            <motion.p
              className="text-lg lg:text-xl mb-4 opacity-90"
              animate={isHovered ? { y: -5 } : { y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {safeCtaInfo.subtitle}
            </motion.p>

            <motion.p
              className="text-sm lg:text-base mb-8 opacity-80 max-w-sm"
              animate={
                isHovered ? { y: -5, opacity: 1 } : { y: 0, opacity: 0.8 }
              }
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {safeCtaInfo.description}
            </motion.p>

            {/* الزر */}
            <motion.div
              animate={isHovered ? { y: -10, scale: 1.05 } : { y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {isCustom ? (
                <ApplyNow />
              ) : (
                <button className="bg-white text-purple hover:bg-light-gray px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all duration-300 flex items-center gap-3">
                  <span>{safeCtaInfo.button_text}</span>
                  <ArrowLeft size={20} />
                </button>
              )}
            </motion.div>
          </div>

          {/* تأثيرات إضافية */}
          <div className="absolute top-4 right-4">
            <motion.div
              animate={
                isHovered
                  ? { scale: 1.2, opacity: 1 }
                  : { scale: 1, opacity: 0.7 }
              }
              transition={{ duration: 0.3 }}
            >
              <Sparkles size={24} className="text-white" />
            </motion.div>
          </div>

          {/* تدرج إضافي عند التمرير */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          ></div>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="dual-cta" className="py-16 lg:py-24 bg-beige">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-purple mb-4">
            {data.section_title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {data.section_description}
          </p>
          <div className="w-24 h-1 bg-pink mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* البطاقات */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <CTACard ctaInfo={data.custom_design} index={0} isCustom={true} />
          <CTACard ctaInfo={data.gallery} index={1} isCustom={false} />
        </div>

        {/* نص إضافي */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-gray-600 max-w-3xl mx-auto">
            سواء كنت تبحث عن تصميم مخصص يناسب مساحتك تماماً أو تريد اختيار من
            مجموعتنا الجاهزة، نحن هنا لنساعدك في إيجاد القطعة المثالية التي تضيف
            لمسة جمال لمنزلك.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DualCTA;
