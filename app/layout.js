// app/layout.js

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/ui/navbar";
import Footer from "./components/ui/footer";
import { SessionProvider } from 'next-auth/react';
import Banner from "./components/ui/appName";
import connectToDatabase from '@/lib/db';
import Player from '@/models/Player';
import { auth } from "@/auth";
import RegisterButton from "./components/ui/registerButton";

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
  title: "Best of Luck",
  description: "Created by Unknown",
};

export default async function RootLayout({ children }) {
  const session = await auth(); // Get the session

  let showFooter = false;
  let hideRegisterButton = false; // Initialize the hideRegisterButton flag

  if (session) {
    await connectToDatabase(); // Connect to the database

    // Check if session email exists in the Player collection
    const player = await Player.findOne({ email: session.user.email });
    if (player) {
      showFooter = true; // Set to true if email matches a registered player
      hideRegisterButton = true; // Hide RegisterButton if player exists
    }
  }

  return (
    <html lang="en">
      <body
        className={`bg-stone-800 ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Banner />
        <Navbar />
        <SessionProvider>
          <RegisterButton hideRegisterButton={hideRegisterButton} />
          {children}
          <Footer showFooter={showFooter} /> {/* Pass the showFooter prop */}
        </SessionProvider>
      </body>
    </html>
  );
}
