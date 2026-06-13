// CV data — single source of truth. Edit me to update the site.
window.CV = {
  name: "Nicky Tian",
  fullName: "Nicky (Ziyang) Tian",
  tagline: "Final-year Software Engineering student @ UoA — full-stack, systems, and a soft spot for game dev.",
  location: "Auckland, New Zealand",
  citizenship: "NZ Citizen",
  contact: {
    email: "nickytian2005@hotmail.com",
    phone: "(020) 4097 1367",
    linkedin: "Nicky Tian",
    linkedinUrl: "https://linkedin.com/in/nicky-tian",
    github: "Nicky8566",
    githubUrl: "https://github.com/Nicky8566",
  },
  summary:
    "A final-year Software Engineering (Honours) student at the University of Auckland. Experienced in full-stack projects, collaborative team environments, and applying modern technologies to build practical solutions.",
  skills: {
    Languages: ["Java", "JavaScript", "TypeScript", "Python", "C", "C#", "SQL", "HTML/CSS", "R", "MATLAB"],
    Frameworks: ["React", "Next.js", "Node", ".NET", "JavaFX", "MonoGame"],
    Tools: ["Git/GitHub", "Linux", "Firebase", "K3s / Kubernetes", "Docker", "Microchip Studio", "Proteus"],
    Practices: ["Agile / Scrum", "CI/CD", "QA", "OOP", "MVC"],
  },
  education: [
    {
      school: "University of Auckland",
      degree: "Bachelor of Software Engineering (Honours)",
      location: "Auckland, New Zealand",
      period: "2022 — Nov 2026 (expected)",
      details: [
        "Concentrations: Software Development, Databases, Operating Systems, hardware/software design",
        "Coursework: Data Structures & Algorithms, Objects & Design, Computer Organization, OOP",
      ],
    },
  ],
  experience: [
    {
      company: "Coverstaff Recruitment",
      role: "Production Worker",
      location: "Auckland, NZ",
      period: "Nov 2022 — Feb 2023",
      bullets: [
        "Worked efficiently in a fast-paced production team, hitting daily targets and maintaining workflow.",
        "Communicated clearly with team members to keep operations smooth and the environment positive.",
      ],
    },
  ],
  projects: [
    {
      name: "Solar-Powered Micro Data Centre",
      role: "Research Engineer",
      period: "Mar 2026 — Present",
      tech: ["K3s", "Raspberry Pi", "ArgoCD", "Ansible", "ARM64"],
      bullets: [
        "Designed and deployed a production-grade K3s cluster across Raspberry Pi 5 nodes for a solar-powered micro data centre, implementing a fully air-gapped GitOps pipeline with Gitea, ArgoCD, and a local CNCF Distribution Registry — automated cluster state from a single Git push.",
        "Built end-to-end Ansible automation covering preflight artifact staging, air-gap image distribution across all nodes, K3s installation, and full management-plane deployment across heterogeneous ARM64 hardware in a single command.",
        "Conducting research under university supervision on post-quantum cryptography, data sovereignty, and resilient edge infrastructure — focused on replicable, sovereign micro data centre deployments.",
      ],
    },
    {
      name: "AUSA Website — WDCC",
      role: "Full-Stack Developer",
      period: "Feb 2025 — Dec 2025",
      tech: ["React", "TypeScript", "Next.js", "Firebase", "TSOA"],
      bullets: [
        "Built the frontend with React, TypeScript, and Next.js — fast loads and responsive UI.",
        "Implemented a Firebase-powered database for dynamic content + user data in real time.",
        "Engineered secure auth using TSOA + Firebase for personalised, protected access.",
        "Worked in an Agile team of 10 — biweekly sprints, CI/CD pipelines.",
      ],
    },
    {
      name: "Project Zombie — Roguelite",
      role: "Systems Developer",
      period: "Nov 2025 — Present",
      tech: ["C", "C#", "MonoGame", "UDP", "Multiplayer"],
      bullets: [
        "Real-time game server in C — UDP networking, authoritative state, custom binary protocol, multi-player.",
        "AI via finite state machines, AABB collisions, client-side prediction for smooth 60 FPS multiplayer.",
        "Cross-platform C# / MonoGame client — network translation, entity interpolation, real-time rendering.",
      ],
    },
    {
      name: "Guess Who",
      role: "Full-Stack Developer",
      period: "Jul 2024 — Nov 2024",
      tech: ["JavaFX", "OpenAI API", "OOP/MVC"],
      bullets: [
        "JavaFX mystery game played by 30+ testers — find the thief from AI-generated clues.",
        "Built with a team of 3; tight comms + clear ownership.",
        "Used the OpenAI API for context-aware suspect responses and dynamic endings.",
        "Applied OOP + MVC for a modular, testable, extensible codebase.",
      ],
    },
    {
      name: "APParel — Interactive Web CTF Lab",
      role: "Full-Stack Developer",
      period: "Mar 2026 — Jun 2026",
      tech: ["React", "Node.js", "Express", "MongoDB", "Vercel", "GitHub Actions"],
      bullets: [
        "Built the challenges and flag submission system in React — real-time score tracking, category filtering, a paid hint system with client-side caching, and multi-state flag validation against a Node.js/Express backend.",
        "Developed and deployed the full frontend to Vercel, resolving serverless-specific issues including SPA routing failures and MongoDB connection pooling across function invocations.",
        "Contributed to a seven-person Agile team delivering a deliberately vulnerable MERN e-commerce platform with twelve embedded CTF challenges, 333 automated tests, and CI/CD via GitHub Actions.",
      ],
    },
  ],
  achievements: [
    {
      title: "1st Place — Auckland Council Climate Hackathon 2025",
      bullets: [
        "Strategy to help Aucklanders adopt Live Lightly principles in line with the city's Climate Plan.",
        "Collaborated on sustainability solutions; pitched the winning idea to judges.",
      ],
    },
    {
      title: "Best Design — DEVS × GDCC Hackathon 2025",
      bullets: [
        "ViewMe — a TikTok-style web app for showcasing coding projects via short-form videos.",
        "Addressed pain points of GitHub READMEs, improving project visibility for employers.",
        "Built with React, Tailwind CSS, and Firebase; pitched a live demo focused on UI/UX.",
      ],
    },
    {
      title: "NCEA Level 2 & 3 — Endorsed with Excellence",
      bullets: [],
    },
  ],
  clubs: [
    {
      name: "Web Development & Consulting Club (WDCC)",
      role: "Frontend & Backend Developer",
      period: "Feb 2025 — Dec 2025",
      blurb:
        "Chosen for a WDCC project team building websites for real-world users (AUSA + other clubs). Hands-on technical implementation and group collaboration.",
    },
  ],
};
