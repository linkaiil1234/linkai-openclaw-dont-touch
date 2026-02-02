import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileEditIcon, Loading03Icon } from "@hugeicons/core-free-icons";

interface TextSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  text: string;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const TextSheet = ({
  open,
  onOpenChange,
  text,
  onTextChange,
  onSubmit,
  isSubmitting,
}: TextSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={FileEditIcon} className="h-5 w-5" />
            Train with Text
          </SheetTitle>
          <SheetDescription>
            Enter text content that your agent should learn from
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Training Text
            </label>
            <Textarea
              placeholder="Enter the text content you want your agent to learn from..."
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              className="min-h-[300px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Add any information, FAQs, or knowledge you want your agent to
              have
            </p>
          </div>

          <Button
            onClick={onSubmit}
            disabled={!text.trim() || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="h-4 w-4 mr-2 animate-spin"
                />
                Processing...
              </>
            ) : (
              "Add Text"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
