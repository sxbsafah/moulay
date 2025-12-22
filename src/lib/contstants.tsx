

type MenuItem = {
  name: string;
  to: string;
}


export const mobileMenuItems: MenuItem[] = [
  {
    name: "MON COMPTE",
    to: "/compte",
  },
  {
    name: "MES FAVORIS",
    to: "/compte/favoris",
  },
  {
    name: "ADMIN",
    to: "/admin",
  }
];

