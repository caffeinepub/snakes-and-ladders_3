import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

type ModalKey = "disclaimer" | "privacy" | "about" | "contact";

const MODAL_CONTENT: Record<
  ModalKey,
  { title: string; content: React.ReactNode }
> = {
  disclaimer: {
    title: "Disclaimer",
    content: (
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>
          Snakes &amp; Ladders is provided strictly for{" "}
          <strong className="text-foreground">
            entertainment purposes only
          </strong>
          . No real money, prizes, or monetary value of any kind is involved in
          gameplay.
        </p>
        <p>
          We make no guarantees of continuous uptime, data persistence, or
          uninterrupted service. The game may be taken offline for maintenance
          or updates at any time without prior notice.
        </p>
        <p>
          Results of dice rolls are generated pseudo-randomly and are not
          representative of any real-world outcomes. The developers accept no
          liability for any decisions made based on gameplay.
        </p>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    content: (
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>
          We take your privacy seriously. Here is exactly what we collect and
          why:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>
            <strong className="text-foreground">Win counts</strong> — anonymous
            tally of wins per player name, stored on-chain. No account or
            identity is required.
          </li>
          <li>
            <strong className="text-foreground">No personal data</strong> — we
            do not collect email addresses, device fingerprints, IP addresses,
            or any personally identifiable information.
          </li>
          <li>
            <strong className="text-foreground">No third-party sharing</strong>{" "}
            — your data is never sold, rented, or shared with any third party.
          </li>
          <li>
            <strong className="text-foreground">No cookies</strong> — we do not
            use tracking cookies or third-party analytics.
          </li>
        </ul>
        <p>
          By playing, you acknowledge that player names you choose are stored as
          anonymous win-count keys on the Internet Computer blockchain.
        </p>
      </div>
    ),
  },
  about: {
    title: "About Us",
    content: (
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p className="text-foreground font-semibold text-base">
          🎲 Snakes &amp; Ladders — reimagined for the modern web.
        </p>
        <p>
          We are a small team of game enthusiasts who believe that classic board
          games deserve a fresh coat of paint. Snakes &amp; Ladders has
          delighted players for centuries, and we wanted to bring that same joy
          to browser-based multiplayer.
        </p>
        <p>
          This version features animated dice rolls, colorful player tokens,
          real-time sound effects, and persistent win tracking — all built on
          the Internet Computer blockchain for a decentralized, always-on
          experience.
        </p>
        <p>
          Whether you are playing with family across the table or friends across
          the world, we hope this game brings as much laughter to you as it has
          to us.
        </p>
        <p className="text-foreground italic">
          Built with ❤️ for fun multiplayer sessions.
        </p>
      </div>
    ),
  },
  contact: {
    title: "Contact Us",
    content: null, // rendered separately
  },
};

function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message received! We'll get back to you soon.");
    setName("");
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Have a question, suggestion, or found a bug? We'd love to hear from you.
      </p>
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border border-border">
        <span className="text-xs text-muted-foreground">📧</span>
        <a
          href="mailto:support@snakesandladders.game"
          className="text-sm text-primary hover:underline"
        >
          support@snakesandladders.game
        </a>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label
            htmlFor="contact-name"
            className="text-xs text-muted-foreground uppercase tracking-wide"
          >
            Your Name
          </Label>
          <Input
            id="contact-name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-muted/30 border-border"
            data-ocid="contact.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="contact-message"
            className="text-xs text-muted-foreground uppercase tracking-wide"
          >
            Message
          </Label>
          <Textarea
            id="contact-message"
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="bg-muted/30 border-border resize-none"
            data-ocid="contact.textarea"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          data-ocid="contact.submit_button"
        >
          Send Message
        </Button>
      </form>
    </div>
  );
}

interface FooterLinkModalProps {
  modalKey: ModalKey;
  label: string;
  variant?: "light" | "dark";
}

function FooterLinkModal({
  modalKey,
  label,
  variant = "dark",
}: FooterLinkModalProps) {
  const { title, content } = MODAL_CONTENT[modalKey];
  const linkClass =
    variant === "light"
      ? "text-white/40 hover:text-white/70 transition-colors cursor-pointer text-xs underline-offset-2 hover:underline"
      : "text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-xs underline-offset-2 hover:underline";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={linkClass}
          data-ocid={`footer.${modalKey}.open_modal_button`}
        >
          {label}
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md"
        data-ocid={`footer.${modalKey}.dialog`}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          {modalKey === "contact" ? <ContactForm /> : content}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface FooterLinksProps {
  variant?: "light" | "dark";
}

export function FooterLinks({ variant = "dark" }: FooterLinksProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <FooterLinkModal
        modalKey="disclaimer"
        label="Disclaimer"
        variant={variant}
      />
      <span
        className={
          variant === "light" ? "text-white/20 text-xs" : "text-border text-xs"
        }
      >
        ·
      </span>
      <FooterLinkModal
        modalKey="privacy"
        label="Privacy Policy"
        variant={variant}
      />
      <span
        className={
          variant === "light" ? "text-white/20 text-xs" : "text-border text-xs"
        }
      >
        ·
      </span>
      <FooterLinkModal modalKey="about" label="About Us" variant={variant} />
      <span
        className={
          variant === "light" ? "text-white/20 text-xs" : "text-border text-xs"
        }
      >
        ·
      </span>
      <FooterLinkModal
        modalKey="contact"
        label="Contact Us"
        variant={variant}
      />
    </div>
  );
}
