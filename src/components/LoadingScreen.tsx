import Loader from "./Loader";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <Loader className="size-12 text-primary" />
    </div>
  );
}
