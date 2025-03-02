import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <Button 
            variant="outline" 
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            تسجيل الخروج
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">مرحباً {user?.name || user?.username}</h2>
          <p className="text-gray-600">تم تسجيل دخولك بنجاح</p>
          <p className="text-gray-600 mt-2">سوف تصلك رسالة الموقع على بريدك المدخل قريباً</p>
        </div>
      </div>
    </div>
  );
}