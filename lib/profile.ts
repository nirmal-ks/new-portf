// Single source of truth for portfolio content — consumed by the page sections,
// the printable resume (/resume), the command palette and SEO metadata.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const profile = {
  name: "Nirmal Saravanan",
  title: "AI, Robotics, Embedded & Full Stack Engineer",
  location: "Chennai, Tamil Nadu, India",
  email: "nirmal.saravanan.dev@gmail.com",
  phone: "+91 8610680721",
  phoneHref: "tel:+918610680721",
  github: "https://github.com/nirmal-ks",
  linkedin: "https://www.linkedin.com/in/nirmal-saravanan-7520a8230/",
  careerStart: "2021-11-01",
  summary:
    "Multidisciplinary engineer building across AI, robotics, embedded systems and full-stack software. Ships Generative AI and agentic AI products (AI mock-interview platform, AI code conversion) on Python, FastAPI and Django; programs Unitree quadruped robots and ROS 2 SLAM navigation stacks; designs Raspberry Pi / STM32 edge controllers and KiCad PCBs; and delivers production web apps, Flutter apps and Windows desktop software end to end.",
  openTo: ["Full-time engineering roles", "AI / GenAI product builds", "Autonomous robotics projects", "Embedded hardware consulting", "Contract / freelance builds"],
};

export type Experience = {
  role: string;
  company: string;
  date: string;
  location: string;
  type: string;
  points: string[];
};

export const experiences: Experience[] = [
  {
    role: "Full Stack Developer & Robotics / Embedded Engineer",
    company: "Xmedia Solution (Scopex Tech Pvt Ltd)",
    date: "Sept 2025 - Present",
    location: "Chennai, IN",
    type: "MARK-IV SENIOR DEPLOYMENT",
    points: [
      "Programmed locomotion control, stabilization gaits, and remote teleoperation systems for Unitree quadruped robot using reinforcement learning & the Unitree SDK.",
      "Developed autonomous navigation, LiDAR SLAM mapping, and obstacle avoidance pipelines for Rex Robot and Service Robot platforms utilizing ROS 2 and OpenCV.",
      "Built an end-to-end Smart Office Automation platform integrating Raspberry Pi, STM32 microcontrollers, MQTT networks, and AI-driven scheduling.",
      "Architected and deployed 10+ high-traffic live commercial web platforms including Dinamani and Amaze Travel using Next.js, TypeScript, and Docker.",
      "Engineered interactive 3D product configurators with Three.js/WebGL, elevating user session retention by 25%.",
      "Designed a real-time UPS Hardware Telemetry System with PostgreSQL and WebSockets for sub-second failover monitoring.",
    ],
  },
  {
    role: "Operations & Systems Specialist",
    company: "Adani Capital Pvt Ltd",
    date: "Mar 2022 - Sept 2025",
    location: "Chennai, IN",
    type: "ENTERPRISE OPERATIONS",
    points: [
      "Directed regional IT & infrastructure operations across 50+ enterprise branches in 4 states, ensuring 99.9% network reliability.",
      "Developed automated data pipelines and VBA automation scripts, eliminating 15+ hours of weekly manual reporting tasks.",
      "Managed critical hardware deployments, system security protocols, and server infrastructure.",
    ],
  },
  {
    role: "Associate Developer Intern",
    company: "Grovita Technology Private Limited",
    date: "Nov 2021 - Feb 2022",
    location: "Chennai, IN",
    type: "CORE BACKEND LAB",
    points: [
      "Implemented Sequelize ORM and microservice endpoints for Node.js backends, reducing query latency across 5+ core modules.",
      "Collaborated on relational schema optimizations and REST API design.",
    ],
  },
];

export type ProjectCategory = "ai" | "robotics" | "embedded" | "web";

export type Project = {
  id: string;
  title: string;
  status: string;
  category: ProjectCategory;
  desc: string;
  highlights: string[];
  tech: string[];
};

export const PROJECT_FILTERS: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All Systems" },
  { id: "ai", label: "AI & GenAI" },
  { id: "robotics", label: "Robotics" },
  { id: "embedded", label: "Embedded & IoT" },
  { id: "web", label: "Web & 3D" },
];

