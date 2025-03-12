'use client';
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Bot, CreditCard, LayoutDashboard, Presentation } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import useProject from "@/hooks/use-project";

const items = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'QnA',
        url: '/qa',
        icon: Bot,
    },
    {
        title: 'Meeting',
        url: '/meetings',
        icon: Presentation,
    },
    {
        title: 'Billing',
        url: '/billing',
        icon: CreditCard,
    },
]

const projects = [
    {
        name: 'Project 1',
    },
    {
        name: 'Project 2',
    },
    {
        name: 'Project 3',
    },
]
export function AppSidebar() {
    const pathname = usePathname();
    const { open } = useSidebar();
    const { projects, projectId, setProjectId } = useProject();
    return (
        <div>
            <Sidebar collapsible="icon" variant="floating">
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <Image src="/github.svg" width={32} height={32} alt="logo" />
                        {open && (<h1 className="text-x1 font-bold text-primary/80">Git Talk</h1>)}
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            Application
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>

                                {items.map(item => {
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.url} className={cn({
                                                    '!bg-primary !text-black': pathname === item.url
                                                })}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>
                            Projects
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {projects?.map(project => {
                                    return (
                                        <SidebarMenuItem key={project.name}>
                                            <SidebarMenuButton asChild>
                                                <div onClick={() => {
                                                    setProjectId(project.id);
                                                }}>
                                                    <div className={cn('rounded-full w-8 h-8 flex items-center justify-center bg-primary text-white',
                                                        {
                                                            // 'bg-primary text-black': true 
                                                            'bg-black text-white border-blue-600': project.id === projectId
                                                        }
                                                    )}>
                                                        {project.name[0]}
                                                    </div>
                                                    <span>{project.name}</span>
                                                </div>
                                            </SidebarMenuButton>

                                        </SidebarMenuItem>
                                    )
                                })}
                                <div className="h-2"></div>
                                <SidebarMenuItem>
                                    <Link href='/create'>
                                        {open && (<Button variant={'outline'} className="w-fit">
                                            Create Project
                                        </Button>)}
                                    </Link>

                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

            </Sidebar>
        </div>
    )
}