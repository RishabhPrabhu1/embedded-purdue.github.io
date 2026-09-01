// app/projects/_data.ts
import { Cpu, Zap, Wifi, Camera, Car, Watch } from "lucide-react";

export type Project = {
  slug: string;
  title: string;
  description?: string;
  technologies: string[];
  status: "Active" | "Planned" | "Completed";
  icon?: any;
  image?: string;
  pm?: string;
  semester?: string;
  /** Where “Read more” should go (README.md or long-form doc) */
  readmeUrl?: string; // can be external OR /projects/[slug]
};

export const projects: Project[] = [
  // {
  //   slug: "agrovolo",
  //   title: "Agrovolo (Aerial Farm Imaging)",
  //   description:
  //     "Drone that captures field images for farmers; focus on control, wireless links, and UI.",
  //   technologies: ["Control Systems", "Wireless", "PCB", "High-Speed", "UI"],
  //   status: "Active",
  //   icon: Camera,
  //   image: "/projects/agrovolo-1.jpg",
  //   pm: "PM: Tim Ausec",
  //   semester: "Fall 2025",
  //   readmeUrl: "/projects/agrovolo", // local details page
  // },
  {
    slug: "berryweather",
    title: "BerryWeather (IoT Weather Station)",
    description:
      "Sensor-equipped wireless weather station on Pi/MCU with power-conscious design.",
    technologies: ["Raspberry Pi OS", "Sensors", "Embedded C", "Schematic/PCB", "Power"],
    status: "Completed",
    icon: Wifi,
    image: "/projects/logo.png",
    pm: "PM: Connor Powell",
    semester: "Fall 2025",
    readmeUrl: "/projects/berryweather",
  },
  {
    slug: "harmonicore",
    title: "HarmoniCore (FPGA DSP Autotune)",
    description: "FPGA-based DSP core that autotunes your voice in real time.",
    technologies: ["FPGA/HDL", "DSP (Python)", "PCB/Bringup", "Audio"],
    status: "Active",
    icon: Zap,
    image: "/projects/harmonicore-1.jpg",
    pm: "PM: Varun Vaidyanathan",
    semester: "Fall 2025",
    readmeUrl: "/projects/harmonicore",
  },
  {
    slug: "slayterhil",
    title: "slayterHiL (Hardware-in-the-Loop)",
    description:
      "Make the drone think it’s flying—break it in software before it breaks itself.",
    technologies: ["RTOS (C)", "C++ Systems", "Board Bringup", "Wi-Fi/BLE"],
    status: "Active",
    icon: Cpu,
    image: "/projects/slayterHIL-1.jpg",
    pm: "PM: Alex Aylward",
    semester: "Fall 2025",
    readmeUrl: "/projects/slayterhil",
  },
  {
    slug: "bb8",
    title: "BB-8 (Mobile Robot)",
    description:
      "“Circle guy” from Star Wars—vision + wireless + motor/PID control.",
    technologies: ["Computer Vision", "Wireless", "Motor Control", "PID"],
    status: "Active",
    icon: Car,
    image: "/projects/bb8-1.jpg",
    pm: "PM: Tom Concannon",
    semester: "Fall 2025",
    readmeUrl: "/projects/bb8",
  },
  {
    slug: "micropiano",
    title: "MicroPiano",
    description:
      "Mini piano using hall sensors and an STM32; analog front-end + KiCad.",
    technologies: ["STM32 (C)", "Peripherals", "Analog", "KiCad", "CAD"],
    status: "Active",
    icon: Zap,
    image: "/projects/logo.png",
    pm: "PM: Felix Liu",
    semester: "Fall 2025",
    readmeUrl: "/projects/micropiano",
  },
  {
    slug: "eyecue",
    title: "EyeCue (Hands-Free Pointer)",
    description:
      "Blink/eyebrow/gaze-driven cursor using CV on Pi; accessibility oriented.",
    technologies: ["Computer Vision", "Raspberry Pi OS", "Python/C", "Mech/CAD"],
    status: "Active",
    icon: Camera,
    image: "/projects/eyecue-1.jpg",
    pm: "PMs: Katherine M, Garima T, Aarushi D, Shruthi A",
    semester: "Fall 2025",
    readmeUrl: "/projects/eyecue",
  },
  {
    slug: "digital-ops",
    title: "Digital Operations",
    description:
      "Club website + workflow automation for media intake and requests.",
    technologies: ["TypeScript", "Astro/Next", "Tailwind", "APIs", "Automation"],
    status: "Completed",
    icon: Cpu,
    image: "/projects/digital-ops-1.jpg",
    pm: "PM: Trevor Antle",
    semester: "Fall 2025",
    readmeUrl: "/projects/digital-ops",
  },
  {
    slug: "smart-watch",
    title: "Smart Watch",
    description:
      "A smart watch for the people! Build your own wearable with ESP32, sensors, and custom firmware.",
    technologies: ["ESP32", "PCB Design", "Data Storage", "Sensors", "Wireless", "App Design", "Watch Mechanics"],
    status: "Completed",
    icon: Watch,
    image: "/projects/logo.png",
    pm: "PM: Patrick Shea",
    semester: "Fall 2025",
    readmeUrl: "/projects/smart-watch",
  },
  {
    slug: "gest",
    title: "Gest",
    description:
      "Gest senses your movements and your device responds instantly. That's what it means to #GestUp!",
    technologies: ["Wireless", "Microcontroller", "Sensors", "IMU", "App Design"],
    status: "Completed",
    icon: Wifi,
    image: "/projects/gest-1.jpg",
    pm: "PM: Jain Iftesam",
    semester: "Spring 2025",
    readmeUrl: "/projects/gest",
  },
  {
    slug: "purdudraw",
    title: "PurduDraw",
    description:
      "A modern embedded take on a classic mechanical drawing toy—accurate, fully functioning drawing robot.",
    technologies: ["Wireless", "Microcontroller", "Sensors", "IMU", "App Design"],
    status: "Completed",
    icon: Wifi,
    image: "/projects/purdudraw-1.jpg",
    pm: "PM: Connor Powell",
    semester: "Spring 2025",
    readmeUrl: "/projects/purdudraw",
  },
  {
    slug: "mssd",
    title: "MSSD",
    description:
      "Mechanical Seven Segment Display that flips mechanical segments using a notched, servo-driven shaft.",
    technologies: ["Wireless", "Microcontroller", "Sensors", "IMU", "App Design", "Stopwatch", "Timer", "Counter"],
    status: "Completed",
    icon: Wifi,
    image: "/projects/mssd-1.jpg",
    pm: "PM: Tom Concannon",
    semester: "Spring 2025",
    readmeUrl: "/projects/mssd",
  },
];

export const allStatuses: Array<Project["status"]> = ["Active", "Planned", "Completed"];

export function collectTechs(list: Project[]) {
  return Array.from(new Set(list.flatMap((p) => p.technologies))).sort((a, b) => a.localeCompare(b));
}
export function collectSemesters(list: Project[]) {
  return Array.from(new Set(list.map((p) => p.semester).filter(Boolean) as string[])).sort((a, b) =>
    a.localeCompare(b)
  );
}