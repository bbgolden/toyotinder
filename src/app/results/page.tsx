"use client";

import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { selectCars } from "@/lib/database"; 
import PreviewWindow from "@/components/PreviewWindow";
import ListWindow from "@/components/ListWindow";

export default function Results() {

    const [currentPreview, setPreview] = useState("");

    useEffect(() => {
        emailjs.init(process.env.MAIL_PUBLIC_KEY ?? "");
    }, []);

    return (
        <div>
            <PreviewWindow model={currentPreview}/>
            <ListWindow cars={selectCars(0, 0, 0, 24, 0)}/>
        </div>
    )
}