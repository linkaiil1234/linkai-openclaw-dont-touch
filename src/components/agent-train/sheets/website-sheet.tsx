import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { HugeiconsIcon } from "@hugeicons/react";
import { Globe02Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { UrlInput } from "@/components/shared/url-input";

interface WebsiteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteUrl: string;
  onWebsiteUrlChange: (url: string) => void;
  enableCrawl: boolean;
  onEnableCrawlChange: (enabled: boolean) => void;
  showUrlSelection: boolean;
  onShowUrlSelectionChange: (show: boolean) => void;
  crawlMapUrls: string[];
  onCrawlMapUrlsChange: (urls: string[]) => void;
  selectedUrls: string[];
  onSelectedUrlsChange: (urls: string[]) => void;
  isGettingCrawlMap: boolean;
  isCreatingWebsiteAsset: boolean;
  onGetCrawlMap: (url: string) => void;
  onCreateWebsiteAsset: (urls: string[]) => void;
  onValidateUrl: (url: string) => { isValid: boolean; errorMessage?: string };
}

export const WebsiteSheet = ({
  open,
  onOpenChange,
  websiteUrl,
  onWebsiteUrlChange,
  enableCrawl,
  onEnableCrawlChange,
  showUrlSelection,
  onShowUrlSelectionChange,
  crawlMapUrls,
  onCrawlMapUrlsChange,
  selectedUrls,
  onSelectedUrlsChange,
  isGettingCrawlMap,
  isCreatingWebsiteAsset,
  onGetCrawlMap,
  onCreateWebsiteAsset,
  onValidateUrl,
}: WebsiteSheetProps) => {
  const handleSubmit = () => {
    const validation = onValidateUrl(websiteUrl);
    if (!validation.isValid) {
      return;
    }

    // Automatically add https:// if not provided
    const fullUrl = websiteUrl.startsWith("http")
      ? websiteUrl
      : `https://${websiteUrl}`;

    if (enableCrawl) {
      onGetCrawlMap(fullUrl);
    } else {
      onCreateWebsiteAsset([fullUrl]);
    }
  };

  const handleBack = () => {
    onShowUrlSelectionChange(false);
    onCrawlMapUrlsChange([]);
    onSelectedUrlsChange([]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Globe02Icon} className="h-5 w-5" />
            Train from Website
          </SheetTitle>
          <SheetDescription>
            Enter a website URL to scrape and train your agent from
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 p-4">
          {!showUrlSelection ? (
            <>
              {/* Step 1: Enter URL and Get Map */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Website URL
                </label>
                <UrlInput
                  value={websiteUrl}
                  onChange={onWebsiteUrlChange}
                  onAdd={handleSubmit}
                  onClose={() => onWebsiteUrlChange("")}
                  disabled={isGettingCrawlMap || isCreatingWebsiteAsset}
                  placeholder="example.com"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a website URL to scrape and train your agent from
                </p>
              </div>

              {/* Crawl Switch */}
              <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="crawl-switch" className="text-sm font-medium">
                    Scraping Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {enableCrawl
                      ? "Full Website (all following links)"
                      : "Individual Page Only"}
                  </p>
                </div>
                <Switch
                  id="crawl-switch"
                  checked={enableCrawl}
                  onCheckedChange={(checked) => {
                    onEnableCrawlChange(checked);
                    if (!checked) {
                      // Reset URL selection when switching to individual page
                      onCrawlMapUrlsChange([]);
                      onSelectedUrlsChange([]);
                      onShowUrlSelectionChange(false);
                    }
                  }}
                />
              </div>

              <Button
                className="w-full"
                disabled={
                  !websiteUrl.trim() ||
                  isGettingCrawlMap ||
                  isCreatingWebsiteAsset
                }
                onClick={handleSubmit}
              >
                {isGettingCrawlMap ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="h-4 w-4 mr-2 animate-spin"
                    />
                    Getting URLs...
                  </>
                ) : isCreatingWebsiteAsset ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="h-4 w-4 mr-2 animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <HugeiconsIcon
                      icon={Globe02Icon}
                      className="h-4 w-4 mr-2"
                    />
                    {enableCrawl ? "Get URLs" : "Scrape Page"}
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Step 2: URL Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Select URLs to Scrape
                  </label>
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    Back
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    checked={selectedUrls.length === crawlMapUrls.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onSelectedUrlsChange(crawlMapUrls);
                      } else {
                        onSelectedUrlsChange([]);
                      }
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    Select All ({selectedUrls.length}/{crawlMapUrls.length})
                  </span>
                </div>
              </div>

              {/* URL List with Checkboxes */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto hide-scrollbar pr-2">
                {crawlMapUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedUrls.includes(url)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onSelectedUrlsChange([...selectedUrls, url]);
                        } else {
                          onSelectedUrlsChange(
                            selectedUrls.filter((u) => u !== url),
                          );
                        }
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm break-all">{url}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Confirm Button */}
              <Button
                className="w-full"
                disabled={selectedUrls.length === 0 || isCreatingWebsiteAsset}
                onClick={() => onCreateWebsiteAsset(selectedUrls)}
              >
                {isCreatingWebsiteAsset ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="h-4 w-4 mr-2 animate-spin"
                    />
                    Scraping {selectedUrls.length} URLs...
                  </>
                ) : (
                  <>
                    <HugeiconsIcon
                      icon={Globe02Icon}
                      className="h-4 w-4 mr-2"
                    />
                    Scrape {selectedUrls.length} Selected URLs
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
