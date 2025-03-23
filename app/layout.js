import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Broodl",
    description: "Track your daily mood, every day of the year!",
};

export default function RootLayout({ children }) {
    const header = (
        <header>
            
        </header>
    )

    const footer = (
        <footer>
            
        </footer>
    )

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {footer}
                {children}
                {footer}
            </body>
        </html>
    );
}
