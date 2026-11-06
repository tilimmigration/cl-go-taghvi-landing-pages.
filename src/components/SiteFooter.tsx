import { Link } from "react-router-dom";

const legalLinks = [
  { href: "https://tilimmigration.com/terms-and-conditions", label: "Terms and Conditions", external: true },
  { href: "https://tilimmigration.com/privacy-policy", label: "Privacy Policy", external: true },
  { href: "/cookie-policy", label: "Cookie Policy", external: false },
  { href: "/do-not-sell-my-info", label: "Do Not Sell My Info", external: false },
  { href: "/ccpa", label: "CCPA", external: false },
  { href: "/sitemap", label: "Sitemap", external: false },
];

export const SiteFooter = () => (
  <footer className="border-t border-border/60 bg-secondary text-secondary-foreground">
    <div className="container flex flex-col items-center gap-4 py-8 md:flex-row md:justify-between">
      <p className="text-sm text-secondary-foreground/80 text-center md:text-left">
        © 2026 Taghavi Immigration Law
      </p>
      <nav
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-secondary-foreground/70"
        aria-label="Legal"
      >
        {legalLinks.map((link, i) => (
          <span key={link.label} className="flex items-center gap-x-4">
            {i > 0 && <span aria-hidden="true" className="text-secondary-foreground/30">·</span>}
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary-glow"
              >
                {link.label}
              </a>
            ) : (
              <Link to={link.href} className="transition-colors hover:text-primary-glow">
                {link.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </div>
  </footer>
);
