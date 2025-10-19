import { use } from "react";
import type { ExtendedCarData } from "@/lib/database";

export default function ListWindow({
    cars,
}: {
    cars: Promise<ExtendedCarData[]>
}) {

    const carsData = use(cars);

    return (
        <div>

        </div>
    )
}