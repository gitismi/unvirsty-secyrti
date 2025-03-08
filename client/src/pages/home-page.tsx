import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Shield, CheckCircle } from "lucide-react";
import MenuButton from "@/components/MenuButton"; // Added import

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">مرحباً {user?.name || user?.username}</h1>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p>تم تسجيل دخولك بنجاح</p>
          </div>

          <div className="text-center py-4">
            <div className="w-full"> {/* Replaced 2 with MenuButton */}
              <MenuButton />
            </div>
          </div>

          <p className="text-gray-600">سوف تصلك رسالة الموقع على بريدك المدخل قريباً</p>

          <Button onClick={handleLogout} variant="outline" className="mt-6 w-full">
            تسجيل الخروج
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}