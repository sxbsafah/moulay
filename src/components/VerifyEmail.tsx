import { useSearchParams } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  
  const resendVerificationEmail = async () => {
    if (!email) return;
    await authClient.sendVerificationEmail({
      email: email,
      callbackURL: `${window.location.origin}/`,
    }, {
      onSuccess() {
        toast.success("E-mail de vérification renvoyé !");
      },
      onError(ctx) {
        const { response } = ctx;
        if (response.status === 429) {
          toast.error(`Trop de demandes. Réessayez plus tard.`);
        } else {
          toast.error("Échec de l'envoi de l'e-mail de vérification. Veuillez réessayer."); 
        }
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <Card className="relative w-full max-w-md border shadow-lg">
        <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-lg" />

        <CardHeader className="space-y-6 text-center pb-8 pt-10">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center ring-8 ring-primary/5 border-2 border-primary/20">
            <Mail className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>

          <div className="space-y-3">
            <CardTitle className="text-3xl font-serif font-bold text-primary">
              Vérifiez votre e-mail
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Nous avons envoyé un lien de vérification à
            </CardDescription>
          </div>

          <div className="px-4 py-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-foreground break-all">
              {email || "votre@email.com"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          <div className="flex gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <CheckCircle2
              className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
              strokeWidth={2}
            />
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-foreground">
                Étapes suivantes :
              </p>
              <ol className="text-muted-foreground space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">1.</span>
                  <span>Ouvrez votre boîte de réception</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">2.</span>
                  <span>Cliquez sur le lien de vérification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">3.</span>
                  <span>Complétez votre inscription</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-muted/50 rounded-lg border">
            <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              L'e-mail peut prendre quelques minutes. Vérifiez vos spams si
              nécessaire.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3 border-t pt-6 bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            Vous n'avez pas reçu l'e-mail ?{" "}
            <button className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline transition-all" onClick={resendVerificationEmail}>
              Renvoyer
            </button>
          </p>
          <p className="text-xs text-muted-foreground/70 text-center">
            Besoin d'aide ?{" "}
            <button className="text-primary hover:text-primary/80 font-medium hover:underline underline-offset-4 transition-all" >
              Contactez le support
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
