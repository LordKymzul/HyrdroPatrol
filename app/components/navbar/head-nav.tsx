'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Loader2, LogOut, Menu, Settings, User, Users } from "lucide-react";
import { Themetoggle } from "../theme/toggle-theme";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



interface BuildToggleProfileProps {
    handleSignOut: () => void;
    email: string;
    url: string
}

export function HeadNavbar() {
    //const isMobile = useMediaQuery("(max-width: 639px)");
    return (
        <nav className="flex items-center border-b p-2">
            <div className="container flex items-center justify-between">
                <Link href={'/dashboard'}>
                    <img src="/airselangor-logo.png" className="h-20 w-50 object-contain" alt="Air Selangor Logo" />
                </Link>
                <div className="flex items-center gap-x-4">
                    <Themetoggle />
                </div>
            </div>
        </nav >
    )
}




