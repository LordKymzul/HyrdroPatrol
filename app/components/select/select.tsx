import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface BuildSelectFormProps {
    name: string
    listData: any[]
    handleChange: (value: string) => void;
}


export function SelectForm({ name, listData, handleChange }: BuildSelectFormProps) {
    return (
        <Select
            onValueChange={handleChange}>
            <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
                <SelectValue placeholder={name} />
            </SelectTrigger>
            <SelectContent >
                {listData.map((eachData, index) => (
                    <SelectItem key={index} value={eachData.name} >
                        <p className="line-clamp-1">{eachData.name}</p>
                    </SelectItem>
                ))}

            </SelectContent>
        </Select>
    )
}