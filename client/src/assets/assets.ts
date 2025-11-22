import avatar from "./avatar.png";

export const assets = {
  avatar,
};

export const dummyCategories = [
  {
    name: "Electronics",
    slug: "electronics",
    subcategories: [
      {
        name: "Mobile Phones & Tablets",
        items: ["Smartphones", "Tablets", "Accessories", "Smart Watches"],
      },
      {
        name: "Computers & Laptops",
        items: ["Laptops", "Desktops", "Components", "Peripherals"],
      },
      {
        name: "Audio & Video",
        items: ["Headphones", "Speakers", "Cameras", "Microphones"],
      },
      {
        name: "Gaming",
        items: ["Consoles", "Games", "Accessories", "PC Gaming"],
      },
    ],
  },
  {
    name: "Sports",
    slug: "sports",
    subcategories: [
      {
        name: "Team Sports",
        items: ["Football", "Basketball", "Baseball", "Soccer"],
      },
      {
        name: "Outdoor Recreation",
        items: ["Camping", "Hiking", "Cycling", "Fishing"],
      },
      {
        name: "Fitness Equipment",
        items: ["Cardio", "Weights", "Yoga", "Home Gym"],
      },
    ],
  },
  {
    name: "Fashion",
    slug: "fashion",
    subcategories: [
      {
        name: "Men's Fashion",
        items: ["Clothing", "Shoes", "Accessories", "Watches"],
      },
      {
        name: "Women's Fashion",
        items: ["Dresses", "Shoes", "Handbags", "Jewelry"],
      },
      {
        name: "Kids & Baby",
        items: ["Boys", "Girls", "Baby Clothing", "Toys"],
      },
    ],
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    subcategories: [
      {
        name: "Furniture",
        items: ["Living Room", "Bedroom", "Office", "Outdoor"],
      },
      {
        name: "Home Decor",
        items: ["Wall Art", "Lighting", "Rugs", "Curtains"],
      },
      {
        name: "Kitchen & Dining",
        items: ["Cookware", "Appliances", "Dinnerware", "Storage"],
      },
      {
        name: "Garden & Outdoor",
        items: ["Plants", "Tools", "Patio", "Grills"],
      },
    ],
  },
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    subcategories: [
      {
        name: "Skincare",
        items: ["Face Care", "Body Care", "Sun Protection", "Anti-Aging"],
      },
      {
        name: "Makeup",
        items: ["Face Makeup", "Eye Makeup", "Lip Products", "Nail Care"],
      },
      {
        name: "Hair Care",
        items: [
          "Shampoo & Conditioner",
          "Styling Products",
          "Hair Tools",
          "Hair Color",
        ],
      },
      {
        name: "Fragrance",
        items: ["Perfume", "Cologne", "Body Spray", "Gift Sets"],
      },
      {
        name: "Health & Wellness",
        items: ["Vitamins", "Supplements", "Fitness", "Personal Care"],
      },
    ],
  },
  {
    name: "Toys & Hobbies",
    slug: "toys-hobbies",
    subcategories: [
      {
        name: "Action Figures",
        items: ["Superheroes", "Movie Characters", "Vintage", "Modern"],
      },
      {
        name: "Building Toys",
        items: ["LEGO", "Model Kits", "Construction Sets", "Puzzles"],
      },
      {
        name: "Hobbies",
        items: ["RC Vehicles", "Drones", "Crafts", "Board Games"],
      },
    ],
  },
];
