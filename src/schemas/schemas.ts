import { z } from "zod";

// ==================== AUTH SCHEMAS ====================

export const signUpSchema = z.object({
  firstname: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères.")
    .regex(/^[A-Za-zÀ-ÿ]+$/, "Le prénom ne peut contenir que des lettres."),
  lastname: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(50, "Le nom ne peut pas dépasser 50 caractères.")
    .regex(/^[A-Za-zÀ-ÿ]+$/, "Le nom ne peut contenir que des lettres."),
  email: z.email("Adresse e-mail invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(100, "Le mot de passe ne peut pas dépasser 100 caractères.")
    .regex(
      /[a-z]/,
      "Le mot de passe doit contenir au moins une lettre minuscule.",
    )
    .regex(
      /[A-Z]/,
      "Le mot de passe doit contenir au moins une lettre majuscule.",
    )
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Le mot de passe doit contenir au moins un caractère spécial.",
    ),
});

export const signInSchema = z.object({
  email: z.email("Adresse e-mail invalide."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export const passwordResetSchema = z
  .object({
    email: z.email("Adresse e-mail invalide."),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .max(100, "Le mot de passe ne peut pas dépasser 100 caractères.")
      .regex(
        /[a-z]/,
        "Le mot de passe doit contenir au moins une lettre minuscule.",
      )
      .regex(
        /[A-Z]/,
        "Le mot de passe doit contenir au moins une lettre majuscule.",
      )
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Le mot de passe doit contenir au moins un caractère spécial.",
      ),
    confirmPassword: z
      .string()
      .min(1, "Veuillez confirmer votre mot de passe."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
const MAX_IMAGES = 10;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const imageFileSchema = z
  .union([
    z.instanceof(File, { message: "L'image est requise." }),
    z.string().min(1, "L'image est requise."),
  ])
  .refine(
    (file) => {
      if (file instanceof File) {
        return file.size <= MAX_FILE_SIZE;
      }
      return true;
    },
    {
      message: "La taille de l'image ne doit pas dépasser 5MB.",
    },
  )
  .refine(
    (file) => {
      if (file instanceof File) {
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      }
      return true;
    },
    {
      message: "Format accepté: .jpg, .jpeg, .png, .webp",
    },
  );

const sizeSchema = z.object({
  size: z
    .string()
    .min(1, "La taille est requise.")
    .max(5, "La taille est trop longue."),
  quantity: z
    .number({
      message: "La quantité doit être un nombre.",
    })
    .int("La quantité doit être un nombre entier.")
    .min(1, "La quantité ne peut pas être inférieure à 1."),
});

const colorSchema = z.object({
  colorName: z
    .string()
    .min(1, "Le nom de la couleur est requis.")
    .max(30, "Le nom de la couleur est trop long."),
  colorHex: z
    .string()
    .min(1, "Le code hex est requis.")
    .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, "Code couleur hexadécimal invalide."),
  images: z
    .array(imageFileSchema)
    .min(1, "Au moins une image est requise.")
    .max(
      MAX_IMAGES,
      `Vous ne pouvez pas télécharger plus de ${MAX_IMAGES} images.`,
    ),
  sizes: z.array(sizeSchema).min(1, "Au moins une taille est requise."),
});

export const productFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Le nom du produit est requis.")
      .max(100, "Le nom du produit est trop long."),
    description: z
      .string()
      .min(1, "La description est requise.")
      .max(1000, "La description est trop longue."),
    category: z.string().min(1, "La catégorie est requise."),
    productColors: z
      .array(colorSchema)
      .min(1, "Au moins une couleur est requise."),
    costPrice: z
      .number("le prix de coût est requis")
      .min(0, "Le prix de coût ne peut pas être négatif."),
    salePrice: z
      .number("le prix de vente est requis")
      .min(0, "Le prix de vente ne peut pas être négatif."),
  })
  .refine((data) => data.salePrice >= data.costPrice, {
    message: "Le prix de vente doit être supérieur ou égal au prix de coût.",
    path: ["salePrice"],
  })
  .refine(
    (data) => {
      const hexSet = new Set(
        data.productColors.map((c) => c.colorHex.toLowerCase()),
      );
      const nameSet = new Set(
        data.productColors.map((c) => c.colorName.toLowerCase()),
      );
      return (
        hexSet.size === data.productColors.length &&
        nameSet.size === data.productColors.length
      );
    },
    {
      message: "Les couleurs doivent avoir des noms et codes hex uniques.",
      path: ["productColors"],
    },
  );

export const createProductSchema = z
  .object({
    name: z
      .string()
      .min(1, "Le nom du produit est requis.")
      .max(100, "Le nom du produit est trop long."),
    description: z
      .string()
      .min(1, "La description est requise.")
      .max(1000, "La description est trop longue."),
    costPrice: z.number().min(0, "Le prix de coût ne peut pas être négatif."),
    salePrice: z.number().min(0, "Le prix de vente ne peut pas être négatif."),
    category: z.string().min(1, "La catégorie est requise."),
    productColors: z
      .array(
        colorSchema.omit({ images: true }).extend({
          images: z
            .array(z.string().min(1, "L'image est requise."))
            .min(1, "Au moins une image est requise."),
        }),
      )
      .min(1, "Au moins une couleur est requise."),
  })
  .refine((data) => data.salePrice >= data.costPrice, {
    message: "Le prix de vente doit être supérieur ou égal au prix de coût.",
    path: ["salePrice"],
  })
  .refine(
    (data) => {
      const hexSet = new Set(
        data.productColors.map((c) => c.colorHex.toLowerCase()),
      );
      const nameSet = new Set(
        data.productColors.map((c) => c.colorName.toLowerCase()),
      );
      return (
        hexSet.size === data.productColors.length &&
        nameSet.size === data.productColors.length
      );
    },
    {
      message: "Les couleurs doivent avoir des noms et codes hex uniques.",
      path: ["colors"],
    },
  );

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type ProductFormData = z.infer<typeof productFormSchema>;
export type ColorInput = z.infer<typeof colorSchema>;
export type SizeInput = z.infer<typeof sizeSchema>;
