import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import FormErrors from "@/components/FormErrors";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { signInSchema } from "@/schemas/schemas";
import { useState } from "react";
import VerifyOtp from "@/components/VerifyOTP";

export default function SignIn() {
  const [step, setStep] = useState<"signin" | "otp">("signin");
  const { signIn } = useAuthActions();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await signIn("password", {
        flow: "signIn",
        email: data.email,
        password: data.password,
      });
      if (result.signingIn) return await navigate("/");
      return setStep("otp");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Invalid")) {
          return form.setError("root", {
            type: "server",
            message:
              "Échec de la connexion. Veuillez vérifier vos informations.",
          });
        }
        form.setError("root", {
          type: "server",
          message: "Une erreur est survenue. Veuillez réessayer.",
        });
      }
    }
  };

  return step === "signin" ? (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        id="sign-in-form"
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
        onSubmit={form.handleSubmit(onSubmit)}
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
              Bienvenue ! Connectez-vous pour continuer
            </p>
          </div>

          <FormErrors errors={form.formState.errors} />

          <div className="mt-6">
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      autoComplete="email"
                      className={fieldState.invalid ? "border-destructive" : ""}
                    />
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                      <Button asChild variant="link" size="sm">
                        <Link
                          to="/mot-de-passe-oublie"
                          className="link intent-info variant-ghost text-sm"
                        >
                          Mot de passe oublié ?
                        </Link>
                      </Button>
                    </div>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="current-password"
                      className={fieldState.invalid ? "border-destructive" : ""}
                    />
                  </Field>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Spinner /> : "Se connecter"}
              </Button>
            </FieldGroup>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Vous n'avez pas de compte ?
            <Button asChild variant="link" className="px-2">
              <Link to="/inscription">Créer un compte</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  ) : <VerifyOtp email={form.watch("email")}  />;
}
