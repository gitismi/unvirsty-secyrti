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
          <h2 className="text-xl font-semibold mb-4">معلومات المستخدم</h2>
          <div className="space-y-2">
            <p><strong>الاسم:</strong> {user?.name}</p>
            <p><strong>اسم المستخدم:</strong> {user?.username}</p>
            <p><strong>البريد الإلكتروني:</strong> {user?.email}</p>
            <p><strong>رقم الهاتف:</strong> {user?.phone}</p>
            <p><strong>آخر تسجيل دخول:</strong> {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('ar-SA') : 'لا يوجد'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
