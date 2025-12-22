import { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function handleErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  if (typeof error !== "object" || error === null) return;

  const details =
    (error as any)?.data?.details ??
    (error as any)?.details ??
    (error as any)?.fieldErrors;

  if (!details || typeof details !== "object") return;

  Object.entries(details).forEach(([field, message]) => {
    if (typeof message !== "string") return;

    if (field === "root") {
      setError("root", {
        type: "server",
        message,
      });
      return;
    }

    setError(field as Path<T>, {
      type: "server",
      message,
    });
  });
}
