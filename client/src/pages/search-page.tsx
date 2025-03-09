import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const searchByNameSchema = z.object({
  name: z.string().min(1, "يجب إدخال اسم الطالب")
});

const searchByIdSchema = z.object({
  studentId: z.string().min(1, "يجب إدخال الرقم الدراسي")
});

type SearchByNameFormData = z.infer<typeof searchByNameSchema>;
type SearchByIdFormData = z.infer<typeof searchByIdSchema>;

export function SearchPage() {
  const { toast } = useToast();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<any | null>(null);

  const nameForm = useForm<SearchByNameFormData>({
    resolver: zodResolver(searchByNameSchema)
  });

  const idForm = useForm<SearchByIdFormData>({
    resolver: zodResolver(searchByIdSchema)
  });

  const handleNameSearch = async (data: SearchByNameFormData) => {
    try {
      const response = await fetch(`/api/student/searchByName?name=${encodeURIComponent(data.name)}`);
      if (!response.ok) throw new Error("فشل البحث");

      const results = await response.json();
      if (results.length > 0) {
        setStudentId(results[0].studentId);
        setStudentInfo(null);
        toast({
          title: "تم العثور على الرقم الدراسي",
          description: `الرقم الدراسي هو: ${results[0].studentId}`,
        });
      } else {
        toast({
          title: "لم يتم العثور على نتائج",
          description: "لم يتم العثور على طالب بهذا الاسم",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث",
        variant: "destructive",
      });
    }
  };

  const handleIdSearch = async (data: SearchByIdFormData) => {
    try {
      const response = await fetch(`/api/student/searchById?studentId=${encodeURIComponent(data.studentId)}`);
      if (!response.ok) throw new Error("فشل البحث");

      const results = await response.json();
      if (results.length > 0) {
        setStudentInfo(results[0]);
        toast({
          title: "تم العثور على معلومات الطالب",
          description: "تم عرض المعلومات بنجاح",
        });
      } else {
        toast({
          title: "لم يتم العثور على نتائج",
          description: "لم يتم العثور على طالب بهذا الرقم",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-lg mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">البحث عن معلومات الطالب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search by Name Form */}
            <Form {...nameForm}>
              <form onSubmit={nameForm.handleSubmit(handleNameSearch)} className="space-y-4">
                <FormField
                  control={nameForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الطالب</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم الطالب" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">البحث عن الرقم الدراسي</Button>
              </form>
            </Form>

            {studentId && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-700">الرقم الدراسي: {studentId}</p>
              </div>
            )}

            {/* Search by ID Form */}
            <Form {...idForm}>
              <form onSubmit={idForm.handleSubmit(handleIdSearch)} className="space-y-4">
                <FormField
                  control={idForm.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرقم الدراسي</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل الرقم الدراسي" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">استخراج معلومات الطالب</Button>
              </form>
            </Form>

            {studentInfo && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-2">
                <h3 className="font-semibold text-blue-900">معلومات الطالب:</h3>
                <p><strong>الاسم:</strong> {studentInfo.name}</p>
                <p><strong>البريد الإلكتروني:</strong> {studentInfo.email}</p>
                <p><strong>الايميل الثاني:</strong> {studentInfo.socialEmail}</p>
                <p><strong>القسم:</strong> {studentInfo.department}</p>
                <p><strong>الموقع:</strong> {studentInfo.location}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SearchPage;