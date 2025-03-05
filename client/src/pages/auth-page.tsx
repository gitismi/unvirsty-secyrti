import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm({
    resolver: zodResolver(insertUserSchema.pick({ username: true, password: true })),
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
  });

  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl mx-4">
        <Card className="lg:order-2">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle className="text-2xl font-bold">نظام تسجيل الدخول لأمن الجامعة</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="register">تسجيل جديد</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الهاتف / البريد الإلكتروني / اسم المستخدم</FormLabel>
                          <FormControl>
                            <Input {...field} dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                      {loginMutation.isPending ? "جاري التسجيل..." : "تسجيل الدخول"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الكامل</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المستخدم</FormLabel>
                          <FormControl>
                            <Input {...field} dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الهاتف</FormLabel>
                          <FormControl>
                            <Input {...field} dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? "جاري التسجيل..." : "إنشاء حساب"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="hidden lg:flex lg:order-1 flex-col justify-center">
          <h1 className="text-4xl font-bold mb-6 text-primary">مرحباً بكم في نظام أمن الجامعة</h1>
          <p className="text-lg text-gray-600 mb-4">
            نظام إدارة الأمن الجامعي المتكامل للمساعدة في تنظيم وتسهيل عمليات الأمن داخل الحرم الجامعي
          </p>
        </div>
      </div>
    </div>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    
    const result = await login(username, password);
    
    if (result.success) {
      setLocation("/");
    } else {
      setError(result.error || "Login failed");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 lg:grid lg:grid-cols-2">
      <Card className="w-full max-w-md mx-4 lg:order-2">
        <CardContent className="pt-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form onSubmit={handleLogin}>
                <form className="space-y-4 mt-4">
                  {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      اسم المستخدم
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      كلمة المرور
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="register">
              <Form>
                <form className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="new-username" className="text-sm font-medium">
                      اسم المستخدم
                    </label>
                    <input
                      id="new-username"
                      name="username"
                      type="text"
                      required
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium">
                      كلمة المرور
                    </label>
                    <input
                      id="new-password"
                      name="password"
                      type="password"
                      required
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                  >
                    إنشاء حساب
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="hidden lg:flex lg:order-1 flex-col justify-center px-8">
        <h1 className="text-4xl font-bold mb-6 text-primary">مرحباً بكم في نظام أمن الجامعة</h1>
        <p className="text-lg text-gray-600">
          نظام متكامل لإدارة الأمن والسلامة في الحرم الجامعي
        </p>
      </div>
    </div>
  );
}
