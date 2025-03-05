import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const goToSearch = () => {
    navigate("/search");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>مرحباً بكم في نظام أمن الجامعة</CardTitle>
          <CardDescription>
            نظام إدارة الأمن الجامعي المتكامل للمساعدة في تنظيم وتسهيل عمليات الأمن داخل الحرم الجامعي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="font-bold">اسم المستخدم:</span> {user?.username}
            </div>
            {user?.name && (
              <div>
                <span className="font-bold">الاسم:</span> {user.name}
              </div>
            )}
            {user?.email && (
              <div>
                <span className="font-bold">البريد الإلكتروني:</span> {user.email}
              </div>
            )}
            {user?.phone && (
              <div>
                <span className="font-bold">رقم الهاتف:</span> {user.phone}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={goToSearch}>
            البحث عن طالب
          </Button>
          <Button className="w-full" variant="outline" onClick={handleLogout}>
            تسجيل الخروج
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}