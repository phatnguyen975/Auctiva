import avatar from "./avatar.png";

export const assets = {
  avatar,
};

export const dummyAllCategories = [
  {
    name: "Electronics",
    slug: "electronics",
    subcategories: [
      {
        name: "Smartphones",
        slug: "smartphones",
      },
      {
        name: "Laptops",
        slug: "laptops",
      },
      {
        name: "Headphones",
        slug: "headphones",
      },
      {
        name: "PC Gaming",
        slug: "pc-gaming",
      },
    ],
  },
  {
    name: "Sports",
    slug: "sports",
    subcategories: [
      {
        name: "Football",
        slug: "football",
      },
      {
        name: "Hiking",
        slug: "hiking",
      },
      {
        name: "Cardio",
        slug: "cardio",
      },
    ],
  },
  {
    name: "Fashion",
    slug: "fashion",
    subcategories: [
      {
        name: "Clothing",
        slug: "clothing",
      },
      {
        name: "Jewelry",
        slug: "jewelry",
      },
      {
        name: "Toys",
        slug: "toys",
      },
    ],
  },
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    subcategories: [
      {
        name: "Skincare",
        slug: "skincare",
      },
      {
        name: "Makeup",
        slug: "makeup",
      },
      {
        name: "Hair Care",
        slug: "hair-care",
      },
    ],
  },
  {
    name: "Toys & Hobbies",
    slug: "toys-hobbies",
    subcategories: [
      {
        name: "Action Figures",
        slug: "action-figures",
      },
      {
        name: "Building Toys",
        slug: "building-toys",
      },
      {
        name: "Hobbies",
        slug: "hobbies",
      },
    ],
  },
];

export const dummyEndingSoonProducts = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    title: "Premium Wireless Headphones - Studio Quality Audio",
    currentBid: 245,
    buyNowPrice: 350,
    topBidder: "****Khoa",
    totalBids: 23,
    postDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    title: "Luxury Vintage Watch - Limited Edition 2020",
    currentBid: 1250,
    buyNowPrice: 1800,
    topBidder: "****John",
    totalBids: 45,
    postDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
    isNew: true,
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
    title: "Professional DSLR Camera with Lens Kit",
    currentBid: 890,
    topBidder: "****Anna",
    totalBids: 31,
    postDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    title: "Designer Sunglasses - Authentic Brand New",
    currentBid: 180,
    buyNowPrice: 250,
    topBidder: "****Mike",
    totalBids: 18,
    postDate: new Date(Date.now() - 45 * 60 * 1000),
    endDate: new Date(Date.now() + 8 * 60 * 60 * 1000),
    isNew: true,
  },
  {
    id: "5",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop",
    title: "Limited Edition Sneakers - Size 10",
    currentBid: 320,
    topBidder: "****Sarah",
    totalBids: 52,
    postDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 10 * 60 * 60 * 1000),
    isNew: false,
  },
];

export const dummyMostBidsProducts = [
  {
    id: "6",
    image:
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=400&fit=crop",
    title: "Vintage Motorcycle Helmet - Collectors Item",
    currentBid: 420,
    topBidder: "****David",
    totalBids: 67,
    postDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: "7",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    title: "Mechanical Gaming Keyboard RGB",
    currentBid: 155,
    buyNowPrice: 220,
    topBidder: "****Lisa",
    totalBids: 59,
    postDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isNew: true,
  },
  {
    id: "8",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop",
    title: "Smart Watch Series 7 - Like New Condition",
    currentBid: 280,
    topBidder: "****Emma",
    totalBids: 54,
    postDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: "9",
    image:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop",
    title: "Leather Messenger Bag - Handcrafted",
    currentBid: 195,
    topBidder: "****Tom",
    totalBids: 48,
    postDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: "10",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
    title: "Portable Bluetooth Speaker - Waterproof",
    currentBid: 85,
    buyNowPrice: 130,
    topBidder: "****Chris",
    totalBids: 42,
    postDate: new Date(Date.now() - 20 * 60 * 1000),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    isNew: true,
  },
];

