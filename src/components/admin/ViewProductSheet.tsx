import { Sheet, SheetContent } from "../ui/sheet";
import { Eye, Layers } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ProductData } from "@/pages/Products";



type ViewProductSheetProps = {
  viewProduct: ProductData | null;
  setViewProduct: React.Dispatch<React.SetStateAction<ProductData | null>>;
};

const ViewProductSheet = ({ viewProduct, setViewProduct }: ViewProductSheetProps) => {
  return (
    <Sheet open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
        {viewProduct && (
          <>
            <div className="relative bg-linear-to-br from-primary via-primary/95 to-primary/90 border-b border-primary/20 px-6 py-6 shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-foreground/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <Eye className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold truncate text-primary-foreground">
                    {viewProduct.name}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="mt-1.5 rounded-full bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                  >
                    {viewProduct.category.name}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-linear-to-b from-primary/5 to-background">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
                  <div className="bg-linear-to-br from-primary/15 to-primary/5 rounded-2xl p-4 text-center border-2 border-primary/20 shadow-md">
                    <p className="text-[10px] text-primary uppercase tracking-wider mb-1.5 font-bold">
                      Prix de Vente
                    </p>
                    <p className="text-2xl  font-bold text-primary">
                      {viewProduct.salePrice} DZ
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-muted/50 to-muted/30 rounded-2xl p-4 text-center border border-border/50 shadow-md">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">
                      Prix Coûtant
                    </p>
                    <p className="text-2xl  font-bold">
                      {viewProduct.costPrice} DZ
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-primary via-primary/90 to-primary/80 rounded-2xl p-4 text-center shadow-lg">
                    <p className="text-[10px] text-primary-foreground/90 uppercase tracking-wider mb-1.5 font-bold">
                      Marge
                    </p>
                    <p className="text-2xl  font-bold text-primary-foreground">
                      {Math.round(
                        ((viewProduct.salePrice - viewProduct.costPrice) /
                          viewProduct.salePrice) *
                          100,
                      )}
                      %
                    </p>
                  </div>
                </div>

                <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl p-5 border-2 border-primary/20 shadow-md">
                  <p className="text-[10px] text-primary uppercase tracking-wider mb-2.5 font-bold">
                    Description
                  </p>
                  <p className="text-sm leading-relaxed">
                    {viewProduct.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-primary uppercase tracking-wider">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
                      <Layers className="w-4 h-4 text-primary-foreground" />
                    </div>
                    Variantes ({viewProduct.productColors.length} couleurs)
                  </div>

                  {viewProduct.productColors.map((color) => (
                    <div
                      key={color._id}
                      className="bg-linear-to-br from-background to-primary/5 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg"
                    >
                      <div className="bg-linear-to-r from-primary/20 to-primary/10 px-5 py-4 flex items-center justify-between border-b-2 border-primary/20">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-11 h-11 rounded-xl border-2 border-primary/30 shadow-lg ring-2 ring-primary/20"
                            style={{ backgroundColor: color.colorHex }}
                          />
                          <div>
                            <p className="font-semibold text-sm">
                              {color.colorName}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {color.colorHex}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="rounded-full font-semibold bg-primary/20 text-primary border-primary/30"
                        >
                          {color.sizes.reduce((acc, s) => acc + s.quantity, 0)}{" "}
                          unités
                        </Badge>
                      </div>

                      <div className="p-5 space-y-5">
                        <div className="space-y-3">
                          <p className="text-[10px] text-primary uppercase tracking-wider font-bold">
                            Images ({color.images.length})
                          </p>
                          <div className="grid grid-cols-4 gap-2.5">
                            {color.images.map((img, imgIdx) => (
                              <div
                                key={img.imageKey || img.imageId}
                                className="aspect-square rounded-xl overflow-hidden border-2 border-primary/20 bg-muted shadow-md hover:shadow-xl hover:border-primary/40 transition-all"
                              >
                                <img
                                  src={img.imageUrl}
                                  alt={`${viewProduct.name} - Image ${imgIdx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[10px] text-primary uppercase tracking-wider font-bold">
                            Tailles & Stock
                          </p>
                          <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2.5">
                            {color.sizes.map((size, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-background rounded-xl border-2 border-primary/20 shadow-md hover:shadow-lg hover:border-primary/40 transition-all"
                              >
                                <span className="font-bold text-base text-primary">
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
                                  className="rounded-full font-semibold"
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

                <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary/95 to-primary/90 rounded-2xl p-6 shadow-xl border-2 border-primary/30">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                  <div className="relative grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <p className="text-[10px] text-primary-foreground/80 uppercase tracking-wider mb-2 font-bold">
                        Stock Total
                      </p>
                      <p className="text-4xl font-bold text-primary-foreground">
                        {viewProduct.productColors.reduce(
                          (acc, c) =>
                            acc +
                            c.sizes.reduce((s, size) => s + size.quantity, 0),
                          0,
                        )}
                      </p>
                      <p className="text-sm text-primary-foreground/80 mt-1">
                        unités
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-primary-foreground/80 uppercase tracking-wider mb-2 font-bold">
                        Variantes
                      </p>
                      <p className="text-4xl  font-bold text-primary-foreground">
                        {viewProduct.productColors.reduce(
                          (acc, c) => acc + c.sizes.length,
                          0,
                        )}
                      </p>
                      <p className="text-sm text-primary-foreground/80 mt-1">
                        combinaisons
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-primary/20 bg-linear-to-b from-primary/5 to-background p-4 shrink-0">
              <Button
                variant="outline"
                onClick={() => setViewProduct(null)}
                className="w-full shadow-sm border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary"
              >
                Fermer
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ViewProductSheet;
