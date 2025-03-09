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
      // Special case handling for specific names
      if (data.name === "ذات الوقار" || data.name === "ذوآت افنان") {
        setStudentId("41910436");
        setStudentInfo(null);
        toast({
          title: "تم العثور على الرقم الدراسي",
          description: `الرقم الدراسي هو: 41910436`,
        });
        return;
      }

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
      // Special case for ID 41910436
      if (data.studentId === "41910436") {
        const specialStudent = {
          id: 1,
          name: "ابريكة عبدالله محمد",
          studentId: "41910436",
          email: "brika1996@gmail.com",
          department: "قسم التسويق والتجارة",
          location: "ليبيا إجدابيا",
          additionalInfo: {
            university: "جامعة بنغازي فرع إجدابيا",
            universityId: "20419436",
            period: "من 2019 الى 2023"
          }
        };
        
        setStudentInfo(specialStudent);
        toast({
          title: "تم العثور على معلومات الطالب",
          description: "تم عرض المعلومات بنجاح",
        });
        return;
      }
      
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
                <p><strong>1. الاسم:</strong> {studentInfo.name}</p>
                {studentInfo.additionalInfo?.university && (
                  <p><strong>2. الدراسة:</strong> {studentInfo.additionalInfo.university} {studentInfo.department && `ب${studentInfo.department}`}</p>
                )}
                {studentInfo.additionalInfo?.universityId && (
                  <p><strong>3. الرقم الجامعي:</strong> {studentInfo.additionalInfo.universityId}</p>
                )}
                <p><strong>{studentInfo.additionalInfo?.universityId ? "4" : "2"}. الرقم الدراسي:</strong> {studentInfo.studentId}</p>
                {studentInfo.email && <p><strong>{studentInfo.additionalInfo?.universityId ? "5" : "3"}. البريد الإلكتروني:</strong> {studentInfo.email}</p>}
                {studentInfo.location && <p><strong>{studentInfo.additionalInfo?.universityId ? "6" : "4"}. الموقع:</strong> {studentInfo.location}</p>}
                {studentInfo.additionalInfo?.period && <p><strong>7. الفترة الزمانية:</strong> {studentInfo.additionalInfo.period}</p>}
                {studentInfo.socialEmail && <p><strong>البريد الاجتماعي:</strong> {studentInfo.socialEmail}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SearchPage;