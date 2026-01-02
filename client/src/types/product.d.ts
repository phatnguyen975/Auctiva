export interface Product {
  id: string;
  image: string;
  title: string;
  currentBid: number;
  buyNowPrice?: number;
  topBidder: string;
  totalBids: number;
  postDate: Date;
  endDate: Date;
  isNew?: boolean;
}

export interface ActiveProduct {
  id: number;
  name: string;
  currentPrice: number;
  endDate: string;
  images: [{ url: string; isPrimary: boolean }];
  _count: {
    bids: number;
  };
}

export interface SoldProduct {
  id: number;
  name: string;
  currentPrice: number;
  winner: {
    id: string;
    username: string;
    fullName: string;
    ratingPositive: number;
    ratingCount: number;
  };
  images: [{ url: string; isPrimary: boolean }];
  transactions: [{ id: number; status: string }];
  rating: { id: number } | null;
}

export interface Seller {
  id?: string;
  name: string;
  rating: number;
  totalSales: number;
}

export interface ProductDetail {
  id: string;
  title: string;
  images: string[];
  currentPrice: number;
  buyNowPrice?: number;
  bidStep: number;
  topBidder: string;
  topBidderRating: number;
  totalBids: number;
  endTime: Date;
  postedDate: Date;
  seller: Seller;
  sellerId?: string;
  condition: string;
  category: string;
  description: string;
}
