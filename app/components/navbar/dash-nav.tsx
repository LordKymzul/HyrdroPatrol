"use client"

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertOctagon, Archive, Bell, CreditCard, File, Folders, Group, GroupIcon, Home, LayoutDashboard, LayoutList, Map, Plane, Settings, User, Users, Workflow } from "lucide-react"
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard
    },

    {
        name: 'Drones',
        href: '/dashboard/drones',
        icon: Plane
    },

    {
        name: 'Alert Log',
        href: '/dashboard/alert-log',
        icon: AlertOctagon
    },

];

export function DashboardNav() {
    const pathName = usePathname();
    console.log(pathName);
    return (
        <nav className="grid items-start gap-2">
            {
                navItems.map((item, index) => (
                    <Link key={index} href={item.href}
                        className={cn(
                            buttonVariants({ variant: item.href === pathName ? 'default' : 'ghost', size: "sm" }),
                            "justify-start"
                        )}>

                        <span className="flex flex-row items-center">
                            <item.icon className="mr-4 w-5 h-5" />
                            <span>
                                {
                                    item.name
                                }
                            </span>
                        </span>
                    </Link>
                ))
            }
        </nav>
    )
}