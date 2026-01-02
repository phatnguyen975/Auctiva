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
