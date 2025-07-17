import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import StoreProvider from "./StoreProvider";
import { Stack } from "@mui/material";
import MuiProvider from "./MuiProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Light Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <StoreProvider>
      <MuiProvider>
        <html lang="en" style={{ height: '100vh' }}>
            <body style={{ height: '100vh' }}>
              <Stack height="100vh">
                <Navbar />
                {children}
              </Stack>
            </body>
        </html>
      </MuiProvider>
    </StoreProvider>
  );
}
