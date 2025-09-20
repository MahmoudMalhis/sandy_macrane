/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Award } from "lucide-react";
import Button from "../common/Button";

const AboutTeaser = ({ aboutData }) => {
  const [isVisible, setIsVisible] = useState(false);

  // البيانات الافتراضية
  const defaultData = {
    title: "فن المكرمية بلمسة عصرية",
    subtitle: "رحلة إبداع تبدأ من القلب",
    description:
      "نقدم لكم قطع مكرمية مصنوعة يدوياً بشغف وإتقان، حيث تتلاقى الحرفية التقليدية مع التصميم العصري لنخلق لكم قطعاً فنية تضيف الدفء والجمال لمساحاتكم.",
    highlights: [
      { icon: Heart, title: "صنع بحب", description: "كل قطعة تحمل لمسة شخصية" },
      {
        icon: Sparkles,
        title: "تصاميم فريدة",
        description: "إبداعات لا تتكرر",
      },
      {
        icon: Award,
        title: "جودة عالية",
        description: "مواد خام مختارة بعناية",
      },
    ],
    buttonText: "تعرف علينا أكثر",
    image: "/images/about-hero.jpg",
  };

  const data = aboutData || defaultData;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("about-teaser");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about-teaser" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* المحتوى النصي */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <motion.h2
                className="text-3xl lg:text-4xl font-bold text-purple leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {data.title}
              </motion.h2>

              <motion.p
                className="text-lg text-pink font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {data.subtitle}
              </motion.p>

              <motion.p
                className="text-gray-600 leading-relaxed text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {data.description}
              </motion.p>
            </div>

            {/* النقاط المميزة */}
            <motion.div
              className="grid gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {data.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <div className="bg-purple text-white p-3 rounded-full group-hover:bg-pink transition-colors duration-300">
                    {/* <highlight.icon size={20} /> */}
                  </div>
                  <div>
                    <h3 className="font-bold text-purple text-lg mb-1">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-600">{highlight.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* زر الدعوة للعمل */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Button
                variant="secondary"
                size="lg"
                className="transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {data.buttonText}
              </Button>
            </motion.div>
          </motion.div>

          {/* الصورة */}
          <motion.div
            className="relative order-first lg:order-last"
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="relative">
              {/* الصورة الرئيسية */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={data.image}
                  alt="ساندي مكرمية"
                  className="w-full h-96 lg:h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />

                {/* تدرج علوي */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-purple opacity-20"></div>
              </div>

              {/* عناصر تزيينية */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green rounded-full opacity-30 animate-bounce"></div>

              {/* إطار تزييني */}
              <div className="absolute -inset-4 border-2 border-purple border-opacity-20 rounded-2xl -z-10"></div>
            </div>

            {/* شارة تميز */}
            <motion.div
              className="absolute top-4 left-4 bg-pink text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              ✨ صنع بحب
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