export const dummyHighestPriceProducts = [
  {
    id: "11",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    title: "MacBook Pro 16-inch M2 Max - Sealed Box",
    currentBid: 2850,
    buyNowPrice: 3200,
    topBidder: "****James",
    totalBids: 28,
    postDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: "12",
    image:
      "https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=400&h=400&fit=crop",
    title: "Luxury Diamond Necklace - 18K Gold",
    currentBid: 4500,
    topBidder: "****Maria",
    totalBids: 15,
    postDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: "13",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    title: "Professional Drone with 8K Camera",
    currentBid: 1950,
    topBidder: "****Alex",
    totalBids: 34,
    postDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    isNew: true,
  },
  {
    id: "14",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop",
    title: "Antique Grandfather Clock - 1920s",
    currentBid: 3200,
    topBidder: "****Robert",
    totalBids: 22,
    postDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: "15",
    image:
      "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400&h=400&fit=crop",
    title: "Gaming PC RTX 4090 Custom Build",
    currentBid: 2400,
    buyNowPrice: 2900,
    topBidder: "****Kevin",
    totalBids: 41,
    postDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    isNew: true,
  },
];

export const dummyAllProducts = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    title: "Premium Wireless Headphones - Studio Quality Audio",
    currentBid: 245,
    buyNowPrice: 350,
    topBidder: "****Khoa",
    totalBids: 23,
    postDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    isNew: true,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    title: "Luxury Vintage Watch - Limited Edition 2020",
    currentBid: 1250,
    buyNowPrice: 1800,
    topBidder: "****John",
    totalBids: 45,
    postDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
    title: "Professional DSLR Camera with Lens Kit",
    currentBid: 890,
    topBidder: "****Anna",
    totalBids: 31,
    postDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    title: "Designer Sunglasses - Authentic Brand New",
    currentBid: 180,
    buyNowPrice: 250,
    topBidder: "****Mike",
    totalBids: 18,
    postDate: new Date(Date.now() - 30 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 1 * 60 * 60 * 1000),
    isNew: true,
  },
  {
    id: "5",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop",
    title: "Limited Edition Sneakers - Size 10",
    currentBid: 320,
    topBidder: "****Sarah",
    totalBids: 52,
    postDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 10 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: "6",
    image:
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=400&fit=crop",
    title: "Vintage Motorcycle Helmet - Collectors Item",
    currentBid: 420,
    topBidder: "****David",
    totalBids: 67,
    postDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: "7",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    title: "Mechanical Gaming Keyboard RGB",
    currentBid: 155,
    buyNowPrice: 220,
    topBidder: "****Lisa",
    totalBids: 59,
    postDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isNew: true,
  },
  {
    id: "8",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop",
    title: "Smart Watch Series 7 - Like New Condition",
    currentBid: 280,
    topBidder: "****Emma",
    totalBids: 54,
    postDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    isNew: false,
  },
];

