interface MainHeaderProps {
    title: string,
    desc: string
}

export function MainHeader({ title, desc }: MainHeaderProps) {
    return (
        <div className="flex flex-col">
            <h1 className="xs:text-md md:text-2xl font-semibold">{title}</h1>
            <h1 className="xs:text-xs md:text-md font-light">{desc}</h1>
        </div>
    )
}