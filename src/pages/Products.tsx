import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
  Search,
  Filter,
  Layers,
  MoreHorizontal,
} from "lucide-react";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";
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

type ColumnsProductsType = {
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
      imageUploadStatus: string;
      imageKey: string;
      imageUrl: string;
      imageId: string;
    }[];
    sizes: {
      size: string;
      quantity: number;
    }[];
  }[];
};




export default function Products() {
  const statistics = useQuery(api.products.getGenerallProductsInfo);
  const { results } = usePaginatedQuery(
    api.products.listProducts,
    {},
    { initialNumItems: 10 },
  );
  const categories = useQuery(api.categories.getAllCategories) || [];
  const [viewProduct, setViewProduct] = useState<ColumnsProductsType | null>(null);
  const [editProduct, setEditProduct] = useState<
    ColumnsProductsType | null
  >(null);
  const [deleteProduct, setDeleteProduct] = useState<
    ColumnsProductsType | null
  >(null);
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  const ProductsColumns: ColumnDef<ColumnsProductsType>[] = [
    {
      header: "Produit",
      accessorKey: "name",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
              <img
                src={
                  product.productColors?.[0]?.images?.[0].imageUrl ||
                  "/placeholder.svg"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{product.name}</p>
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
          <Badge variant="secondary" className="font-normal">
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
        return (
          <div>
            <p className="font-semibold">{product.salePrice} DZ</p>
            <p className="text-xs text-muted-foreground">
              Coût: {product.costPrice} DZ
            </p>
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
          <div className="flex gap-1">
            {product.productColors.map((color) => (
              <div
                key={color._id}
                className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                style={{ backgroundColor: color.colorHex }}
                title={color.colorName}
              />
            ))}
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
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setViewProduct(product)}>
                <Eye className="h-4 w-4" />
                Voir Le produit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditProduct(product)}>
                <Pencil className="h-4 w-4" />
                Modifier Le produit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteProduct(product)}
                className="text-destructive"
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
  const handleDelete = () => {
    toast.success("Produit supprimé avec succès");
  };

  const getEditDefaultValues = (
    product: ColumnsProductsType,
  ): ProductFormData => ({
    name: product.name,
    description: product.description,
    category: product.category._id,
    productColors: product.productColors.map((c) => ({
      colorName: c.colorName,
      colorHex: c.colorHex,
      images: c.images as { imageUploadStatus: "success" | "uploading"; imageId: string; imageKey?: string | undefined; imageUrl?: string | undefined; }[],
      sizes: c.sizes.map((s) => ({ size: s.size, quantity: s.quantity })),
    })),
    costPrice: product.costPrice,
    salePrice: product.salePrice,
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      {statistics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatisticsCard
            title="Total Produits"
            value={`${statistics.totalProducts}`}
            // trending="up"
            // trendValue="+12%"
            // caption="ce mois"
            variant="default"
            icon={<Package className="w-6 h-6" />}
          />

          <StatisticsCard
            title="Stock Total"
            value={`${statistics.totalUnits} unités`}
            // trending="up"
            // trendValue="+5%"
            // caption="disponibles"
            variant="warning"
            icon={<ShoppingBag className="w-6 h-6" />}
          />

          <StatisticsCard
            title="Revenu Total Estimé"
            value={`${statistics.projectRevenue} DZ`}
            // trending="up"
            // trendValue="+8.2%"
            // caption="ce mois"
            variant="success"
            icon={<DollarSign className="w-6 h-6" />}
          />
        </div>
      ) : (
        <>
          <StatisticsSkeleton />
          <StatisticsSkeleton />
          <StatisticsSkeleton />
        </>
      )}

      {/* Products Table */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif font-medium">
                Gestion des Produits
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Gérez votre catalogue de produits
              </p>
            </div>
            <Button onClick={() => setShowCreateSheet(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Produit
            </Button>
          </div>
          {results ? (
            <DataTable
              columns={ProductsColumns}
              data={results}
            />
          ) : (
            <ProductsTableSkeleton />
          )}
        </div>
      </Card>

      {/* Create Sheet */}
      <Sheet open={showCreateSheet} onOpenChange={setShowCreateSheet}>
        <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
          <div className="bg-primary/5 border-b border-border px-6 py-5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-medium">
                  Créer un Produit
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ajoutez un nouveau produit au catalogue
                </p>
              </div>
            </div>
          </div>

          <ProductForm
            categories={categories}
            isEdit={false}
            setShowCreateSheet={setShowCreateSheet}
          />
        </SheetContent>
      </Sheet>

      {/* View Sheet */}
      <Sheet open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
        <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
          {viewProduct && (
            <>
              <div className="bg-primary/5 border-b border-border px-6 py-5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-medium">
                      {viewProduct.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {viewProduct.category.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Price & Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted/30 rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Prix de Vente
                      </p>
                      <p className="text-2xl font-serif font-medium">
                        {viewProduct.salePrice} €
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Prix Coûtant
                      </p>
                      <p className="text-2xl font-serif font-medium">
                        {viewProduct.costPrice} €
                      </p>
                    </div>
                    <div className="bg-primary/10 rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Marge
                      </p>
                      <p className="text-2xl font-serif font-medium text-primary">
                        {Math.round(
                          ((viewProduct.salePrice -
                            viewProduct.costPrice) /
                            viewProduct.salePrice) *
                            100,
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      Description
                    </p>
                    <p className="text-sm leading-relaxed">
                      {viewProduct.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      <Layers className="w-4 h-4" />
                      Variantes ({viewProduct.productColors.length} couleurs)
                    </div>

                    {viewProduct.productColors.map((color) => (
                      <div
                        key={color._id}
                        className="bg-muted/30 rounded-xl overflow-hidden"
                      >
                        <div className="bg-muted/50 px-5 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg border-2 border-background shadow-sm"
                              style={{ backgroundColor: color.colorHex }}
                            />
                            <div>
                              <p className="font-medium">{color.colorName}</p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {color.colorHex}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {color.sizes.reduce(
                              (acc, s) => acc + s.quantity,
                              0,
                            )}{" "}
                            unités
                          </Badge>
                        </div>

                        <div className="p-5 space-y-4">
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                              Images ({color.images.length})
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                              {color.images.map((img, imgIdx) => (
                                <div
                                  key={imgIdx}
                                  className="aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                                >
                                  <img
                                    src={
                                      typeof img === "string"
                                        ? img
                                        : "/placeholder.svg"
                                    }
                                    alt={`${viewProduct.name} - Image ${imgIdx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                              Tailles & Stock
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {color.sizes.map((size,index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50"
                                >
                                  <span className="font-medium text-lg">
                                    {size.size}
                                  </span>
                                  <Badge
                                    variant={
                                      size.quantity < 5
                                        ? "destructive"
                                        : size.quantity < 10
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {size.quantity}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Summary */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Stock Total
                        </p>
                        <p className="text-3xl font-serif font-medium">
                          {viewProduct.productColors.reduce(
                            (acc, c) =>
                              acc +
                              c.sizes.reduce((s, size) => s + size.quantity, 0),
                            0,
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">unités</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Variantes
                        </p>
                        <p className="text-3xl font-serif font-medium">
                          {viewProduct.productColors.reduce(
                            (acc, c) => acc + c.sizes.length,
                            0,
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          combinaisons
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border bg-background p-4 shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setViewProduct(null)}
                  className="w-full"
                >
                  Fermer
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
          <div className="bg-primary/5 border-b border-border px-6 py-5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Pencil className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-medium">
                  Modifier le Produit
                </h2>
                <p className="text-sm text-muted-foreground">
                  {editProduct?.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {editProduct && (
              <ProductForm
                key={editProduct._id}
                defaultValues={getEditDefaultValues(editProduct)}
                categories={categories}
                isEdit={true}
              />
            )}
          </div>

          <div className="border-t border-border bg-background p-4 shrink-0">
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setEditProduct(null)}>
                Annuler
              </Button>
              <Button
                type="submit"
                form="product-form"
                className="bg-primary hover:bg-primary/90"
              >
                Mettre à Jour
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteProduct}
        onOpenChange={() => setDeleteProduct(null)}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center">
              Supprimer ce produit?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Vous êtes sur le point de supprimer{" "}
              <span className="font-medium text-foreground">
                "{deleteProduct?.name}"
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
              className="flex-1 sm:flex-none bg-destructive hover:bg-destructive/90 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
