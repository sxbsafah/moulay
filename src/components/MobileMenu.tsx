import { MouseEventHandler, useState } from "react";
import { Link } from "react-router";
import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { collectionCategories } from "@/lib/products";
import { mobileMenuItems } from "@/lib/contstants";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router";

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [collectionsExpanded, setCollectionsExpanded] = useState(false);
  const { signOut } = useAuthActions();
  const navigate = useNavigate();


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="size-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm">
        <SheetHeader className="p-5 border-b border-border bg-muted/50">
          <SheetTitle className="font-serif text-2xl font-medium tracking-wide text-left">
            MOULAY
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 px-5">
          <div className="space-y-1">
            <Collapsible
              open={collectionsExpanded}
              onOpenChange={setCollectionsExpanded}
              className="border-b border-border/50"
            >
              <CollapsibleTrigger asChild>
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
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center p-4 rounded-xl bg-muted/70 hover:bg-muted text-sm font-medium transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            {mobileMenuItems.map((item) => (
              <Link
                key={item.name}
                className="flex items-center justify-between py-4 text-base font-medium tracking-wide border-b border-border/50"
                to={item.to}
                onClick={() => setOpen(false)}
              >
                {item.name}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
          <Button
            className="flex items-center justify-between py-4 text-base font-medium tracking-wide border-b border-border/50"
            onClick={() => void signOut().then(() => navigate("/connexion"))}
          >
            Deconnecte
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        </nav>
        <div className="p-5 bg-muted/30 border-t border-border mt-auto">
          <Button
            asChild
            className="w-full h-12 rounded-full font-medium text-sm tracking-wider flex items-center justify-center"
          >
            <Link to="/boutique" className="flex items-center justify-center">
              DÉCOUVRIR LA BOUTIQUE
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenu;
