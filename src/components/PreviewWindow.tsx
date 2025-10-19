import { use } from "react";
import { selectSingle } from "@/lib/database";

export default function PreviewWindow({
    model,
}: {
    model: string,
}) {

    const carData = use(selectSingle(model));

    return (
        <div>
            
        </div>
    )
}