export const projects: Project[] = [
  {
    id: "ai-interview",
    title: "AI Mock Interview Platform",
    status: "Generative AI // Full Stack Product",
    category: "ai",
    desc: "Built a full-stack AI mock-interview platform that generates role-specific interview questions, runs the interview session, and evaluates candidate answers with LLM-generated feedback so learners can practise and improve before real interviews.",
    highlights: ["Role-specific question generation with LLMs", "AI answer evaluation & feedback reports", "End-to-end full-stack build"],
    tech: ["Python", "FastAPI", "Generative AI", "LLM APIs", "React", "PostgreSQL"],
  },
  {
    id: "ai-code-conversion",
    title: "AI Code Conversion Engine",
    status: "Generative AI // Developer Tooling",
    category: "ai",
    desc: "Engineered an AI-powered tool that converts source code between programming languages and frameworks using large language models, with an agentic workflow that analyses the input code, converts it and reviews the output.",
    highlights: ["LLM-driven code translation", "Agentic analyse → convert → review workflow", "Web interface for developers"],
    tech: ["Python", "FastAPI", "Agentic AI", "LLM APIs", "Next.js", "TypeScript"],
  },
  {
    id: "ai-cork",
    title: "AI Cork — Flutter App & Windows Desktop Software",
    status: "AI Application // Mobile + Desktop",
    category: "ai",
    desc: "Developed AI Cork as a cross-platform product: a Flutter mobile app plus a packaged Windows desktop application (.exe), both connected to an AI-enabled Python backend.",
    highlights: ["Flutter cross-platform mobile app", "Packaged Windows desktop build (.exe)", "AI features served from a Python backend"],
    tech: ["Flutter", "Dart", "Python", "Generative AI", "Windows Desktop"],
  },
  {
    id: "kicad-pcb-ai",
    title: "AI-Assisted PCB Design with KiCad",
    status: "Hardware Design // AI Tooling",
    category: "embedded",
    desc: "Designed printed circuit boards in KiCad and built an AI-assisted workflow around the PCB design process, combining schematic capture and board layout with Python automation and AI.",
    highlights: ["Schematic capture & PCB layout in KiCad", "AI-assisted design workflow", "Python automation for hardware design"],
    tech: ["KiCad", "PCB Design", "Python", "Generative AI", "Embedded Hardware"],
  },
  {
    id: "mqtt-recorder",
    title: "MQTT Automatic Recording Software",
    status: "Industrial IoT // Windows Desktop",
    category: "embedded",
    desc: "Built a Windows desktop application (.exe) that subscribes to MQTT device streams and automatically records the incoming data, giving teams a hands-free log of IoT and machine telemetry.",
    highlights: ["Automatic recording of MQTT topics", "Packaged Windows desktop app (.exe)", "Reliable IoT telemetry logging"],
    tech: ["Python", "MQTT", "Windows Desktop", "IoT"],
  },
  {
    id: "unitree",
    title: "Unitree Quadruped Dog Robot Control",
    status: "Robotics R&D // Active Deployment",
    category: "robotics",
    desc: "Engineered agile quadruped locomotion gaits, stair-climbing capabilities, and real-time teleoperation interfaces using the Unitree SDK. Developed custom reinforcement learning control policies for dynamic balance on rugged terrains and integrated ROS 2 telemetry channels.",
    highlights: ["Stair-climbing locomotion gaits", "RL balance policies for rugged terrain", "Real-time teleoperation + ROS 2 telemetry"],
    tech: ["Python", "C++", "Unitree SDK", "PyTorch", "ROS 2", "Gazebo"],
  },
  {
    id: "rex",
    title: "Rex Robot — Autonomous Navigation",
    status: "Robotics & SLAM Platform",
    category: "robotics",
    desc: "Architected the perception and autonomous navigation pipeline for the Rex mobile robot. Integrated 2D/3D LiDAR sensor fusion, Cartographer SLAM, and dynamic obstacle avoidance algorithms for precise path planning in real-world industrial environments.",
    highlights: ["2D/3D LiDAR sensor fusion", "Cartographer SLAM mapping", "Dynamic obstacle avoidance + Nav2 planning"],
    tech: ["ROS 2", "Python", "C++", "LiDAR", "OpenCV", "Navigation2"],
  },
  {
    id: "service-robot",
    title: "AI Service Robot Platform",
    status: "Commercial AI & Robotics",
    category: "robotics",
    desc: "Built the comprehensive software architecture for an autonomous service robot capable of natural voice interaction, person recognition, and item delivery. Engineered NLP dialogue pipelines, computer vision tracking, and real-time telemetry dashboards.",
    highlights: ["Voice interaction + NLP dialogue", "Person recognition & CV tracking", "Live telemetry dashboards"],
    tech: ["ROS 2", "Python", "TensorFlow", "WebSockets", "FastAPI", "OpenCV"],
  },
  {
    id: "smart-office",
    title: "Smart Office Automation System",
    status: "Embedded IoT & Edge AI",
    category: "embedded",
    desc: "Engineered an enterprise-grade IoT smart office infrastructure utilizing Raspberry Pi controllers, MQTT sensor networks, and edge AI scheduling. Automated climate, lighting, and occupancy routing, reducing manual facility energy consumption by 40%.",
    highlights: ["40% lower facility energy use", "MQTT sensor mesh on Raspberry Pi / STM32", "Edge-AI scheduling with TensorFlow Lite"],
    tech: ["Python", "Raspberry Pi", "MQTT", "FastAPI", "TensorFlow Lite", "STM32"],
  },
  {
    id: "configurator",
    title: "3D Product Configurator Engine",
    status: "Interactive WebGL Graphics",
    category: "web",
    desc: "Engineered photorealistic interactive 3D product configurators using Three.js and custom GLSL shaders, elevating user session engagement by 25% with dynamic lighting, material physics, and model rendering.",
    highlights: ["+25% user session engagement", "Custom GLSL material shaders", "Dynamic lighting & real-time rendering"],
    tech: ["Three.js", "WebGL", "React Three Fiber", "TypeScript", "GLSL"],
  },
  {
    id: "ups-monitor",
    title: "Real-time UPS Hardware Monitor",
    status: "Enterprise Telemetry",
    category: "embedded",
    desc: "Designed an instantaneous hardware telemetry system utilizing PostgreSQL and WebSocket streams for real-time electrical status monitoring, voltage alert triggers, and automated failover dispatching.",
    highlights: ["Sub-second failover monitoring", "Voltage alert triggers", "WebSocket telemetry streams"],
    tech: ["PostgreSQL", "WebSockets", "Node.js", "Express", "TypeScript"],
  },
  {
    id: "appy-rover",
    title: "'Appy Rover | Scalable Travel Engine",
    status: "Production High-Concurrency",
    category: "web",
    desc: "Engineered a high-scale travel booking platform with JWT/Bcrypt security architecture and optimized MySQL indexing to handle concurrent search queries for 5,000+ travel listings with sub-millisecond latency.",
    highlights: ["5,000+ searchable travel listings", "Optimized MySQL indexing + Redis", "JWT / Bcrypt auth architecture"],
    tech: ["Next.js", "Node.js", "MySQL", "JWT", "Redis", "TypeScript"],
  },
  {
    id: "dinamani",
    title: "Dinamani Live Commercial App",
    status: "High-Traffic Production",
    category: "web",
    desc: "Architected and deployed a mission-critical commercial application using Next.js and TypeScript, ensuring ultra-fast core web vitals, server-side rendering, and seamless continuous deployment pipelines.",
    highlights: ["High-traffic production deployment", "Server-side rendering for Core Web Vitals", "Continuous deployment pipeline"],
    tech: ["Next.js", "TypeScript", "React", "Node.js", "Tailwind CSS"],
  },
];

