import React, { createContext, useContext, useState } from "react";

// 1. Tạo Context để lưu trữ tab nào đang active
type TabsContextType = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// 2. Component cha: Tabs
// Nhiệm vụ: Giữ state (tab nào đang mở) và cung cấp Context
interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, className, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`flex flex-col gap-2 ${className || ""}`}>{children}</div>
    </TabsContext.Provider>
  );
}

// 3. Component danh sách: TabsList
// Nhiệm vụ: Tạo khung nền xám chứa các nút
export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-4 items-center justify-between rounded-4xl bg-gray-200/50 p-2 text-muted-foreground ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}

// 4. Component nút bấm: TabsTrigger
// Nhiệm vụ: Bấm vào thì đổi activeTab. Nếu đang active thì đổi màu nền.
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`
        whitespace-nowrap rounded-4xl md:px-1.5 lg:px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50
        ${
          isActive
            ? "bg-gray-300 text-foreground shadow-sm" // Style khi Active
            : "hover:bg-gray-300/50 hover:text-foreground" // Style khi chưa Active
        }
        ${className || ""}
      `}
    >
      {children}
    </button>
  );
}

// 5. Component nội dung: TabsContent
// Nhiệm vụ: Chỉ hiện ra nếu value khớp với activeTab
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  const { activeTab } = context;

  // Nếu không phải tab đang chọn thì không render gì cả (ẩn đi)
  if (activeTab !== value) return null;

  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}
