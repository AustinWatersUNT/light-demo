import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import StoreProvider from "./StoreProvider";
import { Stack } from "@mui/material";
import MuiProvider from "./MuiProvider";

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
        <html lang="en" style={{ height: '100vh', padding: 'none' }}>
            <body style={{ height: '100vh', margin: '0' }}>
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