export const skillGroups: { category: string; items: string[] }[] = [
  { category: "AI & Generative AI", items: ["Generative AI", "Agentic AI", "AI Agents", "LLM APIs", "Prompt Engineering", "AI Code Conversion", "Computer Vision", "Reinforcement Learning"] },
  { category: "Languages & Frameworks", items: ["Python", "FastAPI", "Django", "C++", "TypeScript", "JavaScript", "Next.js", "React", "Node.js", "Express", "Angular", "Flutter / Dart"] },
  { category: "Robotics & Autonomy", items: ["ROS 2", "SLAM (Cartographer / Nav2)", "LiDAR Fusion", "OpenCV", "Unitree SDK", "Gazebo", "Path Planning"] },
  { category: "Embedded, IoT & Hardware", items: ["Raspberry Pi", "Arduino", "STM32", "MQTT", "Modbus", "I2C / SPI / UART", "Sensor Fusion", "TensorFlow Lite", "KiCad PCB Design"] },
  { category: "Backend, Data & Apps", items: ["REST APIs", "WebSockets", "Microservices", "PostgreSQL", "MySQL", "Redis", "Windows Desktop Apps (.exe)", "Cross-platform Mobile Apps"] },
  { category: "3D & Interfaces", items: ["Three.js", "WebGL / GLSL", "React Three Fiber", "Babylon.js", "Tailwind CSS", "Framer Motion"] },
  { category: "DevOps & Tools", items: ["Docker", "Linux", "Git / GitHub Actions", "AWS", "Postman", "Oscilloscopes & Logic Analyzers", "Figma", "Agile/Scrum"] },
];

export const NAV_SECTIONS = [
  { id: "about", name: "About" },
  { id: "experience", name: "Experience" },
  { id: "projects", name: "Projects" },
  { id: "skills", name: "Expertise" },
  { id: "contact", name: "Contact" },
];
