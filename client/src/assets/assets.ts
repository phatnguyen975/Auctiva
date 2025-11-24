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
