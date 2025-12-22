import { AlertCircle } from "lucide-react";
import { FieldErrors } from "react-hook-form";

interface FormErrorsProps {
  errors: FieldErrors;
}

export default function FormErrors({ errors }: FormErrorsProps) {
  const errorMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean) as string[];

  if (errorMessages.length === 0) return null;

  return (
    <div className="mt-6 rounded-[var(--radius)] border border-destructive/50 bg-destructive/5 p-3">
      <div className="flex items-center gap-2 text-destructive mb-2">
        <AlertCircle className="w-4 h-4" />
        <p className="text-sm font-medium">
          Veuillez corriger les erreurs suivantes :
        </p>
      </div>
      <ul className="text-xs text-destructive/90 space-y-1 pl-6 list-disc">
        {errorMessages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
