import { Menu, Search, User, X, Heart, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { allProducts, collectionCategories } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);
  const [collectionsExpanded, setCollectionsExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm p-0">
              <SheetHeader className="p-5 border-b border-border bg-muted/50">
                <SheetTitle className="font-serif text-2xl font-medium tracking-wide text-left">
                  MOULAY
                </SheetTitle>
              </SheetHeader>

              <nav className="flex-1 overflow-y-auto px-5">
                <div className="space-y-1">
                  <Collapsible
                    open={collectionsExpanded}
                    onOpenChange={setCollectionsExpanded}
                  >
                    <CollapsibleTrigger asChild className="px-0">
                      <Button
                        variant="ghost"
                        className="flex items-center justify-between w-full py-4 px-0! text-base font-medium tracking-wide h-auto hover:bg-transparent"
                      >
                        COLLECTIONS
                        <ChevronRight
                          className={`size-5 text-muted-foreground transition-transform duration-200 ${collectionsExpanded ? "rotate-90" : ""}`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pb-4">
                      <div className="grid grid-cols-2 gap-2">
                        {collectionCategories.map((cat) => (
                          <Link
                            key={cat.name}
                            to={cat.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-center p-4 rounded-xl bg-muted/70 hover:bg-muted text-sm font-medium transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <div className="border-t border-border/50" />

                  <Link
                    to="/compte"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-4 text-base font-medium tracking-wide"
                  >
                    MON COMPTE
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>

                  <div className="border-t border-border/50" />

                  <Link
                    to="/compte/favoris"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-4 text-base font-medium tracking-wide"
                  >
                    MES FAVORIS
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>

                  <div className="border-t border-border/50" />

                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-4 text-base font-medium tracking-wide"
                  >
                    ADMIN
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </div>
              </nav>

              <div className="p-5 bg-muted/30 border-t border-border mt-auto">
                <Button
                  asChild
                  className="w-full h-12 rounded-full font-medium text-sm tracking-wider flex items-center justify-center "
                >
                  <Link
                    to="/boutique"
                    className="flex items-center justify-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    DÉCOUVRIR LA BOUTIQUE
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 md:flex-none text-center md:text-left">
            <Link
              to="/"
              className="font-serif text-2xl md:text-3xl font-medium tracking-wide"
            >
              MOULAY
            </Link>
          </div>

          <div className="hidden md:flex items-center flex-1 justify-center max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher des Produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-muted border-border rounded-full text-sm placeholder:text-muted-foreground focus-visible:ring-primary/30 focus-visible:border-primary/50"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/produit/${product.id}`}
                      className="flex items-center gap-4 p-3 hover:bg-muted transition-colors"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.category}
                        </p>
                      </div>
                      <span className="font-semibold text-sm">
                        {product.price} €
                      </span>
                    </Link>
                  ))}
                  <Link
                    to={`/boutique?search=${searchQuery}`}
                    className="block p-3 text-center text-sm text-primary hover:bg-muted border-t border-border"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    Voir tous les résultats
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="size-5" />
              <span className="sr-only">Rechercher</span>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="rounded-full hidden md:flex"
            >
              <Link to="/compte/favoris">
                <Heart className="size-5" />
                <span className="sr-only">Favoris</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="rounded-full hidden md:flex"
            >
              <Link to="/compte">
                <User className="size-5" />
                <span className="sr-only">Mon compte</span>
              </Link>
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="lg:hidden pb-4">
            <div className="md:hidden relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-muted border-border rounded-full text-sm placeholder:text-muted-foreground"
                autoFocus
              />
              {searchOpen && searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/produit/${product.id}`}
                    className="flex items-center gap-4 p-3 hover:bg-muted transition-colors"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setSearchOpen(false);
                    }}
                  >
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <span className="font-semibold text-sm">
                      {product.price} €
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="hidden md:flex items-center justify-center gap-1 py-2 border-t border-border/50 -mx-4 px-4 bg-muted/30">
        <div className="container mx-auto flex items-center justify-center gap-3">
          {collectionCategories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className="py-1.5 text-xs tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            >
              {cat.name.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;
