import { useState } from "react";

import { Award } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/Tabs";

import { BidHistoryTable } from "./BidHistoryTable";
import { ProductCard } from "../ProductCard";

// Interface cho Props
interface ProductDetailTabsProps {
  currentTab: string;
  onTabChange: (val: string) => void;
  role: string;
  userId?: string;
  productSellerId?: string;

  // Data
  bidHistory: any[];
  qaItems: any[];
  relatedProducts: any[];

  // Handlers
  onBanUser: (bid: any, index: number) => void;
  onPostQuestion: (content: string) => void;
  onPostAnswer: (qId: number, content: string) => void;
}

const ProductDetailTabs = ({
  currentTab,
  onTabChange,
  role,
  userId,
  productSellerId,
  bidHistory,
  qaItems,
  relatedProducts,
  onPostQuestion,
  onPostAnswer,
  onBanUser,
}: ProductDetailTabsProps) => {
  const [localQuestion, setLocalQuestion] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState("");

  const isOwner = userId && productSellerId && userId === productSellerId;

  const handleReplySubmit = (questionId: number) => {
    if (!answerText.trim()) return;
    onPostAnswer(questionId, answerText);
    setAnswerText("");
    setReplyingTo(null);
  };

  return (
    <Tabs
      defaultValue="description"
      className="w-full"
      value={currentTab}
      onValueChange={onTabChange}
    >
      {/* --- Tab Navigation --- */}
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="bids">
          Bid History ({bidHistory.length})
        </TabsTrigger>
        <TabsTrigger value="qa">Q&A ({qaItems.length})</TabsTrigger>
        <TabsTrigger value="related">Related Items</TabsTrigger>
      </TabsList>

      {/* --- 1. DESCRIPTION TAB --- */}
      <TabsContent value="description" className="mt-6">
        <div className="bg-card rounded-lg p-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">
                Product Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Experience premium audio quality with these studio-grade
                wireless headphones...
              </p>
            </div>

            {/* Key Features Section */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" /> Key Features
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* ... List items ... */}
                <li className="flex items-start gap-2">
                  <span className="text-sm">
                    Active Noise Cancellation (ANC) technology
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm">40-hour battery life</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-sm">
                    Premium memory foam ear cushions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-sm">
                    Bluetooth 5.0 with aptX HD support
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-sm">
                    Foldable design with hard carrying case
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-sm">Built-in microphone for calls</span>
                </li>
              </ul>
            </div>

            {/* Condition */}
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Condition</h4>
              <p className="text-sm text-muted-foreground">
                Brand new, sealed in original packaging with full manufacturer
                warranty.
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
              <h4 className="font-semibold mb-3">Technical Specifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-muted">
                  <span className="text-muted-foreground">Connectivity</span>
                  <span className="font-medium">Bluetooth 5.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-muted">
                  <span className="text-muted-foreground">Battery Life</span>
                  <span className="font-medium">Up to 40 hours</span>
                </div>
                <div className="flex justify-between py-2 border-b border-muted">
                  <span className="text-muted-foreground">Charging Port</span>
                  <span className="font-medium">USB-C</span>
                </div>
                <div className="flex justify-between py-2 border-b border-muted">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">250g</span>
                </div>
                <div className="flex justify-between py-2 border-b border-muted">
                  <span className="text-muted-foreground">Driver Size</span>
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

      {/* --- 2. BIDS TAB (Đã gọn gàng nhờ component riêng) --- */}
      <TabsContent value="bids" className="mt-6">
        <BidHistoryTable bids={bidHistory} role={role} onBanUser={onBanUser} />
      </TabsContent>

      <TabsContent value="qa" className="mt-6">
        <div className="space-y-6">
          {/* Form đặt câu hỏi: Chỉ hiện nếu không phải chủ sản phẩm */}
          {!isOwner && (
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4">Ask a Question</h3>
              <textarea
                className="w-full rounded-md border p-3 min-h-16 bg-slate-50"
                placeholder="Type your question here..."
                value={localQuestion}
                onChange={(e) => setLocalQuestion(e.target.value)}
              />
              <button
                onClick={() => {
                  onPostQuestion(localQuestion);
                  setLocalQuestion("");
                }}
                className="mt-3 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 hover:cursor-pointer hover:opacity-80"
              >
                Submit Question
              </button>
            </div>
          )}

          {/* Danh sách Q&A */}
          <div className="space-y-4">
            {qaItems.map((item) => (
              <div key={item.id} className="bg-card rounded-lg p-6 border">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">Q:</span>
                  <div className="flex-1">
                    <p className="font-medium">{item.question}</p>
                    <p className="text-xs text-muted-foreground">
                      Asked by {item.bidder?.fullName}
                    </p>

                    {/* Nút Reply cho Seller nếu chưa có câu trả lời */}
                    {isOwner &&
                      item.answers?.length === 0 &&
                      replyingTo !== item.id && (
                        <button
                          onClick={() => setReplyingTo(item.id)}
                          className="text-xs text-blue-600 font-bold mt-2 hover:underline hover:cursor-pointer"
                        >
                          Reply to this question
                        </button>
                      )}
                  </div>
                </div>

                {/* Hiển thị danh sách câu trả lời [cite: 9] */}
                {item.answers?.map((ans: any) => (
                  <div
                    key={ans.id}
                    className="flex items-start gap-2 pl-6 mt-3 border-l-2 border-primary/20 bg-slate-50 p-2 rounded"
                  >
                    <span className="text-secondary font-bold">A:</span>
                    <p className="text-sm">{ans.answer}</p>
                  </div>
                ))}

                {/* Form nhập câu trả lời của Seller */}
                {replyingTo === item.id && (
                  <div className="mt-3 pl-6 space-y-3">
                    <textarea
                      className="w-full border border-gray-300 p-3 text-sm rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Write your answer..."
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReplySubmit(item.id)}
                        disabled={!answerText.trim()}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer hover:opacity-80"
                      >
                        Submit Answer
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setAnswerText("");
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 hover:cursor-pointer hover:opacity-80"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* --- 3. Q&A TAB --- */}
      {/* <TabsContent value="qa" className="mt-6">
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6">
            <h3 className="font-semibold mb-4">Ask a Question</h3>
            <div className="space-y-3">
              <textarea
                className="w-full rounded-md border p-3 min-h-16 bg-input-background resize-none"
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
              />
              <button className="bg-black text-white px-4 py-3 rounded-lg text-sm font-semibold">
                Submit Question
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {qaItems.map((item, index) => (
              <div key={index} className="bg-card rounded-lg p-6">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-semibold">Q:</span>
                  <div>
                    <p className="font-medium">{item.question}</p>
                    <p className="text-xs text-muted-foreground">
                      Asked by {item.askedBy}
                    </p>
                  </div>
                </div>
                {item.answer && (
                  <div className="flex items-start gap-2 pl-6 mt-3 border-l-2 border-primary/20">
                    <span className="text-secondary font-semibold">A:</span>
                    <div>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </TabsContent> */}

      {/* --- 4. RELATED TAB --- */}
      <TabsContent value="related" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {relatedProducts.map((rp) => (
            <ProductCard key={rp.id} {...rp} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProductDetailTabs;