export const dummyProductDetails = [
  {
    id: "1",
    title:
      "Premium Wireless Headphones - Studio Quality Audio with Active Noise Cancellation",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop", // Main image
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
    ],
    currentBid: 245,
    buyNowPrice: 350,
    bidStep: 5,
    topBidder: "****Khoa",
    topBidderRating: 96.5,
    totalBids: 23,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    postedDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
    seller: {
      name: "AudioPhile Gear",
      rating: 4.9,
      totalSales: 1234,
    },
    condition: "Brand New",
    category: "Electronics > Audio > Headphones",
    description:
      "Experience sound like never before with these premium wireless headphones. Featuring advanced active noise cancellation, 30-hour battery life, and plush ear cushions for all-day comfort.",
  },
  {
    id: "2",
    title: "Luxury Vintage Watch - Limited Edition 2020 - Swiss Movement",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&h=800&fit=crop",
    ],
    currentBid: 1250,
    buyNowPrice: 1800,
    bidStep: 50,
    topBidder: "****John",
    topBidderRating: 99.0,
    totalBids: 45,
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    seller: {
      name: "Vintage Timekeepers",
      rating: 4.8,
      totalSales: 560,
    },
    condition: "Used - Like New",
    category: "Fashion > Accessories > Watches",
    description:
      "A stunning piece of craftsmanship. This limited edition vintage watch features automatic Swiss movement, a sapphire crystal face, and a genuine leather strap.",
  },
  {
    id: "3",
    title: "Professional DSLR Camera with 18-55mm Lens Kit - 24MP",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop",
    ],
    currentBid: 890,
    buyNowPrice: undefined, // Sản phẩm này không có buyNowPrice ở list
    bidStep: 10,
    topBidder: "****Anna",
    topBidderRating: 95.0,
    totalBids: 31,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    postedDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    seller: {
      name: "Camera Hub",
      rating: 4.7,
      totalSales: 890,
    },
    condition: "Used - Good",
    category: "Electronics > Cameras > DSLR",
    description:
      "Perfect for photography enthusiasts. This DSLR comes with a standard kit lens, charger, and carrying bag. Shutter count is low, approximately 5000 shots.",
  },
  {
    id: "4",
    title: "Designer Sunglasses - Authentic Brand New - UV400 Protection",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&h=800&fit=crop",
    ],
    currentBid: 180,
    buyNowPrice: 250,
    bidStep: 5,
    topBidder: "****Mike",
    topBidderRating: 92.5,
    totalBids: 18,
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
    postedDate: new Date(Date.now() - 30 * 60 * 60 * 1000),
    seller: {
      name: "Fashionista Direct",
      rating: 5.0,
      totalSales: 300,
    },
    condition: "Brand New",
    category: "Fashion > Accessories > Sunglasses",
    description:
      "Step out in style with these authentic designer sunglasses. Full UV400 protection with scratch-resistant lenses. Includes original case and cleaning cloth.",
  },
  {
    id: "5",
    title: "Limited Edition Sneakers - Size 10 - Collectors Choice",
    images: [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=800&fit=crop",
    ],
    currentBid: 320,
    buyNowPrice: undefined,
    bidStep: 10,
    topBidder: "****Sarah",
    topBidderRating: 98.2,
    totalBids: 52,
    endTime: new Date(Date.now() + 10 * 60 * 60 * 1000),
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    seller: {
      name: "Sneakerhead Vault",
      rating: 4.6,
      totalSales: 2100,
    },
    condition: "Used - Very Good",
    category: "Fashion > Footwear > Sneakers",
    description:
      "Rare colorway, sold out everywhere. Worn twice for photoshoots, soles are clean. Box is included but slightly damaged.",
  },
  {
    id: "6",
    title: "Vintage Motorcycle Helmet - 1970s Style Collectors Item",
    images: [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558507340-0b61f9d519b5?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1626847037657-fd3622613ce3?w=800&h=800&fit=crop",
    ],
    currentBid: 420,
    buyNowPrice: undefined,
    bidStep: 20,
    topBidder: "****David",
    topBidderRating: 94.0,
    totalBids: 67,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    seller: {
      name: "Retro Moto",
      rating: 4.9,
      totalSales: 150,
    },
    condition: "Used - Vintage",
    category: "Automotive > Accessories > Helmets",
    description:
      "An authentic vintage helmet from the 70s. Great for display or restoration projects. Interior padding needs replacement if intended for use.",
  },
  {
    id: "7",
    title: "Mechanical Gaming Keyboard RGB - Blue Switches - TKL",
    images: [
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop",
    ],
    currentBid: 155,
    buyNowPrice: 220,
    bidStep: 5,
    topBidder: "****Lisa",
    topBidderRating: 97.5,
    totalBids: 59,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    postedDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    seller: {
      name: "Pro Gamer Shop",
      rating: 4.8,
      totalSales: 4000,
    },
    condition: "Brand New",
    category: "Electronics > Computers > Peripherals",
    description:
      "Dominate the game with this high-performance mechanical keyboard. Features customizable RGB lighting, durable blue switches, and a compact tenkeyless design.",
  },
  {
    id: "8",
    title: "Smart Watch Series 7 - 45mm Aluminum Case - Like New",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=800&fit=crop",
    ],
    currentBid: 280,
    buyNowPrice: undefined,
    bidStep: 10,
    topBidder: "****Emma",
    topBidderRating: 93.8,
    totalBids: 54,
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    seller: {
      name: "Tech Reseller",
      rating: 4.5,
      totalSales: 750,
    },
    condition: "Used - Like New",
    category: "Electronics > Wearables > Smartwatches",
    description:
      "Barely used Series 7 smartwatch. Battery health at 100%. Comes with original charging cable and a spare sport band.",
  },
];

export const dummyBidHistory = [
  { time: "2 minutes ago", bidder: "****Khoa", amount: 245, rating: 96.5 },
  { time: "15 minutes ago", bidder: "****John", amount: 240, rating: 92.0 },
  { time: "32 minutes ago", bidder: "****Khoa", amount: 235, rating: 96.5 },
  { time: "1 hour ago", bidder: "****Sarah", amount: 230, rating: 94.8 },
  { time: "1 hour ago", bidder: "****Mike", amount: 225, rating: 89.5 },
  { time: "2 hours ago", bidder: "****John", amount: 220, rating: 92.0 },
];

