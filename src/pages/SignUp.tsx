import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import PasswordRequirements from "@/components/auth/PasswordRequirements";
import FormErrors from "@/components/FormErrors";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router";
import { signUpSchema } from "@/schemas/schemas";
import { ConvexError } from "convex/values";
import { useState } from "react";
import VerifyOtp from "@/components/VerifyOTP";
import { handleErrors } from "@/lib/handleErrors";


export default function SignUp() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const result = await signIn("password", {
        flow: "signUp",
        password: data.password,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
      });
      if (!result.signingIn) return setStep("otp");
      return await navigate("/");
    } catch (error: any) {
      if (error instanceof ConvexError) {
        handleErrors(error, form.setError);
      } else {
        if (error instanceof Error) {
          if (error.message.includes("already exists")) {
            form.setError("email", {
              type: "server",
              message: "Un compte avec cet e-mail existe déjà.",
            });
          } else {
            form.setError("root", {
              type: "server",
              message: "Échec de la création du compte. Veuillez réessayer.",
            });
          }
        }
      }
    }
  };

  return (
    step === "signup" ? (
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
              aria-label="go home"
              className="mx-auto block w-fit font-serif text-2xl md:text-3xl font-medium tracking-wide"
            >
              MOULAY
            </Link>
            <p className="text-sm mt-2">
              Bienvenue ! Créez un compte pour commencer
            </p>
          </div>

          <FormErrors errors={form.formState.errors} />

          <div className="mt-6">
            <FieldGroup>
              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="firstname"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="firstname">Prénom</FieldLabel>
                      <Input
                        {...field}
                        id="firstname"
                        aria-invalid={fieldState.invalid}
                        autoComplete="given-name"
                        className={
                          fieldState.invalid ? "border-destructive" : ""
                        }
                      />
                    </Field>
                  )}
                />
                <Controller
                  name="lastname"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lastname">Nom</FieldLabel>
                      <Input
                        {...field}
                        id="lastname"
                        aria-invalid={fieldState.invalid}
                        autoComplete="family-name"
                        className={
                          fieldState.invalid ? "border-destructive" : ""
                        }
                      />
                    </Field>
                  )}
                />
              </div>

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
                      autoComplete="new-password"
                      className={fieldState.invalid ? "border-destructive" : ""}
                    />
                    <PasswordRequirements password={form.watch("password")} />
                  </Field>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Spinner /> : "Créer un compte"}
              </Button>
            </FieldGroup>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Vous avez déjà un compte ?
            <Button asChild variant="link" className="px-2">
              <Link to="/connexion">Se connecter</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
    ) : <VerifyOtp email={form.watch("email")}  />
);
}
