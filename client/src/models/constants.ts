export const CATEGORIES = [
  { displayValue: "Electronics", id: "electronics" },
  { displayValue: "Clothing", id: "clothing" },
  { displayValue: "Books", id: "books" },
  { displayValue: "Home and Kitchen", id: "home and kitchen" },
  { displayValue: "Toys and Games", id: "toys and games" },
  { displayValue: "Beauty and Care", id: "beauty and care" },
  { displayValue: "Sports", id: "sports" },
  { displayValue: "Health", id: "health" },
  { displayValue: "Automotive", id: "automotive" },
  { displayValue: "Movies and Music", id: "movies and music" },
  { displayValue: "Pet Supplies", id: "petsupplies" },
  { displayValue: "Grocery", id: "grocery" },
  { displayValue: "Jewelry", id: "jewelry" },
  { displayValue: "Furniture", id: "furniture" },
  { displayValue: "Tools", id: "tools" },
  { displayValue: "Office Products", id: "officeproducts" },
  { displayValue: "Baby and Kids", id: "babyandkids" },
  { displayValue: "Garden and Outdoor", id: "garden and outdoor" },
  { displayValue: "Video Games", id: "video games" },
  { displayValue: "Musical Instruments", id: "musical instruments" },
  { displayValue: "Appliances", id: "appliances" },
  { displayValue: "Nutrition", id: "nutrition" },
  { displayValue: "Fitness", id: "fitness" },
  { displayValue: "Crafts", id: "crafts" },
  { displayValue: "Party", id: "party" },
  { displayValue: "Travel", id: "travel" },
  { displayValue: "Art and Collectibles", id: "art and collectibles" },
  { displayValue: "Computers", id: "computers" },
  { displayValue: "Shoes", id: "shoes" },
  { displayValue: "Watches", id: "watches" },
] as const;

export const SIDEBAR_TABS = [
  {
    name: "",
    links: [
      {
        name: "Home",
        url: "/",
        icon: "home",
      },
      {
        name: "Categories",
        url: "/categories",
        icon: "grid",
      },
    ],
  },
  {
    name: "Your Profile",
    links: [
      {
        name: "Profile",
        url: "/profile",
        icon: "user",
      },
      {
        name: "Purchases",
        url: "/profile/orders",
        icon: "shopping-bag",
      },
    ],
  },
  {
    name: "Your Shop",
    links: [
      {
        name: "Profile",
        url: "/profile",
        icon: "user",
      },
      {
        name: "Warehouse",
        url: "/profile/warehouse",
        icon: "truck",
      },
      {
        name: "Orders",
        url: "/profile/orders",
        icon: "package",
      },
    ],
  },
] as const;

export const API_URL = "http://localhost:3000/api" as const;
