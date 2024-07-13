"use client"

import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { useFormStatus } from "react-dom"


export function SearchButton() {
    const { pending } = useFormStatus();
    return (
        <>
            {
                pending ?
                    (
                        <Button disabled className="w-fit rounded-lg">
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        </Button>
                    )
                    :
                    (
                        <Button type="submit" className="w-fit rounded-lg" >
                            <Search />
                        </Button>
                    )
            }
        </>
    )
}