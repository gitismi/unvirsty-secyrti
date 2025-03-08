
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

interface MenuOption {
  id: number;
  label: string;
  onClick: () => void;
}

const MenuButton: React.FC = () => {
  // تعريف خيارات القائمة
  const menuOptions: MenuOption[] = [
    {
      id: 1,
      label: "معرفة معلومات على شخص",
      onClick: () => {
        console.log("تم اختيار: معرفة معلومات على شخص");
        // يمكن إضافة المزيد من الوظائف هنا
      },
    },
    {
      id: 2,
      label: "معرفة حسابات تواصل طالب جامعي",
      onClick: () => {
        console.log("تم اختيار: معرفة حسابات تواصل طالب جامعي");
        // يمكن إضافة المزيد من الوظائف هنا
      },
    },
    {
      id: 3,
      label: "وصول إلى جميع النتائج",
      onClick: () => {
        console.log("تم اختيار: وصول إلى جميع النتائج");
        // يمكن إضافة المزيد من الوظائف هنا
      },
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full flex items-center justify-center">
          <Menu className="mx-2" />
          خيارات البحث
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56 text-right">
        {menuOptions.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onClick={option.onClick}
            className="cursor-pointer"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuButton;
