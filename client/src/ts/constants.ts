export const CATEGORIES = [
  { displayValue: "Electronics", id: "electronics" },
  { displayValue: "Clothing", id: "clothing" },
  { displayValue: "Books", id: "books" },
  { displayValue: "Home and Kitchen", id: "homeandkitchen" },
  { displayValue: "Toys and Games", id: "toysandgames" },
  { displayValue: "Beauty and Personal Care", id: "beautyandpersonalcare" },
  { displayValue: "Sports and Outdoors", id: "sportsandoutdoors" },
  { displayValue: "Health and Wellness", id: "healthandwellness" },
  { displayValue: "Automotive", id: "automotive" },
  { displayValue: "Movies and Music", id: "moviesandmusic" },
  { displayValue: "Pet Supplies", id: "petsupplies" },
  { displayValue: "Grocery", id: "grocery" },
  { displayValue: "Jewelry", id: "jewelry" },
  { displayValue: "Furniture", id: "furniture" },
  { displayValue: "Tools and Home Improvement", id: "toolsandhomeimprovement" },
  { displayValue: "Office Products", id: "officeproducts" },
  { displayValue: "Baby and Kids", id: "babyandkids" },
  { displayValue: "Garden and Outdoor", id: "gardenandoutdoor" },
  { displayValue: "Video Games", id: "videogames" },
  { displayValue: "Musical Instruments", id: "musicalinstruments" },
  { displayValue: "Appliances", id: "appliances" },
  { displayValue: "Food and Drink", id: "foodanddrink" },
  { displayValue: "Fitness and Exercise", id: "fitnessandexercise" },
  { displayValue: "Crafts and Hobbies", id: "craftsandhobbies" },
  { displayValue: "Party and Celebration", id: "partyandcelebration" },
  { displayValue: "Travel and Luggage", id: "travelandluggage" },
  { displayValue: "Art and Collectibles", id: "artandcollectibles" },
  { displayValue: "Computers and Accessories", id: "computersandaccessories" },
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
