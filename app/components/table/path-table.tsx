import { TLatLng } from "@/app/lib/types"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function PathTable({ paths }: { paths: TLatLng[] }) {
    return (
        <Table className="border rounded-lg">
            <TableCaption>A list of your recent paths.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Path</TableHead>
                    <TableHead>Latitude</TableHead>
                    <TableHead>Longitude</TableHead>

                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    paths.map((eachPath, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{`Path ${index}`}</TableCell>
                                <TableCell>{eachPath.lat}</TableCell>
                                <TableCell>{eachPath.lng}</TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>

        </Table>
    )
}


