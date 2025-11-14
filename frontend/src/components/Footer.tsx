import {
  Map,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  ExternalLink,
  Smartphone,
  Mail,
} from "lucide-react";

const APP_LINKS = {
  ios: "#",
  android: "#",
};

const SOCIAL_LINKS = {
  x: "#",
  instagram: "#",
  linkedin: "#",
  github: "https://github.com/alitchmore/west-recovery-map-",
  email: "mailto:info@westrecovery.org",
};

const columnHeading =
  "text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-3";

export default function Footer({
  navigateTo,
}: {
  // navigateTo(view, optionalAnchor)
  navigateTo: (view: "landing" | "public" | "admin", anchor?: string) => void;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-10 space-y-8 text-sm">
        {/* 4-column layout */}
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Column 1: Brand + tagline + app links */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="West Recovery Map"
                className="h-8 w-8"
              />
              <span className="text-base font-semibold">
                West Recovery Map
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Community-powered updates to guide relief across Jamaica’s
              western parishes.
            </p>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Get the app
              </p>
              <div className="flex flex-wrap md:flex-nowrap gap-2">
                <a
                  href={APP_LINKS.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 border border-border hover:bg-muted transition-colors text-xs font-medium"
                >
                  <Smartphone className="h-4 w-4" />
                  App Store
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={APP_LINKS.android}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 border border-border hover:bg-muted transition-colors text-xs font-medium"
                >
                  <Smartphone className="h-4 w-4" />
                  Google Play
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={() => navigateTo("public")}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-border hover:bg-muted transition-colors text-xs font-medium"
                >
                  <Map className="h-4 w-4" />
                  Use Web App
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className={columnHeading}>Product</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigateTo("landing", "#map")}
                  className="text-left text-muted-foreground hover:underline"
                >
                  Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("public")}
                  className="text-left text-muted-foreground hover:underline"
                >
                  Submit Report
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("admin")}
                  className="text-left text-muted-foreground hover:underline"
                >
                  Coordinator Login
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources (incl. legal) */}
          <div>
            <h4 className={columnHeading}>Resources</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigateTo("landing", "#faq")}
                  className="text-left text-muted-foreground hover:underline"
                >
                  FAQs
                </button>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:underline"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:underline">
                  Data Use
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:underline">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:underline">
                  Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact + socials */}
          <div>
            <h4 className={columnHeading}>Contact</h4>
            <ul className="space-y-2 mb-4">
              <li>
                <a
                  href={SOCIAL_LINKS.email}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  info@westrecovery.org
                </a>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Kingston, Jamaica 🇯🇲
                </span>
              </li>
            </ul>

            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Follow
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
              >
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© {year} West Recovery Team — Made in Jamaica 🇯🇲</span>
          <span>
            Data &amp; Map attribution: OpenStreetMap contributors · Leaflet
          </span>
        </div>
      </div>
    </footer>
  );
}
