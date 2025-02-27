'use client'

import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import useProject from "@/hooks/use-project";
/* import useRefreshProjects from "@/hooks/useRefreshProjects"; */
import { cn } from "@/lib/utils";
import { Bot, CreditCard, LayoutDashboard, Menu, Plus, Search, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"


const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
]


export function AppSidebar() {
  const pathname = usePathname();
  const { projects, projectId, setProjectId } = useProject();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Use a mutation observer to detect when the sidebar's data-collapsed attribute changes
  useEffect(() => {
    if (!sidebarRef.current) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-collapsed"
        ) {
          const isCollapsed = sidebarRef.current?.getAttribute("data-collapsed") === "true";
          setCollapsed(isCollapsed);
        }
      });
    });

    observer.observe(sidebarRef.current, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [sidebarRef]);

  return (
    <Sidebar
      ref={sidebarRef}
      collapsible="icon"
      variant="floating"
      className="bg-background border-r border-border"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between w-full">
          <div className="text-xl font-bold text-foreground truncate">
            {!collapsed && <span>GitOnboard</span>}
            {collapsed && <span> </span>}
          </div>
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel className="text-muted-foreground">
          Application
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={cn(
                      "text-muted-foreground hover:text-foreground hover:bg-accent",
                      { 'bg-primary text-primary-foreground': pathname === item.url }
                    )}
                  >
                    <item.icon className="h-5 w-5"></item.icon>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroup />
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Your Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.name}>
                  <SidebarMenuButton asChild>
                    <div
                      onClick={() => setProjectId(project.id)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <div className={cn(
                        'rounded-sm border size-5 flex items-center justify-center text-sm  text-foreground border-border',
                        {
                          'bg-primary text-primary-foreground': project.id === projectId,
                          'text-foreground border-border': project.id !== projectId
                        }
                      )}>
                        {project.name[0]?.toUpperCase()}
                      </div>
                      {!collapsed && <span>{project.name}</span>}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div
                    onClick={() => router.push('/createproject')}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <div className="rounded-sm border size-6 flex items-center justify-center text-sm bg-background text-foreground border-border">
                      <Plus className="h-4 w-4" />
                    </div>
                    {!collapsed && <span>New Project</span>}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}