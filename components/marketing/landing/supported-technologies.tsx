import {
  SiNodedotjs,
  SiPython
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

const technologies = [
  {
    name: "Node.js",
    icon: SiNodedotjs,
    color: "#339933",
  },
  {
    name: "Python",
    icon: SiPython,
    color: "#3776AB",
  },
  {
    name: "Java",
    icon: FaJava,
    color: "#007396",
  }
];

const SupportedTechnologies = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col px-6 py-24 sm:py-32">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-pretty font-bold text-3xl tracking-tight sm:text-5xl leading-tight">
          Supported{" "}
          <span className="text-primary">Runtimes</span>
        </h2>
        <p className="mt-4 text-balance text-center text-muted-foreground text-lg max-w-2xl mx-auto">
          Deploy anywhere with our language-agnostic SDK
        </p>
      </div>

      {/* Technologies Grid */}
      <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-4 ">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="group relative flex flex-col max-w-40 min-w-40 items-center justify-center rounded-xl border border-border/50 bg-card p-6 transition-[border-color,box-shadow,transform] duration-250 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)] hover:-translate-y-1"
          >
            {/* Icon with glow */}
            <div className="relative">
              <div
                className="absolute inset-0 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-40"
                style={{ backgroundColor: tech.color }}
              />
              <tech.icon
                className="relative h-10 w-10 transition-transform duration-200 group-hover:scale-110"
                style={{ color: tech.color }}
              />
            </div>

            {/* Name */}
            <span className="mt-3 text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
              {tech.name}
            </span>
          </div>
        ))}
      </div>

      {/* Additional context */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">More runtimes coming soon:</span> Go, Ruby, PHP, Rust, .NET, Deno
        </p>
      </div>
    </div>
  );
};

export default SupportedTechnologies;