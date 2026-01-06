export interface Product {
  id: number;
  name: string;
  currentPrice: number;
  buyNowPrice: number | null;
  postDate: string;
  endDate: string;
  winner: {
    id: string;
    username: string | null;
    fullName: string;
  } | null;
  _count: {
    bids: number;
  };
  images: [{ url: string; isPrimary: boolean }];
  isNew: boolean;
  isWatched: boolean;
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
    username: string | null;
    fullName: string;
    ratingPositive: number;
    ratingCount: number;
  };
  ratings: [{ id: number; type: string }];
  transactions: [{ id: number; status: string }];
  images: [{ url: string; isPrimary: boolean }];
}

export interface Seller {
  id?: string;
  fullName: string;
  ratingPositive?: number;
  ratingCount?: number;
}

export interface Winner {
  id: string;
  fullName: string;
  ratingPositive?: number;
  ratingCount?: number;
}

export interface ProductDetail {
  id: string;
  //title: string;
  name: string;
  images: string[];
  currentPrice: number;
  buyNowPrice?: number;
  stepPrice: number;
  topBidder: string;
  topBidderRating: number;
  _count: {
    bids: number;
  };
  endDate: Date;
  postDate: Date;
  seller: Seller;
  sellerId?: string;
  winner: Winner;
  condition: string;
  categoryId: number;
  description: string;
  isWatched: boolean;
}
