import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiroFish Web Tester | Autonomous Multi-Agent Swarm QA",
  description: "Reverse-engineered MiroFish swarm intelligence engine adapted for web application UX simulation, stress testing, and autonomous bug discovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
