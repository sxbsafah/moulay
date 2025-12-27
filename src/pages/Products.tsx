import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CreateProductSheet from "@/components/admin/CreateProductSheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Package,
  DollarSign,
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import StatisticsCard from "@/components/admin/StatisticsCard";
import { toast } from "sonner";
import DataTable from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePaginatedQuery, useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";
import { StatisticsSkeleton } from "@/components/skeletons/StatisticsSkeleton";
import { ProductsTableSkeleton } from "@/components/skeletons/ProductsTableSkeleton";
import { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Spinner } from "@/components/ui/spinner";
import ViewProductSheet from "@/components/admin/ViewProductSheet";
import EditProductSheet from "@/components/admin/EditProductSheet";

export type ProductData = {
  _id: Id<"products">;
  name: string;
  description: string;
  costPrice: number;
  salePrice: number;
  category: {
    _id: Id<"categories">;
    name: string;
  };
  productColors: {
    _id: Id<"productColors">;
    colorName: string;
    colorHex: string;
    images: {
      imageUploadStatus: "success";
      imageKey: string;
      imageUrl: string;
      imageId: string;
    }[];
    sizes: {
      size: string;
      quantity: number;
      variantId: Id<"productVariants">
    }[];
  }[];
};

export default function Products() {
  const statistics = useQuery(api.products.getGenerallProductsInfo);
  const { results } = usePaginatedQuery(api.products.listProducts,{}, { initialNumItems: 10 },);
  const categories = useQuery(api.categories.getAllCategories) || [];
  const deleteProduct = useMutation(api.products.deleteProduct);
  
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewProduct, setViewProduct] = useState<ProductData | null>(null,);
  const [editProduct, setEditProduct] = useState<ProductData | null>(null,);
  const [deletedProduct, setDeletedProduct] = useState<ProductData | null>(null);
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const ProductsColumns: ColumnDef<ProductData>[] = [
    {
      header: "Produit",
      accessorKey: "name",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent ring-2 ring-primary/20">
              <img
                src={
                  product.productColors?.[0]?.images?.[0].imageUrl ||
                  "/placeholder.svg"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                {product.description}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Catégorie",
      accessorKey: "category",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Badge
            variant="secondary"
            className="font-medium rounded-full px-3 bg-primary/10 text-primary border-primary/20"
          >
            {product.category.name}
          </Badge>
        );
      },
    },
    {
      header: "Prix",
      accessorKey: "price",
      cell: ({ row }) => {
        const product = row.original;
        const margin = (
          ((product.salePrice - product.costPrice) / product.salePrice) *
          100
        ).toFixed(0);
        return (
          <div className="space-y-0.5">
            <p className="font-bold text-sm text-primary">
              {product.salePrice} DZ
            </p>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-muted-foreground">
                Coût: {product.costPrice} DZ
              </p>
              <span className="text-[10px] text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded-full">
                +{margin}%
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Stock",
      accessorKey: "stock",
      cell: ({ row }) => {
        const product = row.original;
        const productStock = product.productColors.reduce(
          (acc, c) => acc + c.sizes.reduce((s, size) => s + size.quantity, 0),
          0,
        );
        return (
          <Badge
            variant={
              productStock < 10
                ? "destructive"
                : productStock < 20
                  ? "secondary"
                  : "outline"
            }
            className="font-semibold rounded-full"
          >
            {productStock} unités
          </Badge>
        );
      },
    },
    {
      header: "Couleurs",
      accessorKey: "colors",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-1.5 items-center">
            {product.productColors.slice(0, 4).map((color) => (
              <div
                key={color._id}
                className="w-7 h-7 rounded-full border-2 border-primary/30 shadow-md ring-1 ring-primary/10 transition-transform hover:scale-110"
                style={{ backgroundColor: color.colorHex }}
                title={color.colorName}
              />
            ))}
            {product.productColors.length > 4 && (
              <span className="text-xs text-primary font-semibold ml-1 bg-primary/10 px-2 py-0.5 rounded-full">
                +{product.productColors.length - 4}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-semibold">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setViewProduct(product)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Voir Le produit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setEditProduct(product)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Modifier Le produit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeletedProduct(product)}
                className="text-destructive gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer Le produit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleDelete = async () => {
    if (!deletedProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct({ productId: deletedProduct._id });
      toast.success("Produit supprimé avec succès.");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression du produit.");
    } finally {
      setDeletedProduct(null);
      setIsDeleting(false);
    }
  };




  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 shadow-xl border border-primary/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-16 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-serif font-bold text-primary-foreground">
                Gestion des Produits
              </h1>
              <p className="text-primary-foreground/80 text-sm mt-0.5">
                Gérez et optimisez votre catalogue de produits
              </p>
            </div>
          </div>
        </div>
      </div>

      {statistics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatisticsCard
            title="Total Produits"
            value={`${statistics.totalProducts}`}
            variant="default"
            icon={<Package className="w-6 h-6" />}
          />

          <StatisticsCard
            title="Stock Total"
            value={`${statistics.totalUnits} unités`}
            variant="warning"
            icon={<ShoppingBag className="w-6 h-6" />}
          />

          <StatisticsCard
            title="Revenu Total Estimé"
            value={`${statistics.projectRevenue} DZ`}
            variant="success"
            icon={<DollarSign className="w-6 h-6" />}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatisticsSkeleton />
          <StatisticsSkeleton />
          <StatisticsSkeleton />
        </div>
      )}

      <Card className="p-6 shadow-lg border-primary/10 bg-gradient-to-br from-background to-primary/5">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-primary">
                Catalogue de Produits
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Tous vos produits en un coup d'œil
              </p>
            </div>
            <Button
              onClick={() => setShowCreateSheet(true)}
              className="gap-2 shadow-md bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Nouveau Produit
            </Button>
          </div>
          {results ? (
            <DataTable columns={ProductsColumns} data={results} />
          ) : (
            <ProductsTableSkeleton />
          )}
        </div>
      </Card>

      <CreateProductSheet setShowCreateSheet={setShowCreateSheet} showCreateSheet={showCreateSheet} categories={categories} /> 
      <ViewProductSheet viewProduct={viewProduct} setViewProduct={setViewProduct} />
      <EditProductSheet editProduct={editProduct} setEditProduct={setEditProduct} categories={categories} />

      <AlertDialog
        open={!!deletedProduct}
        onOpenChange={() => setDeletedProduct(null)}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-4 ring-destructive/5">
              <Trash2 className="w-7 h-7 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Supprimer ce produit?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center leading-relaxed">
              Vous êtes sur le point de supprimer{" "}
              <span className="font-semibold text-foreground">
                "{deletedProduct?.name}"
              </span>
              . Cette action est irréversible et supprimera toutes les variantes
              associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3">
            <AlertDialogCancel className="flex-1 sm:flex-none">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="flex-1 sm:flex-none bg-destructive hover:bg-destructive/90 text-white shadow-sm"
            >

              {isDeleting ? (
                <Spinner />
              ) : "Supprimer"}
              
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
