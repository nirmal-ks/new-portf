import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { profile, SITE_URL } from "@/lib/profile";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

const description =
  "Portfolio of Nirmal Saravanan — Robotics, Embedded & Full Stack Engineer in Chennai. Unitree quadruped control, ROS 2 SLAM navigation, Raspberry Pi / STM32 IoT and production Next.js platforms.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nirmal Saravanan | Robotics, Embedded & Full Stack Engineer",
    template: "%s | Nirmal Saravanan",
  },
  description,
  applicationName: "Nirmal Saravanan Portfolio",
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    "Nirmal Saravanan", "Robotics Engineer", "Embedded Systems Engineer", "Full Stack Developer",
    "ROS 2", "SLAM", "Unitree", "Raspberry Pi", "STM32", "IoT", "Next.js", "TypeScript", "Chennai",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: "Nirmal Saravanan",
    title: "Nirmal Saravanan | Robotics, Embedded & Full Stack Engineer",
    description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nirmal Saravanan | Robotics, Embedded & Full Stack Engineer",
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080609",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: SITE_URL,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: "Xmedia Solution (Scopex Tech Pvt Ltd)" },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: ["Robotics", "ROS 2", "SLAM", "Embedded Systems", "IoT", "Raspberry Pi", "STM32", "Next.js", "TypeScript", "Three.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${firaCode.variable}`}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
