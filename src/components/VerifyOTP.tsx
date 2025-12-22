import  OTPForm  from "@/components/OTPForm";

type VerifyOtpProps = {
  email: string;
  reset?: boolean;
  password?: string;
};

const VerifyOtp = ({ email, reset, password }: VerifyOtpProps) => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <OTPForm email={email} reset={reset} password={password} />
      </div>
    </div>
  );
};

export default VerifyOtp;
