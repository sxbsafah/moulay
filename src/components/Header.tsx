import { Search, User, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { allProducts, collectionCategories } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchResultsPanel from "@/components/SearchResultsPanel";
import MobileMenu from "@/components/MobileMenu";

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);

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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-8 h-16 md:h-20">
          <MobileMenu />

          <div>
            <Link
              to="/"
              className="font-serif text-2xl md:text-3xl font-medium tracking-wide"
            >
              MOULAY
            </Link>
          </div>

          <div className="hidden md:block grow max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher des Produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-muted border-border rounded-full text-sm placeholder:text-muted-foreground focus-visible:ring-primary/30 focus-visible:border-primary/50"
              />
              <div className="absolute top-full left-0 right-0 mt-2">
                <SearchResultsPanel
                  results={searchResults}
                  searchQuery={searchQuery}
                  onResultClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                />
              </div>
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
            <div className="mt-2">
              <SearchResultsPanel
                results={searchResults}
                searchQuery={searchQuery}
                onResultClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setSearchOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="hidden md:flex items-center justify-center gap-1 py-2 border border-border/50 -mx-4 px-4 bg-muted/30">
        <div className="container mx-auto flex items-center justify-center gap-3">
          {collectionCategories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className="py-2 px-2 text-xs tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
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
