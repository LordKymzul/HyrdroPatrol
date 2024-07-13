import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowBigDown } from "lucide-react";

export interface MultiDropDownProps {
    formFieldName: string
    options: any[]
}

export function MultiDropDown({ formFieldName, options }: MultiDropDownProps) {
    return (
        <div className="flex border rounded-md justify-between p-2 w-full">
            <label className="relative w-full">
                <BuildContent formFieldName={formFieldName} options={options} />
            </label >
            <ArrowBigDown className="w-4 h-4" />
        </div>
    )
}

function BuildContent({ formFieldName, options }: MultiDropDownProps) {
    return (
        <>
            <input type="checkbox" className="hidden peer" />
            <p className="text-sm font-medium">Select Team Member</p>
            <div className="absolute transition-opacity opacity-0
            rounded-md border p-1 w-full mt-4
             pointer-events-none peer-checked:opacity-100
              peer-checked:pointer-events-auto">
                <ul>
                    {options.map((option, i) => {
                        return (
                            <li key={option}>
                                <label className="flex whitespace-nowrap
                                 cursor-pointer rounded-md
                                p-2 transition-colors
                                 hover:bg-accent m-1
                                  [&:has(input:checked)]:bg-blue-200">
                                    <input
                                        type="checkbox"
                                        name={formFieldName}
                                        value={option}
                                        className="cursor-pointer"
                                    />
                                    <span className="text-sm font-medium ml-1">{option}</span>
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    )
}