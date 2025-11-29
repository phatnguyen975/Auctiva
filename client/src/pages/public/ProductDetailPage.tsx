import { useEffect, useRef, useState } from "react";

import {
  Heart,
  Star,
  User,
  AlertCircle,
  ShoppingCart,
  Calendar,
  Award,
  Ban,
  TrendingUp,
  DollarSign,
  Eye,
  Package,
  BanknoteArrowUp,
} from "lucide-react";

import type { ProductDetail } from "../../types/product";
import {
  dummyProductDetails,
  dummyBidHistory,
  dummyQAItems,
  dummyRelatedProducts,
} from "../../assets/assets";
import { useParams } from "react-router-dom";

import CountdownTimer from "../../components/details_product/CountdownTimer";
import { formatPostDate } from "../../utils/date";
import Input from "../../components/ui/Input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/details_product/Tabs";
import { ProductCard } from "../../components/product/ProductCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/details_product/Table";
import BanModal from "../../components/details_product/BanModal";

const ProductDetailPage = () => {
  const [role, setRole] = useState<"guest" | "bidder" | "seller">("seller");
  const [product, setProduct] = useState<ProductDetail | null>();

  const [selectedImage, setSelectedImage] = useState(0);
  const [currentTab, setCurrentTab] = useState("description");
  const tabsSectionRef = useRef<HTMLDivElement>(null);

  const [bidAmount, setBidAmount] = useState("");
  const [question, setQuestion] = useState("");
  const [banningInfo, setBanningInfo] = useState<{
    bid: any;
    index: number;
  } | null>(null);

  const userRating = 92; // Mock Rating of User

  const suggestedBid = (product?.currentBid || 0) + (product?.bidStep || 0);

  const { id: productID } = useParams();

  // Mock fetch data
  useEffect(() => {
    const loadProduct = async () => {
      const res = dummyProductDetails.find((p) => p.id === productID);

      if (res) setProduct(res);
    };

    loadProduct();
  }, []);

  //console.log(product);

  const handleConfirmBan = () => {
    if (!banningInfo) return;

    console.log("Banning user:", banningInfo.bid.bidder);

    setBanningInfo(null);
  };

  const handleViewQuestions = () => {
    console.log("Clicked");
    setCurrentTab("qa");

    // Cuộn màn hình xuống vị trí Tabs
    if (tabsSectionRef.current) {
      tabsSectionRef.current.scrollIntoView({
        behavior: "smooth", // Cuộn mượt
        block: "start", // Canh đầu phần tử lên đầu màn hình
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-card rounded-lg overflow-hidden">
              <img
                src={product?.images?.[selectedImage]}
                alt={product?.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product?.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-primary scale-95"
                      : "border-transparent hover:border-muted"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Info & Bidding */}
          <div className="space-y-6">
            {/* Title with Seller Badge */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold">{product?.title}</h1>
                {role == "seller" && (
                  <span
                    className=" inline-flex items-center  justify-center rounded-md border px-2 py-0.5 text-xs font-medium  w-fit whitespace-nowrap 
                    bg-gray-400/60 text-primary border-primary shrink-0 gap-1"
                  >
                    <Package className="h-3 w-3" />
                    Your Product
                  </span>
                )}
              </div>

              {/* Seller Info */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-400/50 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{product?.seller.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {product?.seller.totalSales} sales
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{product?.seller.rating}%</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-card rounded-lg p-6 space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Current Bid
                </div>
                <div className="text-4xl font-bold text-primary">
                  ${product?.currentBid.toLocaleString()}
                </div>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <div className="text-sm text-muted-foreground">
                    {product?.totalBids} bids · Top bidder: {product?.topBidder}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-amber-600">
                      {product?.topBidderRating}%
                    </span>
                  </div>
                </div>
              </div>

              {product?.buyNowPrice && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-1">
                    Buy It Now
                  </div>
                  <div className="text-2xl font-bold">
                    ${product?.buyNowPrice.toLocaleString()}
                  </div>
                </div>
              )}

              {/* Countdown */}
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">
                  Time Left
                </div>
                {product?.endTime && (
                  <CountdownTimer endTime={product.endTime} />
                )}
              </div>

              {/* Posted Date and Category */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Posted:</span>
                  <span className="font-medium">
                    {product?.postedDate && formatPostDate(product.postedDate)}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span
                    className=" inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap 
                    bg-gray-300/60 text-primary border-none shrink-0 gap-1"
                  >
                    {product?.condition}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {product?.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Bidding Controls OR Seller Performance Stats */}
            {role != "seller" ? (
              /* Bidding Controls - For Bidders/Guests */
              <div className="bg-card rounded-lg p-6 space-y-4">
                {userRating < 80 ? (
                  <div className="relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[20px_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start text-destructive bg-card border-destructive">
                    {/* Icon AlertCircle */}
                    <AlertCircle className="text-red-400 h-4 w-4 translate-y-0.5 text-destructive" />
                    {/* Nội dung AlertDescription */}
                    <div className="col-start-2 text-sm text-red-500 leading-relaxed text-destructive/90">
                      You need a rating of at least 80% to place bids. Your
                      current rating: {userRating}%
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Enter Your Bid
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            icon={BanknoteArrowUp}
                            type="number"
                            placeholder={`Min $${suggestedBid}`}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="text-lg"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            Suggested: ${suggestedBid} (Current + $
                            {product?.bidStep})
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-black text-white px-4 py-3 rounded-lg cursor-pointer text-sm font-semibold">
                      Place Bid
                    </button>
                  </>
                )}

                {product?.buyNowPrice && (
                  <button className="flex justify-center items-center w-full bg-gray-300 text-black px-4 py-3 rounded-lg cursor-pointer text-sm font-semibold">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Buy Now - ${product.buyNowPrice}
                  </button>
                )}

                <button className="flex justify-center items-center w-full bg-transparent hover:bg-gray-200 text-black px-4 py-3 rounded-lg cursor-pointer text-sm font-semibold">
                  <Heart className="h-5 w-5 mr-2" />
                  Add to Watchlist
                </button>
              </div>
            ) : (
              /* Seller Performance Stats - For Seller */
              <div className="bg-card rounded-lg p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Listing Performance</h3>
                  <span
                    className=" inline-flex items-center  justify-center rounded-md border px-2 py-0.5 text-xs font-medium  w-fit whitespace-nowrap 
                    bg-primary/10 text-primary border-primary shrink-0 gap-1"
                  >
                    Active
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Total Views */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Total Views
                      </span>
                    </div>
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-xs text-green-600 dark:text-green-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12% today
                    </div>
                  </div>

                  {/* Watchers */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Watchers
                      </span>
                    </div>
                    <div className="text-2xl font-bold">34</div>
                    <div className="text-xs text-green-600 dark:text-green-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +5 today
                    </div>
                  </div>

                  {/* Total Bids */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Total Bids
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {product?.totalBids}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      from{" "}
                      {
                        dummyBidHistory.filter(
                          (b, i, arr) =>
                            arr.findIndex((a) => a.bidder === b.bidder) === i
                        ).length
                      }{" "}
                      bidders
                    </div>
                  </div>

                  {/* Potential Revenue */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Est. Revenue
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      ${product?.currentBid}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Current bid
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t space-y-2">
                  <button className="w-full flex items-center justify-start  bg-gray-300 text-black px-4 py-1 rounded-lg cursor-pointer text-sm font-semibold">
                    <Package className="h-4 w-4 mr-2" />
                    View in Dashboard
                  </button>
                  <button
                    className="w-full flex items-center justify-start bg-transparent text-gray-400 px-4 py-1 rounded-lg cursor-pointer text-sm font-semibold hover:bg-gray-300/20 hover:text-black/70"
                    onClick={handleViewQuestions}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    View Questions ({dummyQAItems.length})
                  </button>
                </div>

                {/* Alert */}
                <div className="relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[20px_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start justify-center text-destructive bg-card border-destructive bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  {/* Icon AlertCircle */}
                  <AlertCircle className="h-4 w-4 translate-y-0.5 text-black dark:text-blue-400" />
                  {/* Nội dung AlertDescription */}
                  <div className="col-start-2 text-sm leading-relaxed text-destructive/90 text-blue-800 dark:text-blue-200">
                    You cannot bid on your own products. Manage bids in the "Bid
                    History" tab.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div ref={tabsSectionRef} className="mt-10">
          <Tabs
            defaultValue="description"
            className="w-full"
            value={currentTab}
            onValueChange={setCurrentTab}
          >
            {/* Phần List buttons */}
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="bids">
                Bid History ({dummyBidHistory.length})
              </TabsTrigger>
              <TabsTrigger value="qa">Q&A ({dummyQAItems.length})</TabsTrigger>
              <TabsTrigger value="related">Related Items</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="mt-6">
              <div className="bg-card rounded-lg p-8">
                <div className="space-y-6">
                  {/* Main Description */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      Product Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Experience premium audio quality with these studio-grade
                      wireless headphones. Perfect for music production, gaming,
                      or everyday listening.
                    </p>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Key Features
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">
                          Active Noise Cancellation (ANC) technology
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">
                          40-hour battery life with quick charging
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">
                          Premium memory foam ear cushions
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">
                          Bluetooth 5.0 with aptX HD support
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">
                          Foldable design with hard carrying case
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">
                          Built-in microphone for calls
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Condition */}
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Condition</h4>
                    <p className="text-sm text-muted-foreground">
                      Brand new, sealed in original packaging with full
                      manufacturer warranty.
                    </p>
                  </div>

                  {/* What's Included */}
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">What's Included</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>Headphones</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>USB-C cable</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>3.5mm cable</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>Carrying case</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>User manual</span>
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">
                      Technical Specifications
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-muted">
                        <span className="text-muted-foreground">
                          Connectivity
                        </span>
                        <span className="font-medium">Bluetooth 5.0</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-muted">
                        <span className="text-muted-foreground">
                          Battery Life
                        </span>
                        <span className="font-medium">Up to 40 hours</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-muted">
                        <span className="text-muted-foreground">
                          Charging Port
                        </span>
                        <span className="font-medium">USB-C</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-muted">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-medium">250g</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-muted">
                        <span className="text-muted-foreground">
                          Driver Size
                        </span>
                        <span className="font-medium">40mm</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-muted">
                        <span className="text-muted-foreground">Impedance</span>
                        <span className="font-medium">32 Ohm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Bids Tab */}
            <TabsContent value="bids" className="mt-6">
              <div className="bg-card rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Bidder</TableHead>
                      <TableHead className="text-right">Bid Amount</TableHead>
                      {role === "seller" && (
                        <TableHead className="text-right">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyBidHistory.map((bid, index) => (
                      <TableRow key={index}>
                        <TableCell>{bid.time}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{bid.bidder}</div>
                              <div className="text-muted-foreground text-xs">
                                {bid.rating}% rating
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${bid.amount}
                        </TableCell>
                        {role === "seller" && (
                          <TableCell className="text-right">
                            <button
                              onClick={() => setBanningInfo({ bid, index })} // Lưu info vào state để mở modal
                              className="inline-flex items-center bg-transparent text-red-500 px-3 py-2 rounded-lg cursor-pointer text-sm font-semibold hover:bg-red-50 transition-colors"
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Ban User
                            </button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Q&A Tab */}
            <TabsContent value="qa" className="mt-6">
              <div className="space-y-6">
                {/* Ask Question */}
                <div className="bg-card rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Ask a Question</h3>
                  <div className="space-y-3">
                    <textarea
                      className="resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="Type your question here..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      rows={3}
                    />
                    <button className="bg-black text-white px-4 py-3 rounded-lg cursor-pointer text-sm font-semibold">
                      Submit Question
                    </button>
                  </div>
                </div>

                {/* Q&A List */}
                <div className="space-y-4">
                  {dummyQAItems.map((item, index) => (
                    <div key={index} className="bg-card rounded-lg p-6">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-start gap-2">
                            <span className="text-primary font-semibold">
                              Q:
                            </span>
                            <div className="flex-1">
                              <p className="font-medium">{item.question}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Asked by {item.askedBy}
                              </p>
                            </div>
                          </div>
                        </div>
                        {item.answer && (
                          <div className="flex items-start gap-2 pl-6 border-l-2 border-primary/20">
                            <span className="text-secondary font-semibold">
                              A:
                            </span>
                            <div className="flex-1">
                              <p>{item.answer}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.answeredAt}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Related Items Tab */}
            <TabsContent value="related" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {dummyRelatedProducts.map((rp) => (
                  <ProductCard
                    key={rp.id}
                    id={rp.id}
                    title={rp.title}
                    currentBid={rp.currentBid}
                    buyNowPrice={rp.buyNowPrice}
                    topBidder={rp.topBidder}
                    totalBids={rp.totalBids}
                    image={rp.image}
                    postDate={rp.postedDate}
                    endDate={rp.endTime}
                    viewMode="grid"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {banningInfo && (
        <BanModal
          isOpen={true} // Luôn true vì ta control bằng việc render có điều kiện (banningInfo &&)
          onClose={() => setBanningInfo(null)} // Đóng modal bằng cách set null
          onConfirm={handleConfirmBan}
          // Truyền data vào
          bidderName={banningInfo.bid.bidder}
          isHighestBidder={banningInfo.index === 0}
          nextBidderName={dummyBidHistory[1]?.bidder}
          nextBidderAmount={dummyBidHistory[1]?.amount}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
