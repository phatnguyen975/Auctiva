import { useState, useRef, useEffect } from "react";
import { Upload, XCircle, HelpCircle } from "lucide-react";

const CreateListingPage = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [autoExtension, setAutoExtension] = useState(false);
  const [allowInstantPurchase, setAllowInstantPurchase] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editorRef.current?.contains(document.activeElement)) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            executeCommand("bold");
            break;
          case "i":
            e.preventDefault();
            executeCommand("italic");
            break;
          case "u":
            e.preventDefault();
            executeCommand("underline");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setDescription(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      executeCommand("insertImage", url);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setUploadedImages([...uploadedImages, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-3xl font-bold">Create New Listing</h2>

      {/* Form Card */}
      <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <label htmlFor="productName" className="text-sm font-medium block">
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              placeholder="Enter product name"
              className="w-full text-lg rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">Product Images</label>
            <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center bg-[hsl(var(--muted)/0.1)] hover:bg-[hsl(var(--muted)/0.2)] transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-3 text-[hsl(var(--muted-foreground))]" />
                <p className="font-medium mb-1">Drag & drop images here</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                  or click to browse
                </p>
                <p className="text-xs text-[hsl(var(--destructive))] font-medium">
                  Minimum 3 photos required
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
                  PNG, JPG, WEBP up to 5MB each
                </p>
              </label>
            </div>

            {/* Preview Uploaded Images */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {uploadedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border border-[hsl(var(--border))]"
                  >
                    <img
                      src={img}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setUploadedImages(
                          uploadedImages.filter((_, i) => i !== idx)
                        )
                      }
                      className="absolute top-2 right-2 bg-[hsl(var(--destructive))] text-white rounded-full p-1 hover:bg-[hsl(var(--destructive)/0.9)] hover:cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="startingPrice"
                className="text-sm font-medium block"
              >
                Starting Price ($)
              </label>
              <input
                id="startingPrice"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="stepPrice" className="text-sm font-medium block">
                Bid Step ($)
              </label>
              <input
                id="stepPrice"
                type="number"
                placeholder="5.00"
                min="0"
                step="0.01"
                className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="buyNowPrice"
                className="text-sm font-medium block"
              >
                Buy Now Price (Optional)
              </label>
              <input
                id="buyNowPrice"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
          </div>

          {/* Description - WYSIWYG Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">
              Product Description
            </label>
            <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden">
              {/* Toolbar */}
              <div className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] p-2 flex flex-wrap gap-1">
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    executeCommand("bold");
                  }}
                  className="h-8 px-2 rounded-md hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-colors"
                  title="Bold (Ctrl+B)"
                >
                  <span className="font-bold">B</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    executeCommand("italic");
                  }}
                  className="h-8 px-2 rounded-md hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-colors"
                  title="Italic (Ctrl+I)"
                >
                  <span className="italic">I</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    executeCommand("underline");
                  }}
                  className="h-8 px-2 rounded-md hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-colors"
                  title="Underline (Ctrl+U)"
                >
                  <span className="underline">U</span>
                </button>
                <div className="w-px h-8 bg-[hsl(var(--border))] mx-1"></div>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    executeCommand("formatBlock", "<h1>");
                  }}
                  className="h-8 px-2 rounded-md hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-colors"
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    executeCommand("formatBlock", "<h2>");
                  }}
                  className="h-8 px-2 rounded-md hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-colors"
                  title="Heading 2"
                >
                  H2
                </button>
                <div className="w-px h-8 bg-[hsl(var(--border))] mx-1"></div>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    executeCommand("insertUnorderedList");
                  }}
                  className="h-8 px-2 rounded-md hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-colors"
                  title="Bullet List"
                >
                  • List
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    executeCommand("insertOrderedList");
                  }}
                  className="h-8 px-2 rounded-md hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-colors"
                  title="Numbered List"
                >
                  1. List
                </button>
                <div className="w-px h-8 bg-[hsl(var(--border))] mx-1"></div>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertLink();
                  }}
                  className="h-8 px-2 rounded-md hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-colors"
                  title="Insert Link"
                >
                  Link
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertImage();
                  }}
                  className="h-8 px-2 rounded-md hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-colors"
                  title="Insert Image"
                >
                  Image
                </button>
              </div>
              {/* Editor Area - ContentEditable */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                className="w-full min-h-[200px] border-0 rounded-none px-3 py-2 focus:outline-none bg-[hsl(var(--background))] overflow-y-auto"
                style={{ whiteSpace: "pre-wrap" }}
                suppressContentEditableWarning
                data-placeholder="Describe your product in detail..."
              />
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Rich text editor for detailed product descriptions
            </p>
            <style>{`
              [contentEditable][data-placeholder]:empty:before {
                content: attr(data-placeholder);
                color: hsl(var(--muted-foreground));
                opacity: 0.6;
              }
              [contentEditable]:focus {
                outline: none;
              }
              [contentEditable] h1 {
                font-size: 1.875rem;
                font-weight: bold;
                margin: 0.5rem 0;
              }
              [contentEditable] h2 {
                font-size: 1.5rem;
                font-weight: bold;
                margin: 0.5rem 0;
              }
              [contentEditable] ul {
                list-style-type: disc;
                padding-left: 2rem;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
              }
              [contentEditable] ol {
                list-style-type: decimal;
                padding-left: 2rem;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
              }
              [contentEditable] li {
                margin: 0.25rem 0;
              }
              [contentEditable] a {
                color: hsl(var(--primary));
                text-decoration: underline;
              }
              [contentEditable] img {
                max-width: 100%;
                height: auto;
                margin: 0.5rem 0;
              }
            `}</style>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">
              Additional Information
            </label>
            <textarea
              placeholder="Enter any additional information about the product..."
              className="w-full min-h-[100px] rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] resize-none"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Provide any extra details that might be helpful for buyers
            </p>
          </div>

          {/* Auto-Extension Setting */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[hsl(var(--muted)/0.5)] rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="auto-extension"
                  checked={autoExtension}
                  onChange={(e) => setAutoExtension(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <label
                  htmlFor="auto-extension"
                  className="cursor-pointer text-sm font-medium"
                >
                  Enable Auto-Extension
                </label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-[hsl(var(--muted-foreground))] cursor-help" />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-max max-w-xs scale-0 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 origin-bottom">
                    <div className="bg-black text-white rounded-md px-3 py-1.5 text-xs">
                      If a bid occurs in the last 5 minutes, auction extends by
                      10 minutes
                    </div>
                  </div>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                  autoExtension
                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                    : "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"
                }`}
              >
                {autoExtension ? "Enabled" : "Disabled"}
              </span>
            </div>

            {/* Allow Instant Purchase Setting */}
            <div className="flex items-center justify-between p-4 bg-[hsl(var(--muted)/0.5)] rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="instant-purchase"
                  checked={allowInstantPurchase}
                  onChange={(e) => setAllowInstantPurchase(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <label
                  htmlFor="instant-purchase"
                  className="cursor-pointer text-sm font-medium"
                >
                  Allow Instant Purchase
                </label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-[hsl(var(--muted-foreground))] cursor-help" />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-max max-w-xs scale-0 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 origin-bottom">
                    <div className="bg-black text-white rounded-md px-3 py-1.5 text-xs">
                      Allow anyone to purchase this item instantly at the "Buy
                      Now" price without bidding
                    </div>
                  </div>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                  allowInstantPurchase
                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                    : "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"
                }`}
              >
                {allowInstantPurchase ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center bg-slate-900 text-white shadow-sm rounded-md text-sm font-medium transition-all hover:bg-[hsl(var(--primary)/0.9)] hover:cursor-pointer h-10 px-4"
            >
              Create Listing
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--primary)/0.9)] hover:text-[hsl(var(--primary-foreground))] hover:cursor-pointer h-10 px-4"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;
