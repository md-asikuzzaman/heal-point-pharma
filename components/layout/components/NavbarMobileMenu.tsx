"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSheetStore } from "@/store/useSheetStore";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Menu } from "lucide-react";
import NavbarLinks from "./NavbarLinks";

const NavbarMobileMenu = () => {
  const { isOpen, toggle } = useSheetStore();

  return (
    <Sheet open={isOpen} onOpenChange={toggle}>
      <SheetTrigger>
        <Menu className="w-6 h-6 text-green-500 cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left" className="pt-10 px-5">
        <DialogTitle>Mobile Menu</DialogTitle>
        <div className="flex flex-col gap-6">
          <NavbarLinks />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarMobileMenu;
