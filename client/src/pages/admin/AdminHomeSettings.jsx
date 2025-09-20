import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  Save,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Settings,
  Image,
  MessageSquare,
  Palette,
  Users,
  Smartphone,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Button from "../../components/common/Button";

export default function AdminHomeSettings() {
  const [activeTab, setActiveTab] = useState("slider");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homeSettings, setHomeSettings] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm();

  // تحميل جميع إعدادات الصفحة الرئيسية
  useEffect(() => {
    const fetchHomeSettings = async () => {
      try {
        setLoading(true);

        // استدعاء API للحصول على جميع إعدادات الصفحة الرئيسية
        const response = await fetch("/api/settings/admin/home", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setHomeSettings(data.data);
          populateForm(data.data);
        }
      } catch (error) {
        console.error("Error fetching home settings:", error);
        toast.error("فشل في تحميل الإعدادات");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeSettings();
  }, []);

  // تعبئة النموذج بالبيانات
  const populateForm = (data) => {
    if (data.home_slider) {
      const slider = data.home_slider;
      setValue("macrame_title", slider.macrame?.title || "");
      setValue("macrame_subtitle", slider.macrame?.subtitle || "");
      setValue("macrame_button_text", slider.macrame?.button_text || "");
      setValue("macrame_image", slider.macrame?.image || "");

      setValue("frames_title", slider.frames?.title || "");
      setValue("frames_subtitle", slider.frames?.subtitle || "");
      setValue("frames_button_text", slider.frames?.button_text || "");
      setValue("frames_image", slider.frames?.image || "");
    }

    if (data.home_about) {
      const about = data.home_about;
      setValue("about_title", about.title || "");
      setValue("about_subtitle", about.subtitle || "");
      setValue("about_description", about.description || "");
      setValue("about_button_text", about.button_text || "");
      setValue("about_image", about.image || "");
    }

    if (data.home_cta) {
      const cta = data.home_cta;
      setValue("cta_section_title", cta.section_title || "");
      setValue("cta_section_description", cta.section_description || "");

      setValue("custom_design_title", cta.custom_design?.title || "");
      setValue("custom_design_subtitle", cta.custom_design?.subtitle || "");
      setValue(
        "custom_design_description",
        cta.custom_design?.description || ""
      );
      setValue(
        "custom_design_button_text",
        cta.custom_design?.button_text || ""
      );
      setValue("custom_design_image", cta.custom_design?.image || "");

      setValue("gallery_title", cta.gallery?.title || "");
      setValue("gallery_subtitle", cta.gallery?.subtitle || "");
      setValue("gallery_description", cta.gallery?.description || "");
      setValue("gallery_button_text", cta.gallery?.button_text || "");
      setValue("gallery_image", cta.gallery?.image || "");
    }

    if (data.home_albums) {
      const albums = data.home_albums;
      setValue("albums_section_title", albums.section_title || "");
      setValue("albums_section_description", albums.section_description || "");
      setValue("albums_button_text", albums.button_text || "");
      setValue("albums_show_count", albums.show_count || 6);
      setValue("albums_sort_by", albums.sort_by || "view_count");
    }

    if (data.home_testimonials) {
      const testimonials = data.home_testimonials;
      setValue("testimonials_section_title", testimonials.section_title || "");
      setValue(
        "testimonials_section_description",
        testimonials.section_description || ""
      );
      setValue("testimonials_button_text", testimonials.button_text || "");
      setValue("testimonials_show_count", testimonials.show_count || 4);
      setValue("testimonials_min_rating", testimonials.min_rating || 4);
      setValue("testimonials_autoplay", testimonials.autoplay || true);
      setValue(
        "testimonials_autoplay_delay",
        testimonials.autoplay_delay || 6000
      );
    }

    if (data.home_whatsapp) {
      const whatsapp = data.home_whatsapp;
      setValue("whatsapp_enabled", whatsapp.enabled || true);
      setValue("whatsapp_show_after_scroll", whatsapp.show_after_scroll || 300);
      setValue(
        "whatsapp_business_hours_enabled",
        whatsapp.business_hours?.enabled || true
      );
      setValue(
        "whatsapp_business_hours_start",
        whatsapp.business_hours?.start || "09:00"
      );
      setValue(
        "whatsapp_business_hours_end",
        whatsapp.business_hours?.end || "21:00"
      );
    }

    if (data.site_meta) {
      const meta = data.site_meta;
      setValue("site_title", meta.title || "");
      setValue("site_description", meta.description || "");
      setValue("site_keywords", meta.keywords || "");
    }
  };

  // حفظ إعدادات قسم معين
  const saveSection = async (sectionName, data) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/settings/admin/home/${sectionName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `تم حفظ إعدادات ${getSectionArabicName(sectionName)} بنجاح`
        );
        return true;
      } else {
        toast.error(result.message || "فشل في الحفظ");
        return false;
      }
    } catch (error) {
      console.error(`Error saving ${sectionName}:`, error);
      toast.error("حدث خطأ أثناء الحفظ");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // حفظ إعدادات السلايدر
  const onSubmitSlider = async (data) => {
    const sliderData = {
      macrame: {
        title: data.macrame_title,
        subtitle: data.macrame_subtitle,
        button_text: data.macrame_button_text,
        image: data.macrame_image,
      },
      frames: {
        title: data.frames_title,
        subtitle: data.frames_subtitle,
        button_text: data.frames_button_text,
        image: data.frames_image,
      },
    };

    await saveSection("slider", sliderData);
  };

  // حفظ إعدادات النبذة
  const onSubmitAbout = async (data) => {
    const aboutData = {
      title: data.about_title,
      subtitle: data.about_subtitle,
      description: data.about_description,
      button_text: data.about_button_text,
      image: data.about_image,
    };

    await saveSection("about", aboutData);
  };

  // حفظ إعدادات CTA
  const onSubmitCTA = async (data) => {
    const ctaData = {
      section_title: data.cta_section_title,
      section_description: data.cta_section_description,
      custom_design: {
        title: data.custom_design_title,
        subtitle: data.custom_design_subtitle,
        description: data.custom_design_description,
        button_text: data.custom_design_button_text,
        image: data.custom_design_image,
      },
      gallery: {
        title: data.gallery_title,
        subtitle: data.gallery_subtitle,
        description: data.gallery_description,
        button_text: data.gallery_button_text,
        image: data.gallery_image,
      },
    };

    await saveSection("cta", ctaData);
  };

  // حفظ إعدادات الألبومات
  const onSubmitAlbums = async (data) => {
    const albumsData = {
      section_title: data.albums_section_title,
      section_description: data.albums_section_description,
      button_text: data.albums_button_text,
      show_count: parseInt(data.albums_show_count),
      sort_by: data.albums_sort_by,
    };

    await saveSection("albums", albumsData);
  };

  // حفظ إعدادات التقييمات
  const onSubmitTestimonials = async (data) => {
    const testimonialsData = {
      section_title: data.testimonials_section_title,
      section_description: data.testimonials_section_description,
      button_text: data.testimonials_button_text,
      show_count: parseInt(data.testimonials_show_count),
      min_rating: parseInt(data.testimonials_min_rating),
      autoplay: data.testimonials_autoplay,
      autoplay_delay: parseInt(data.testimonials_autoplay_delay),
    };

    await saveSection("testimonials", testimonialsData);
  };

  // حفظ إعدادات الواتساب
  const onSubmitWhatsApp = async (data) => {
    const whatsappData = {
      enabled: data.whatsapp_enabled,
      show_after_scroll: parseInt(data.whatsapp_show_after_scroll),
      business_hours: {
        enabled: data.whatsapp_business_hours_enabled,
        start: data.whatsapp_business_hours_start,
        end: data.whatsapp_business_hours_end,
        timezone: "Palestine",
      },
    };

    await saveSection("whatsapp", whatsappData);
  };

  // حفظ إعدادات الموقع
  const onSubmitSiteMeta = async (data) => {
    const metaData = {
      title: data.site_title,
      description: data.site_description,
      keywords: data.site_keywords,
    };

    const response = await fetch("/api/settings/admin/site/meta", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(metaData),
    });

    const result = await response.json();
    if (result.success) {
      toast.success("تم حفظ إعدادات الموقع بنجاح");
    } else {
      toast.error("فشل في حفظ إعدادات الموقع");
    }
  };

  // رفع صورة
  const handleImageUpload = async (event, fieldName) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صحيح");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    try {
      const imageUrl = URL.createObjectURL(file);
      setValue(fieldName, imageUrl);
      toast.success("تم رفع الصورة بنجاح");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("فشل في رفع الصورة");
    }
  };

  // الحصول على الاسم العربي للقسم
  const getSectionArabicName = (sectionName) => {
    const names = {
      slider: "السلايدر",
      about: "النبذة التعريفية",
      cta: "أقسام الدعوة للعمل",
      albums: "الألبومات المميزة",
      testimonials: "آراء العملاء",
      whatsapp: "إعدادات الواتساب",
    };
    return names[sectionName] || sectionName;
  };

  const tabs = [
    { id: "slider", label: "سلايدر الكفر", icon: Image },
    { id: "about", label: "النبذة التعريفية", icon: Edit },
    { id: "cta", label: "أقسام الدعوة", icon: Palette },
    { id: "albums", label: "الألبومات المميزة", icon: MessageSquare },
    { id: "testimonials", label: "آراء العملاء", icon: Users },
    { id: "whatsapp", label: "إعدادات الواتساب", icon: Smartphone },
    { id: "sections", label: "ترتيب الأقسام", icon: Settings },
    { id: "seo", label: "إعدادات SEO", icon: Save },
  ];

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple mx-auto mb-4"></div>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          إعدادات الصفحة الرئيسية
        </h1>
        <p className="text-gray-600 mt-2">
          تحكم كامل في جميع عناصر ومحتويات الصفحة الرئيسية
        </p>
      </div>

      {/* التبويبات */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8 space-x-reverse overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-purple text-purple"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* محتوى التبويبات */}

      {/* تبويب السلايدر */}
      {activeTab === "slider" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">إعدادات سلايدر الكفر</h2>

          <form onSubmit={handleSubmit(onSubmitSlider)} className="space-y-8">
            {/* شريحة المكرمية */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple mb-4">
                شريحة المكرمية
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      العنوان الرئيسي
                    </label>
                    <input
                      {...register("macrame_title", {
                        required: "العنوان مطلوب",
                      })}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="مكرمية مصنوعة بحب"
                    />
                    {errors.macrame_title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.macrame_title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      العنوان الفرعي
                    </label>
                    <input
                      {...register("macrame_subtitle")}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="تفاصيل تلامس روحك"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نص الزر
                    </label>
                    <input
                      {...register("macrame_button_text")}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="اطلب الآن"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    صورة الخلفية
                  </label>
                  <div className="mt-1">
                    {watch("macrame_image") && (
                      <div className="mb-4">
                        <img
                          src={watch("macrame_image")}
                          alt="معاينة"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              اضغط لرفع صورة
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, WEBP (حد أقصى 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e, "macrame_image")
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* شريحة البراويز */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green mb-4">
                شريحة البراويز
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      العنوان الرئيسي
                    </label>
                    <input
                      {...register("frames_title", {
                        required: "العنوان مطلوب",
                      })}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="براويز مكرمية تُخلّد لحظاتك"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      العنوان الفرعي
                    </label>
                    <input
                      {...register("frames_subtitle")}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="إبداع يدوي يحفظ ذكرياتك الجميلة"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نص الزر
                    </label>
                    <input
                      {...register("frames_button_text")}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="اطلب الآن"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    صورة الخلفية
                  </label>
                  <div className="mt-1">
                    {watch("frames_image") && (
                      <div className="mb-4">
                        <img
                          src={watch("frames_image")}
                          alt="معاينة"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              اضغط لرفع صورة
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, WEBP (حد أقصى 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "frames_image")}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={saving} className="px-8">
                <Save size={18} className="ml-2" />
                حفظ إعدادات السلايدر
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* تبويب النبذة التعريفية */}
      {activeTab === "about" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">
            إعدادات النبذة التعريفية
          </h2>

          <form onSubmit={handleSubmit(onSubmitAbout)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان الرئيسي
                  </label>
                  <input
                    {...register("about_title")}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="فن المكرمية بلمسة عصرية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان الفرعي
                  </label>
                  <input
                    {...register("about_subtitle")}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="رحلة إبداع تبدأ من القلب"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف
                  </label>
                  <textarea
                    {...register("about_description")}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="نقدم لكم قطع مكرمية مصنوعة يدوياً بشغف وإتقان..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نص الزر
                  </label>
                  <input
                    {...register("about_button_text")}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="تعرف علينا أكثر"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  صورة القسم
                </label>
                <div className="mt-1">
                  {watch("about_image") && (
                    <div className="mb-4">
                      <img
                        src={watch("about_image")}
                        alt="معاينة"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">اضغط لرفع صورة</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WEBP (حد أقصى 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "about_image")}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={saving} className="px-8">
                <Save size={18} className="ml-2" />
                حفظ إعدادات النبذة
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* تبويب إعدادات SEO */}
      {activeTab === "seo" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">إعدادات SEO والموقع</h2>

          <form onSubmit={handleSubmit(onSubmitSiteMeta)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان الموقع
              </label>
              <input
                {...register("site_title", { required: "عنوان الموقع مطلوب" })}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="ساندي مكرمية - Sandy Macrame"
              />
              {errors.site_title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.site_title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وصف الموقع
              </label>
              <textarea
                {...register("site_description")}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="أجمل أعمال المكرمية والبراويز اليدوية من ساندي مكرمية"
              />
              <p className="text-sm text-gray-500 mt-1">
                سيظهر هذا الوصف في نتائج البحث ووسائل التواصل الاجتماعي
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الكلمات المفتاحية
              </label>
              <input
                {...register("site_keywords")}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="مكرمية, براويز, ساندي, يدوية, فلسطين"
              />
              <p className="text-sm text-gray-500 mt-1">
                افصل بين الكلمات بفاصلة (,)
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={saving} className="px-8">
                <Save size={18} className="ml-2" />
                حفظ إعدادات SEO
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
