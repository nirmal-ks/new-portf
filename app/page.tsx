import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RecruiterSnapshot from "@/components/RecruiterSnapshot";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Chatbot from "@/components/Chatbot";
import CommandPalette from "@/components/CommandPalette";
import Footer from "@/components/Footer";
import SideBots from "@/components/SideBots";
import VisitorTracker from "@/components/VisitorTracker";
import ScanToast from "@/components/ScanToast";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <RecruiterSnapshot />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* 🤖 JARVIS AI Chatbot — Interactive Portfolio Assistant */}
      <Chatbot />
      <CommandPalette />
      {/* Animated robots living in the side gutters on wide screens */}
      <SideBots />
      {/* Drone scan: visitor intel → WhatsApp + email alerts */}
      <VisitorTracker />
      <ScanToast />
      <Footer />
    </>
  );
}
