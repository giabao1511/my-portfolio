export interface CommandOutput {
  type:
    "input" | "output" | "error" | "success" | "clear" | "exit" | "download";
  text: string;
}

const HELP_TEXT = `Available commands:
  help        - Show this help message
  about       - About bao
  skills      - View tech skills
  contact     - Contact information
  download-cv - Download CV
  clear       - Clear terminal
  exit        - Close terminal`;

const ABOUT_TEXT = `Chau Gia Bao
Software Engineer specializing in high-performance web platforms,
TypeScript ecosystem, Next.js, and distributed systems.
5+ years of hands-on experience across B2B SaaS, E-Commerce, and FinTech.`;

const SKILLS_TEXT = `Tech Arsenal:
  Languages: TypeScript, JavaScript, HTML5, CSS3
  Frontend: React, Next.js, TanStack Query, Redux Toolkit
  Backend: Node.js, Nest.js, RESTful APIs, Microservices
  Data: MongoDB, PostgreSQL, Redis
  Cloud: AWS (S3, CloudFront), Vercel
  DevOps: GitLab CI/CD, Docker, Kubernetes
  Testing: Playwright, Jest, React Testing Library`;

const CONTACT_TEXT = `Email:    giabao712411@gmail.com
Phone:    +84 339 253 073
Location: Ho Chi Minh City, Vietnam
LinkedIn: https://www.linkedin.com/in/bao-chau-gia-a2761a244
GitHub:   https://github.com/giabao1511`;

export function executeCommand(input: string): CommandOutput[] {
  const cmd = input.trim().toLowerCase();

  switch (cmd) {
    case "help":
      return [{ type: "output", text: HELP_TEXT }];
    case "about":
      return [{ type: "output", text: ABOUT_TEXT }];
    case "skills":
    case "skill":
      return [{ type: "output", text: SKILLS_TEXT }];
    case "contact":
      return [{ type: "output", text: CONTACT_TEXT }];
    case "download-cv":
    case "cv":
      return [
        { type: "success", text: "Downloading CV..." },
        { type: "download", text: "/resume.pdf" },
      ];
    case "clear":
      return [{ type: "clear", text: "" }];
    case "exit":
    case "quit":
      return [{ type: "exit", text: "" }];
    case "":
      return [];
    default:
      return [
        { type: "error", text: `Command not found: ${cmd}` },
        { type: "output", text: "Type 'help' for available commands" },
      ];
  }
}

export function getWelcomeMessage(): CommandOutput[] {
  return [
    { type: "success", text: "Welcome to bao's interactive terminal" },
    { type: "output", text: "Type 'help' for available commands" },
    { type: "output", text: "" },
  ];
}
