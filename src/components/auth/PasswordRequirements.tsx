import { Check } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
}

export default function PasswordRequirements({
  password,
}: PasswordRequirementsProps) {
  const requirements = [
    { label: "8 caractères min.", met: password.length >= 8 },
    { label: "Minuscule", met: /[a-z]/.test(password) },
    { label: "Majuscule", met: /[A-Z]/.test(password) },
    { label: "Chiffre", met: /[0-9]/.test(password) },
    { label: "Spécial", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  return (
    <div className="mt-4 rounded-[var(--radius)] border border-dashed bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground font-medium mb-2.5">
        Le mot de passe doit contenir :
      </p>
      <ul className="text-xs grid grid-cols-2 gap-x-3 gap-y-2">
        {requirements.map((req) => (
          <li
            key={req.label}
            className={`flex items-center gap-2 transition-all duration-200 ${
              req.met ? "text-foreground" : "text-muted-foreground/70"
            }`}
          >
            <span
              className={`flex items-center justify-center w-4 h-4 rounded-full transition-all duration-200 ${
                req.met ? "bg-primary/10" : "bg-muted"
              }`}
            >
              {req.met ? (
                <Check className="w-3 h-3 text-primary" />
              ) : (
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40"></span>
              )}
            </span>
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
