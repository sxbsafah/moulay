import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import FormErrors from "@/components/FormErrors";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router";

type OTPFormProps = {
  email: string;
  reset?: boolean;
  password?: string;
};

const LENGTH = 6;

const otpSchema = z.object({
  code: z
    .string()
    .length(LENGTH, `Le code doit contenir ${LENGTH} chiffres`)
    .regex(/^\d+$/, "Le code doit contenir uniquement des chiffres"),
});

function OTPForm({ email, reset, password }: OTPFormProps) {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (_data: z.infer<typeof otpSchema>) => {
    try {
      if (reset && password) {
        console.log(password, email, _data.code);
        await signIn("password", {
          flow: "reset-verification",
          email,
          code: _data.code,
          newPassword: password,
        });
        return await navigate("/");
      } else {
        const result = await signIn("password", {
          flow: "email-verification",
          email,
          code: _data.code,
        });
        if (result.signingIn) return await navigate("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Could not verify code") {
          form.setError("code", {
            type: "server",
            message: "Le code de vérification est invalide.",
          });
          return;
        }
      }
      form.setError("root", {
        type: "server",
        message: "Échec de la vérification du code. Veuillez réessayer.",
      });
    }
  };
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Vérifier le code</CardTitle>
        <CardDescription className="text-sm">
          {`Nous avons envoyé un code à ${LENGTH} chiffres`}
          {email ? ` à ${email}.` : "."}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="mb-4">
              <FormErrors errors={form.formState.errors} />
            </div>
          )}
          <FieldGroup className="space-y-4">
            <Field data-invalid={!!form.formState.errors.code}>
              <FieldLabel htmlFor="otp" className="text-sm sm:text-base">
                Code de vérification
              </FieldLabel>
              <Controller
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <InputOTP
                    maxLength={LENGTH}
                    id="otp"
                    required
                    value={field.value}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  >
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                      {Array.from({ length: LENGTH }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
              <FieldDescription className="text-xs sm:text-sm mt-2">
                Saisissez le code de {LENGTH} chiffres envoyé par e‑mail.
              </FieldDescription>
              {form.formState.errors.code && (
                <div className="mt-2">
                  <FieldError errors={[form.formState.errors.code]} />
                </div>
              )}
            </Field>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="inline-flex items-center">
                  <Spinner className="mr-2 h-4 w-4" />
                </span>
              ) : (
                "Vérifier"
              )}
            </Button>
            <FieldDescription className="text-xs sm:text-sm text-center">
              Vous n'avez pas reçu le code ?
              <Button asChild variant="link" size="sm" className="px-1 h-auto">
                <Link to="/connexion">Se reconnecter</Link>
              </Button>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export default OTPForm;
