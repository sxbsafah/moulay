
import type * as React from "react";
import { Link } from "react-router";
import { useLocation } from "react-router";
import {
  Package,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Vue d'ensemble",
    items: [
      {
        title: "Produits",
        url: "/admin/produits",
        icon: Package,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();

  return (
    <Sidebar {...props} className="border-r border-border">
      <SidebarHeader className="border-b border-border py-4 px-">
        <Link
          to="/"
          className="font-serif text-2xl font-medium tracking-wide hover:text-primary transition-colors flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-semibold">
            M
          </div>
          MOULAY
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`
                          ${
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }
                          rounded-lg transition-all duration-200
                        `}
                      >
                        <Link
                          to={item.url}
                          className="flex items-center gap-3 px-3 py-2.5"
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {isActive && <ChevronRight className="h-4 w-4" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
