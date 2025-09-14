import { useState } from "react";
import useAppStore from "../../store/useAppStore";
import Button from "../components/common/Button";

export default function OrderForm() {
  const { isOrderFormOpen, selectedAlbum, closeOrderForm } = useAppStore();
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    productType: "macrame",
    description: "",
  });

  if (!isOrderFormOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // إنشاء رسالة واتساب
    const message = `مرحباً، أريد طلب منتج:
الاسم: ${formData.name}
الواتساب: ${formData.whatsapp}
نوع المنتج: ${formData.productType === "macrame" ? "مكرمية" : "برواز"}
${selectedAlbum ? `الألبوم: ${selectedAlbum.title}` : ""}
الوصف: ${formData.description}`;

    // فتح واتساب
    const whatsappURL = `https://wa.me/970599123456?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");

    // إغلاق النموذج
    closeOrderForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">طلب منتج جديد</h2>

        {selectedAlbum && (
          <div className="mb-4 p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">الألبوم المحدد:</p>
            <p className="font-semibold">{selectedAlbum.title}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="الاسم الكامل"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="tel"
            placeholder="رقم الواتساب"
            required
            value={formData.whatsapp}
            onChange={(e) =>
              setFormData({ ...formData, whatsapp: e.target.value })
            }
            className="w-full p-3 border rounded-lg"
          />

          <select
            value={formData.productType}
            onChange={(e) =>
              setFormData({ ...formData, productType: e.target.value })
            }
            className="w-full p-3 border rounded-lg"
          >
            <option value="macrame">مكرمية</option>
            <option value="frame">برواز</option>
          </select>

          <textarea
            placeholder="وصف الطلب أو ملاحظات إضافية"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-3 border rounded-lg h-24 resize-none"
          />

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              إرسال الطلب
            </Button>
            <Button type="button" variant="outline" onClick={closeOrderForm}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
