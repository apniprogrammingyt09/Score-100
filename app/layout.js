import localFont from "next/font/local";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Score 100 Books - Question Bank for Class 9-12 | CBSE & MPBSE",
  description: "Score 100 series of question bank books for CBSE & MPBSE Board Exams. Previous Year Papers, Solved PYQs, Revision Notes, Mindmaps for Class 9, 10, 11 & 12. Mathematics, Science, Social Science, English & Hindi.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
