import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Save, Upload, Eye, Edit, Trash2, Plus } from "lucide-react";
import Button from "../../components/common/Button";
import { adminAPI } from "../../api/auth";

export default function AdminHomeSettings() {
  const [activeTab, setActiveTab] = useState("slider");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  // تحميل الإعدادات الحالية
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getSettings();
        setSettings(response.data);

        // تعبئة النموذج بالبيانات الموجودة
        if (response.data.home_slider) {
          const slider = response.data.home_slider;
          setValue("macrame_title", slider.macrame?.title || "");
          setValue("macrame_subtitle", slider.macrame?.subtitle || "");
          setValue("macrame_button_text", slider.macrame?.button_text || "");
          setValue("macrame_image", slider.macrame?.image || "");

          setValue("frames_title", slider.frames?.title || "");
          setValue("frames_subtitle", slider.frames?.subtitle || "");
          setValue("frames_button_text", slider.frames?.button_text || "");
          setValue("frames_image", slider.frames?.image || "");
        }

        if (response.data.site_meta) {
          const meta = response.data.site_meta;
          setValue("site_title", meta.title || "");
          setValue("site_description", meta.description || "");
          setValue("site_keywords", meta.keywords || "");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("فشل في تحميل الإعدادات");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [setValue]);

  // حفظ إعدادات السلايدر
  const onSubmitSlider = async (data) => {
    setSaving(true);
    try {
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

      await adminAPI.updateSettings({ home_slider: sliderData });
      toast.success("تم حفظ إعدادات السلايدر بنجاح");
    } catch (error) {
      console.error("Error saving slider settings:", error);
      toast.error("فشل في حفظ إعدادات السلايدر");
    } finally {
      setSaving(false);
    }
  };

  // حفظ إعدادات الموقع
  const onSubmitSiteMeta = async (data) => {
    setSaving(true);
    try {
      const metaData = {
        title: data.site_title,
        description: data.site_description,
        keywords: data.site_keywords,
      };

      await adminAPI.updateSettings({ site_meta: metaData });
      toast.success("تم حفظ إعدادات الموقع بنجاح");
    } catch (error) {
      console.error("Error saving site meta:", error);
      toast.error("فشل في حفظ إعدادات الموقع");
    } finally {
      setSaving(false);
    }
  };

  // رفع صورة
  const handleImageUpload = async (event, fieldName) => {
    const file = event.target.files[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صحيح");
      return;
    }

    // التحقق من حجم الملف (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      // هنا يمكن إضافة API call لرفع الصورة
      // const response = await adminAPI.uploadMedia(formData);
      // setValue(fieldName, response.data.url);

      // مؤقتاً نستخدم URL محلي
      const imageUrl = URL.createObjectURL(file);
      setValue(fieldName, imageUrl);
      toast.success("تم رفع الصورة بنجاح");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("فشل في رفع الصورة");
    }
  };

  const tabs = [
    { id: "slider", label: "سلايدر الكفر", icon: Edit },
    { id: "about", label: "نبذة سريعة", icon: Eye },
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
          إدارة محتوى وإعدادات الصفحة الرئيسية للموقع
        </p>
      </div>

      {/* التبويبات */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8 space-x-reverse">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
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

      {/* تبويب النبذة */}
      {activeTab === "about" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">إعدادات النبذة السريعة</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              <strong>ملاحظة:</strong> محتوى النبذة السريعة محدد مسبقاً في
              الكود. يمكن تطوير هذا القسم لاحقاً لجعله قابل للتحرير من لوحة
              الإدارة.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                العنوان الحالي:
              </h3>
              <p className="text-gray-600">"فن المكرمية بلمسة عصرية"</p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                العنوان الفرعي:
              </h3>
              <p className="text-gray-600">"رحلة إبداع تبدأ من القلب"</p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">الوصف:</h3>
              <p className="text-gray-600">
                "نقدم لكم قطع مكرمية مصنوعة يدوياً بشغف وإتقان، حيث تتلاقى
                الحرفية التقليدية مع التصميم العصري..."
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                🔧 <strong>قريباً:</strong> سيتم إضافة إمكانية تحرير محتوى
                النبذة من هنا.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
