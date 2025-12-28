import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordResetSchema } from "@/schemas/schemas";
import { z } from "zod";
import FormErrors from "@/components/FormErrors";
import PasswordRequirements from "@/components/auth/PasswordRequirements";
import { Spinner } from "@/components/ui/spinner";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import VerifyOtp from "@/components/VerifyEmail";

export default function ForgotPassword() {
  const { signIn } = useAuthActions();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { email: "", newPassword: "", confirmPassword: "" },
  });
  const [step, setStep] = useState<"reset" | "otp">("reset");

  const onSubmit = async (values: z.infer<typeof passwordResetSchema>) => {
    try {
      await signIn("password", {
        flow: "reset",
        email: values.email,
      });
      return setStep("otp");
    } catch {
      setError("root", {
        type: "server",
        message:
          "Impossible de réinitialiser le mot de passe. Veuillez réessayer.",
      });
    }
  };

  return step === "reset" ? (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link
              to="/"
              aria-label="aller à l'accueil"
              className="mx-auto block w-fit font-serif text-2xl md:text-3xl font-medium tracking-wide"
            >
              MOULAY
            </Link>
            <p className="text-sm mt-2">
              Réinitialisez votre mot de passe en saisissant votre e‑mail et
              votre nouveau mot de passe
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <FormErrors errors={errors} />

            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Adresse e‑mail
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="email"
                    id="email"
                    placeholder="nom@exemple.com"
                    aria-invalid={fieldState.invalid}
                    className={fieldState.invalid ? "border-destructive" : ""}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="block text-sm">
                Nouveau mot de passe
              </Label>
              <Controller
                name="newPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    className={fieldState.invalid ? "border-destructive" : ""}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="block text-sm">
                Confirmer le mot de passe
              </Label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="password"
                    id="confirmPassword"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    className={fieldState.invalid ? "border-destructive" : ""}
                  />
                )}
              />
            </div>
            <PasswordRequirements password={watch("newPassword")} />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <Spinner className="mr-2 h-4 w-4" />
                </span>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Après validation, un code de vérification sera envoyé à votre
              adresse e‑mail.
            </p>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Vous vous souvenez de votre mot de passe ?
            <Button asChild variant="link" className="px-2">
              <Link to="/connexion">Se connecter</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  ) : (
    <VerifyOtp
      email={watch("email")}
      password={watch("newPassword")}
      reset={true}
    />
  );
}
