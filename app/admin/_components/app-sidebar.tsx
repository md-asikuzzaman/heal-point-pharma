"use client";

import { Bell, ChevronUp, Home, Inbox, Settings, User2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: Inbox,
  },
  {
    title: "Add Product",
    url: "/admin/product",
    icon: Inbox,
  },
  {
    title: "Stock Requests",
    url: "/admin/requests",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const { data: session } = useSession();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      pathname === item.url &&
                        "bg-slate-900 hover:bg-slate-900 text-white hover:text-white",
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="profile"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <>
                      {session?.user?.name ? (
                        <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                          {session.user.name[0]}
                        </span>
                      ) : (
                        <User2 className="size-7 text-green-500" />
                      )}
                    </>
                  )}
                  {session?.user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <Link href="/" rel="noopener noreferrer">
                    Visit Site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
