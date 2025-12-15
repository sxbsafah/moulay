export interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  colors: string[]
  sizes: string[]
  image: string
  badge?: string
  description?: string
  stock: number
  tags: string[]
}

export const allProducts: Product[] = [
  {
    id: 1,
    name: "Chemise Oxford Premium",
    category: "Chemises",
    price: 129,
    originalPrice: 159,
    rating: 4.8,
    reviews: 124,
    colors: ["#FFFFFF", "#87CEEB", "#FFB6C1"],
    sizes: ["S", "M", "L", "XL"],
    image: "/white-oxford-shirt-menswear-premium.jpg",
    badge: "Bestseller",
    description: "Chemise Oxford confectionnée en coton égyptien de première qualité.",
    stock: 45,
    tags: ["coton", "classique", "bureau"],
  },
  {
    id: 2,
    name: "Blazer Laine Italienne",
    category: "Blazers",
    price: 449,
    rating: 4.9,
    reviews: 89,
    colors: ["#1a1a1a", "#2c3e50", "#8b4513"],
    sizes: ["M", "L", "XL"],
    image: "/black-wool-blazer-premium-menswear.jpg",
    description: "Blazer en laine italienne super 120's.",
    stock: 23,
    tags: ["laine", "formel", "luxe"],
  },
  {
    id: 3,
    name: "Chino Slim Fit",
    category: "Pantalons",
    price: 119,
    originalPrice: 149,
    rating: 4.7,
    reviews: 203,
    colors: ["#d4c4a8", "#1a1a1a", "#2c3e50"],
    sizes: ["28", "30", "32", "34"],
    image: "/beige-chino-pants-premium-menswear.jpg",
    badge: "Solde",
    description: "Chino en twill de coton stretch.",
    stock: 67,
    tags: ["coton", "casual", "stretch"],
  },
  {
    id: 4,
    name: "Pull Cachemire",
    category: "Maille",
    price: 289,
    rating: 4.9,
    reviews: 67,
    colors: ["#1a1a1a", "#808080", "#8b0000"],
    sizes: ["S", "M", "L"],
    image: "/black-cashmere-sweater-luxury-menswear.jpg",
    description: "Pull en cachemire mongol 100%.",
    stock: 18,
    tags: ["cachemire", "luxe", "hiver"],
  },
  {
    id: 5,
    name: "Chemise Lin Été",
    category: "Chemises",
    price: 99,
    rating: 4.6,
    reviews: 156,
    colors: ["#FFFFFF", "#F5F5DC", "#87CEEB"],
    sizes: ["S", "M", "L", "XL"],
    image: "/white-linen-shirt-summer-menswear.jpg",
    badge: "Nouveau",
    description: "Chemise en lin irlandais légère.",
    stock: 89,
    tags: ["lin", "été", "casual"],
  },
  {
    id: 6,
    name: "Costume Sur Mesure",
    category: "Costumes",
    price: 799,
    rating: 5.0,
    reviews: 45,
    colors: ["#1a1a1a", "#2c3e50"],
    sizes: ["48", "50", "52", "54"],
    image: "/black-tailored-suit-premium-menswear.jpg",
    description: "Costume deux pièces confectionné à la main.",
    stock: 12,
    tags: ["laine", "formel", "mariage"],
  },
  {
    id: 7,
    name: "Polo Classique",
    category: "Polos",
    price: 79,
    originalPrice: 99,
    rating: 4.5,
    reviews: 312,
    colors: ["#FFFFFF", "#1a1a1a", "#2c3e50", "#8b0000"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/white-polo-shirt-premium-menswear.jpg",
    badge: "Populaire",
    description: "Polo en piqué de coton premium.",
    stock: 156,
    tags: ["coton", "casual", "sport"],
  },
  {
    id: 8,
    name: "Ceinture Cuir",
    category: "Accessoires",
    price: 89,
    rating: 4.8,
    reviews: 178,
    colors: ["#1a1a1a", "#8b4513"],
    sizes: ["32", "34", "36", "38"],
    image: "/black-leather-belt-premium-menswear.jpg",
    description: "Ceinture en cuir pleine fleur.",
    stock: 234,
    tags: ["cuir", "accessoire", "classique"],
  },
]

export const collectionCategories = [
  { name: "Chemises", href: "/boutique?category=Chemises" },
  { name: "Blazers", href: "/boutique?category=Blazers" },
  { name: "Pantalons", href: "/boutique?category=Pantalons" },
  { name: "Costumes", href: "/boutique?category=Costumes" },
  { name: "Maille", href: "/boutique?category=Maille" },
  { name: "Chaussures", href: "/boutique?category=Chaussures" },
  { name: "Montres", href: "/boutique?category=Montres" },
  { name: "Accessoires", href: "/boutique?category=Accessoires" },
]

export const categories = [
  "Tous",
  "Chemises",
  "Blazers",
  "Pantalons",
  "Costumes",
  "Maille",
  "Polos",
  "T-Shirts",
  "Accessoires",
  "Chaussures",
  "Montres",
  "Vestes",
]
