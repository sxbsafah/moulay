import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
}

export default function Loader({ className }: LoaderProps) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      className={cn("size-6 animate-spin", className)}
      viewBox="0 0 100 101"
      fill="none"
    >
      <circle
        cx="50"
        cy="50.5908"
        r="45"
        stroke="currentColor"
        strokeWidth="10"
        className="opacity-20"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10298 63.2666 1.94025 56.7698 1.05126C51.7666 0.367006 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0496C60.8642 10.7766 65.9922 12.5457 70.6331 15.2552C75.2739 17.9648 79.3342 21.5619 82.5849 25.8416C84.9175 28.8217 86.7997 32.2913 88.1811 35.8758C89.0833 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentColor"
      />
    </svg>
  );
}
