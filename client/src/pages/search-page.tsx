
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

export function SearchPage() {
  const { toast } = useToast();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const phoneNameForm = useForm({
    defaultValues: {
      searchQuery: "",
    },
  });

  const emailForm = useForm({
    defaultValues: {
      emailQuery: "",
    },
  });

  const handlePhoneNameSearch = async (data) => {
    setLoading(true);
    try {
      // Here you would make an API call to search by phone/name
      const response = await fetch(`/api/search/phoneOrName?query=${encodeURIComponent(data.searchQuery)}`);
      if (!response.ok) throw new Error("بحث غير ناجح");
      
      const searchResults = await response.json();
      setResults(searchResults);
      
      toast({
        title: "تم البحث بنجاح",
        description: "تم العثور على النتائج",
      });
    } catch (error) {
      toast({
        title: "خطأ في البحث",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSearch = async (data) => {
    setLoading(true);
    try {
      // Here you would make an API call to search by social media email
      const response = await fetch(`/api/search/email?query=${encodeURIComponent(data.emailQuery)}`);
      if (!response.ok) throw new Error("بحث غير ناجح");
      
      const searchResults = await response.json();
      setResults(searchResults);
      
      toast({
        title: "تم البحث بنجاح",
        description: "تم العثور على النتائج",
      });
    } catch (error) {
      toast({
        title: "خطأ في البحث",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 rtl">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">نظام البحث عن معلومات الطلاب</CardTitle>
          <CardDescription>البحث عن معلومات طالب جامعي</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="phoneOrName" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="phoneOrName">البحث عن طريق رقم الهاتف أو الاسم</TabsTrigger>
              <TabsTrigger value="email">البحث عن طريق ايميل التواصل الاجتماعي</TabsTrigger>
            </TabsList>

            <TabsContent value="phoneOrName">
              <Form {...phoneNameForm}>
                <form onSubmit={phoneNameForm.handleSubmit(handlePhoneNameSearch)} className="space-y-4">
                  <FormField
                    control={phoneNameForm.control}
                    name="searchQuery"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف أو الاسم</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل رقم الهاتف أو الاسم" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "جاري البحث..." : "بحث"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="email">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(handleEmailSearch)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="emailQuery"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ايميل التواصل الاجتماعي</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل ايميل التواصل الاجتماعي" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "جاري البحث..." : "بحث"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          {results && (
            <div className="mt-8 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">نتائج البحث:</h3>
              <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SearchPage;
