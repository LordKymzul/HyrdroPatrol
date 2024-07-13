import { ReactNode } from "react";
import { DashboardNav } from "../components/navbar/dash-nav";
import { HeadNavbar } from "../components/navbar/head-nav";


export default function DashboardLayout({ children }: { children: ReactNode }) {

    return (
        <>
            <HeadNavbar />
            <div className="mx-8 md:container grid flex-1 gap-6 md:grid-cols-[200px_1fr]">
                <aside className="hidden w-[200px] flex-col md:flex m-6">
                    <DashboardNav />
                </aside>
                <main>
                    {children}
                </main>
            </div>
        </>
    )
}

function BuildTest() {
    return (
        <div className="flex flex-col space-y-6 mt-5"></div>
    )
}