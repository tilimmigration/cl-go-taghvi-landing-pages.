import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.svg";
import "@/styles/case-studies.css";

// Register the <image-slot> custom element used by the case study HTML
// templates. Renders a dashed placeholder box with an icon + label so
// content owners can see exactly where each image goes.
if (typeof window !== "undefined" && !customElements.get("image-slot")) {
  class ImageSlot extends HTMLElement {
    connectedCallback() {
      const placeholder = this.getAttribute("placeholder") || "Image";
      const radius = this.getAttribute("radius") || "24";
      this.style.display = "flex";
      this.style.alignItems = "center";
      this.style.justifyContent = "center";
      this.style.background = "#F1EFEA";
      this.style.border = "1.5px dashed #C9C4BB";
      this.style.borderRadius = `${radius}px`;
      this.style.color = "#6B7280";
      this.style.textAlign = "center";
      this.style.padding = "24px";
      this.style.boxSizing = "border-box";
      this.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;font:500 14px/1.4 Inter,sans-serif;color:#7A7468;">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#B7B0A3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span>${placeholder.replace(/</g, "&lt;")}</span>
        </div>
      `;
    }
  }
  customElements.define("image-slot", ImageSlot);
}


export type CaseStudyKey = "family-immigration" | "employment-talent" | "removal-defense-asylum";

type Props = {
  html: string;
  title: string;
  description: string;
  activeKey: CaseStudyKey;
};

export const CaseStudyLayout = ({ html, title, description, activeKey }: Props) => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [title, description]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="case-study-page">
      <header className="site">
        <div className="wrap bar">
          <a
            className="logo"
            href="https://tilimmigration.com/"
            aria-label="Taghavi Immigration Law"
          >
            <img
              src={logo}
              alt="Taghavi Immigration Law"
              style={{ height: 32, width: "auto", filter: "brightness(0) invert(1)" }}
            />
          </a>
          <nav className="main">
            <a href="https://tilimmigration.com/for-individuals">For Individuals</a>
            <a href="https://tilimmigration.com/for-employers">For Employers</a>
            <a href={`/case-studies/${activeKey}`} className="current">
              Case Studies
            </a>
            <a href="https://tilimmigration.com/blog">Blog</a>
            <a href="https://tilimmigration.com/about-us">About Us</a>
          </nav>
          <div className="header-cta">
            <a href="https://tilimmigration.com/login" className="login">
              Login
            </a>
            <a
              href="https://tilimmigration.com/schedule-a-case-evaluation"
              className="btn btn-primary"
            >
              Schedule a Case Evaluation
            </a>
          </div>
          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="case-study-mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div
          id="case-study-mobile-nav"
          className={`mobile-nav ${menuOpen ? "open" : ""}`}
        >
          <nav className="mobile-nav-links">
            <a href="https://tilimmigration.com/for-individuals">For Individuals</a>
            <a href="https://tilimmigration.com/for-employers">For Employers</a>
            <a href={`/case-studies/${activeKey}`} className="current">
              Case Studies
            </a>
            <a href="https://tilimmigration.com/blog">Blog</a>
            <a href="https://tilimmigration.com/about-us">About Us</a>
            <a href="https://tilimmigration.com/login">Login</a>
          </nav>
          <a
            href="https://tilimmigration.com/schedule-a-case-evaluation"
            className="btn btn-primary mobile-nav-cta"
          >
            Schedule a Case Evaluation
          </a>
        </div>
      </header>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
