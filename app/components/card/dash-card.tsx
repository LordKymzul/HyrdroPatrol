import { LucideIcon } from "lucide-react"

export interface DashCardProps {
    title: string
    content: string
    desc: string
    icon: LucideIcon
}


export function DashCard({ props }: { props: DashCardProps }) {
    return (
        <div className="flex flex-col gap-3 p-4 rounded-lg border shadow hover:scale-[1.05] ease-in-out transition-all">
            <section className="flex items-center justify-between">
                <p className="font-semibold text-base">{props.title}</p>
                <props.icon className="w-4 h-4" />
            </section>

            <p className="font-semibold text-xl">{props.content}</p>

            <p className="text-xs font-light">{props.desc}</p>
        </div>

    )
}