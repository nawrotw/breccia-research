import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import BrecciaLogo from "@/assets/breccia-logo.svg?raw";
import BrecciaLogo6 from "@/assets/breccia-logo-6.svg?raw";

const navLinks = [
  { to: "/" as const, label: "Users" },
  { to: "/create-user" as const, label: "Create User" },
  { to: "/ant-users" as const, label: "Ant Users" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center gap-6 px-4">
        <div
          className="h-10 w-auto text-foreground [&_svg]:h-full [&_svg]:w-auto"
          dangerouslySetInnerHTML={{ __html: BrecciaLogo }}
          aria-label="Breccia Logo"
        />
         <div
          className="h-10 w-auto text-foreground [&_svg]:h-full [&_svg]:w-auto"
          dangerouslySetInnerHTML={{ __html: BrecciaLogo6 }}
          aria-label="Breccia Logo 6"
        />

        BRECCIA

        <div className="h-8 w-px bg-border" />

        <nav className="flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              activeProps={{
                className:
                  "text-sm font-medium transition-colors hover:text-primary text-primary",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
