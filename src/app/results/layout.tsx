import Script from "next/script";

export default function ResultsLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <section>
            {children}
            <Script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"/>
        </section>
    )
}