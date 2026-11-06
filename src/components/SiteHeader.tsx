import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";

type SiteHeaderProps = {
  onCtaClick?: () => void;
  hideCta?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  extraNav?: ReactNode;
};

export const SiteHeader = ({ onCtaClick, hideCta, ctaLabel, ctaHref, extraNav }: SiteHeaderProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      navigate("/family-based-quiz", { state: { openQuiz: true } });
    }
  };

  const buttonClass = "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.02]";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between gap-6">
        <a href="/family-based-quiz" className="flex items-center shrink-0" aria-label="Taghavi Immigration Law">
          <img src={logo} alt="Taghavi Immigration Law" className="h-7 md:h-8 w-auto" />
        </a>
        {extraNav}
        {!hideCta && (
          ctaHref ? (
            <Button asChild size="lg" className={buttonClass}>
              <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                {ctaLabel ?? "Take the Free Quiz Now"}
              </a>
            </Button>
          ) : (
            <Button onClick={handleClick} size="lg" className={buttonClass}>
              {ctaLabel ?? "Take the Free Quiz Now"}
            </Button>
          )
        )}
      </div>
    </header>
  );
};

