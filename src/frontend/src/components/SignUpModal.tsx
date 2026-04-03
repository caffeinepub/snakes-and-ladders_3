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
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SignUpModalProps {
  variant?: "header" | "standalone";
}

export function SignUpModal({ variant = "header" }: SignUpModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError("");
    toast.info("Sign up coming soon! 🎉");
    setOpen(false);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const trigger =
    variant === "header" ? (
      <Button
        size="sm"
        className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1.5 h-8"
        data-ocid="header.signup.open_modal_button"
      >
        <UserPlus size={13} />
        Sign Up
      </Button>
    ) : (
      <Button
        size="sm"
        className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm gap-2"
        data-ocid="setup.signup.open_modal_button"
      >
        <UserPlus size={14} />
        Sign Up
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm" data-ocid="signup.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <UserPlus size={18} className="text-primary" />
            Create Account
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="signup-name"
              className="text-xs text-muted-foreground uppercase tracking-wide"
            >
              Full Name
            </Label>
            <Input
              id="signup-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="bg-muted/30 border-border"
              data-ocid="signup.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="signup-email"
              className="text-xs text-muted-foreground uppercase tracking-wide"
            >
              Email
            </Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="bg-muted/30 border-border"
              data-ocid="signup.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="signup-password"
              className="text-xs text-muted-foreground uppercase tracking-wide"
            >
              Password
            </Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="bg-muted/30 border-border"
              data-ocid="signup.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="signup-confirm"
              className="text-xs text-muted-foreground uppercase tracking-wide"
            >
              Confirm Password
            </Label>
            <Input
              id="signup-confirm"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
              }}
              autoComplete="new-password"
              className="bg-muted/30 border-border"
              data-ocid="signup.input"
            />
            {passwordError && (
              <p
                className="text-xs text-destructive mt-1"
                data-ocid="signup.error_state"
              >
                {passwordError}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full mt-1"
            data-ocid="signup.submit_button"
          >
            Create Account
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account? Authentication is coming soon.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
