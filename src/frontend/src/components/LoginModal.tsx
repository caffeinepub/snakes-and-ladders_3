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
import { LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LoginModalProps {
  variant?: "header" | "standalone";
}

export function LoginModal({ variant = "header" }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Login coming soon! 🔐");
    setOpen(false);
    setEmail("");
    setPassword("");
  };

  const trigger =
    variant === "header" ? (
      <Button
        variant="outline"
        size="sm"
        className="border-border/60 hover:border-primary/60 hover:text-primary text-xs gap-1.5 h-8"
        data-ocid="header.login.open_modal_button"
      >
        <LogIn size={13} />
        Login
      </Button>
    ) : (
      <Button
        variant="outline"
        size="sm"
        className="border-white/30 text-white/80 hover:bg-white/10 hover:border-white/50 hover:text-white text-sm gap-2"
        data-ocid="setup.login.open_modal_button"
      >
        <LogIn size={14} />
        Login
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm" data-ocid="login.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <LogIn size={18} className="text-primary" />
            Welcome Back
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="login-email"
              className="text-xs text-muted-foreground uppercase tracking-wide"
            >
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="bg-muted/30 border-border"
              data-ocid="login.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="login-password"
              className="text-xs text-muted-foreground uppercase tracking-wide"
            >
              Password
            </Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="bg-muted/30 border-border"
              data-ocid="login.input"
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-1"
            data-ocid="login.submit_button"
          >
            Login
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Don't have an account? Authentication is coming soon.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
