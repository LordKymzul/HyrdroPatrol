import { getDrones } from "@/app/action/drone-action";
import { MainHeader } from "@/app/components/header/main-header";
import { DroneTable } from "@/app/components/table/drone-table";
import { TDrone } from "@/app/lib/types";

export default async function DronesPage() {

    const response = await getDrones();
    if (response.value === null) {
        return (
            <h1>Something was wrong.</h1>
        )
    }

    const drones: TDrone[] = await response.value;

    return (
        <div className="flex flex-col px-8 py-5 gap-5 w-full">
            <MainHeader title="All Drones" desc="Here is your overview" />
            <DroneTable data={drones} />
        </div>
    )
}