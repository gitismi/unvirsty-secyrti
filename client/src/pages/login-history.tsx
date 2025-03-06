
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";

type LoginRecord = {
  id: number;
  userId: number;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
};

export default function LoginHistoryPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    const fetchLoginHistory = async () => {
      try {
        setLoading(true);
        const data = await apiRequest<LoginRecord[]>("/api/login-history");
        setLoginHistory(data);
      } catch (error) {
        console.error("خطأ في استرداد سجل الدخول:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, [user, setLocation]);

  if (!user) return null;

  return (
    <div className="container mx-auto py-8" dir="rtl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">سجل تسجيل الدخول</CardTitle>
          <Button variant="outline" onClick={() => setLocation("/")}>العودة للرئيسية</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">جاري التحميل...</div>
          ) : loginHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ والوقت</TableHead>
                  <TableHead>عنوان IP</TableHead>
                  <TableHead>متصفح/جهاز</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {new Date(record.timestamp).toLocaleString('ar-SA')}
                    </TableCell>
                    <TableCell>{record.ipAddress || "غير متاح"}</TableCell>
                    <TableCell>{record.userAgent || "غير متاح"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">لا يوجد سجل دخول حالياً</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