export const dummyQAItems = [
  {
    question: "Is this compatible with iPhone?",
    answer:
      "Yes, these headphones work with any Bluetooth-enabled device including all iPhones.",
    askedBy: "****Anna",
    answeredAt: "1 day ago",
  },
  {
    question: "What's the warranty period?",
    answer:
      "Comes with 1-year manufacturer warranty. Extended warranty available at checkout.",
    askedBy: "****Tom",
    answeredAt: "2 days ago",
  },
];

export const dummyRelatedProducts = [
  {
    id: "101",
    image:
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=400&fit=crop",
    title: "Wireless Earbuds Pro",
    currentBid: 85,
    topBidder: "****Lisa",
    totalBids: 15,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    postDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "102",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    title: "Studio Monitor Speakers",
    currentBid: 320,
    buyNowPrice: 450,
    topBidder: "****Chris",
    totalBids: 28,
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    postDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "103",
    image:
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop",
    title: "Audio Interface USB",
    currentBid: 145,
    topBidder: "****Emma",
    totalBids: 12,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    postDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: "104",
    image:
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=400&fit=crop",
    title: "Professional Microphone",
    currentBid: 180,
    topBidder: "****Alex",
    totalBids: 19,
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    postDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: "105",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    title: "Headphone Amplifier",
    currentBid: 95,
    topBidder: "****David",
    totalBids: 8,
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    postDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago (will show as date)
  },
];

export const dumpyWatchist = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
    title: "Premium Wireless Headphones",
    currentBid: 245,
    timeLeft: new Date(Date.now() + 2 * 60 * 60 * 1000),
    totalBids: 23,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
    title: "Luxury Watch Collection",
    currentBid: 890,
    timeLeft: new Date(Date.now() + 5 * 60 * 60 * 1000),
    totalBids: 45,
  },
];

export const dumpyMyBids = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop",
    title: "Designer Sunglasses",
    myBid: 180,
    currentBid: 185,
    isWinning: false,
    timeLeft: new Date(Date.now() + 3 * 60 * 60 * 1000),
    totalBids: 18,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop",
    title: "Vintage Camera",
    myBid: 450,
    currentBid: 450,
    isWinning: true,
    timeLeft: new Date(Date.now() + 6 * 60 * 60 * 1000),
    totalBids: 23,
  },
];

export const dumpyActiveListings = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
    title: "Premium Headphones",
    currentBid: 245,
    timeLeft: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    totalBids: 23,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
    title: "Luxury Watch",
    currentBid: 890,
    timeLeft: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    totalBids: 45,
  },
];

export const dumpyAllReviews = [
  {
    id: "1",
    reviewer: "****Sarah",
    type: "positive",
    comment: "Great buyer, fast payment!",
    date: "2 days ago",
  },
  {
    id: "2",
    reviewer: "****Mike",
    type: "positive",
    comment: "Smooth transaction, highly recommended",
    date: "5 days ago",
  },
  {
    id: "3",
    reviewer: "****Alex",
    type: "negative",
    comment: "Payment was delayed",
    date: "1 week ago",
  },
  {
    id: "4",
    reviewer: "****Emma",
    type: "positive",
    comment: "Excellent seller, item as described",
    date: "2 weeks ago",
  },
  {
    id: "5",
    reviewer: "****David",
    type: "positive",
    comment: "Very professional and quick shipping",
    date: "3 weeks ago",
  },
  {
    id: "6",
    reviewer: "****Lisa",
    type: "positive",
    comment: "Would buy from again!",
    date: "1 month ago",
  },
  {
    id: "7",
    reviewer: "****Tom",
    type: "negative",
    comment: "Item not as expected",
    date: "1 month ago",
  },
  {
    id: "8",
    reviewer: "****Rachel",
    type: "positive",
    comment: "Amazing transaction, highly recommend",
    date: "2 months ago",
  },
];

const dumpyWatchList = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
    title: "Premium Wireless Headphones",
    currentBid: 245,
    timeLeft: new Date(Date.now() + 2 * 60 * 60 * 1000),
    totalBids: 23,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
    title: "Luxury Watch Collection",
    currentBid: 890,
    timeLeft: new Date(Date.now() + 5 * 60 * 60 * 1000),
    totalBids: 45,
  },
];
