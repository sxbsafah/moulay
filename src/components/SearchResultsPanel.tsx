import { Link } from "react-router";

interface SearchResultsPanelProps {
  results: {
    id: number;
    name: string;
    category: string;
    price: number;
    image?: string;
  }[];
  searchQuery: string;
  onResultClick: () => void;
}

function SearchResultsPanel({
  results,
  searchQuery,
  onResultClick,
}: SearchResultsPanelProps) {
  if (results.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50">
      {results.map((product) => (
        <Link
          key={product.id}
          to={`/produit/${product.id}`}
          className="flex items-center gap-4 p-3 hover:bg-muted transition-colors"
          onClick={onResultClick}
        >
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.category}</p>
          </div>
          <span className="font-semibold text-sm">{product.price} €</span>
        </Link>
      ))}
      <Link
        to={`/boutique?search=${searchQuery}`}
        className="block p-3 text-center text-sm text-primary hover:bg-muted border-t border-border"
        onClick={onResultClick}
      >
        Voir tous les résultats
      </Link>
    </div>
  );
}

export default SearchResultsPanel;
