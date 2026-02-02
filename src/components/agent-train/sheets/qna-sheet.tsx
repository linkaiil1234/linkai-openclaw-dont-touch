import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MessageSecure01Icon,
  Add01Icon,
  Delete02Icon,
  ArrowDown01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export interface QnaBlock {
  id: string;
  title: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

interface QnaSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qnaBlocks: QnaBlock[];
  onQnaBlocksChange: (blocks: QnaBlock[]) => void;
  onSubmit: (formattedText: string) => void;
  isSubmitting: boolean;
}

export const QnaSheet = ({
  open,
  onOpenChange,
  qnaBlocks,
  onQnaBlocksChange,
  onSubmit,
  isSubmitting,
}: QnaSheetProps) => {
  const handleAddBlock = () => {
    const newBlock: QnaBlock = {
      id: `qna_${Date.now()}`,
      title: "",
      question: "",
      answer: "",
      isOpen: true,
    };
    // Collapse all existing blocks and add new one
    onQnaBlocksChange([
      ...qnaBlocks.map((block) => ({ ...block, isOpen: false })),
      newBlock,
    ]);
  };

  const handleToggleBlock = (blockId: string) => {
    onQnaBlocksChange(
      qnaBlocks.map((b) =>
        b.id === blockId
          ? { ...b, isOpen: !b.isOpen }
          : { ...b, isOpen: false },
      ),
    );
  };

  const handleDeleteBlock = (blockId: string) => {
    onQnaBlocksChange(qnaBlocks.filter((b) => b.id !== blockId));
  };

  const handleUpdateBlock = (
    blockId: string,
    field: keyof QnaBlock,
    value: string,
  ) => {
    onQnaBlocksChange(
      qnaBlocks.map((b) => (b.id === blockId ? { ...b, [field]: value } : b)),
    );
  };

  const handleSubmitAll = () => {
    // Format all QNAs into text
    const qnaText = qnaBlocks
      .map((block, index) => {
        const title = block.title ? `Title: ${block.title}\n\n` : "";
        return `Q&A ${index + 1}:\n${title}Question: ${
          block.question
        }\n\nAnswer: ${block.answer}`;
      })
      .join("\n\n---\n\n");

    onSubmit(qnaText);
  };

  const hasInvalidBlocks = qnaBlocks.some(
    (b) => !b.question.trim() || !b.answer.trim(),
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={MessageSecure01Icon} className="h-5 w-5" />
            Train with Q&A
          </SheetTitle>
          <SheetDescription>
            Create question and answer pairs to train your agent
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 p-4">
          {/* Add QNA Block Button */}
          <Button variant="outline" onClick={handleAddBlock} className="w-full">
            <HugeiconsIcon icon={Add01Icon} className="h-4 w-4 mr-2" />
            Add Q&A Block
          </Button>

          {/* QNA Blocks Accordion */}
          {qnaBlocks.length > 0 && (
            <div className="space-y-3 max-h-[500px] overflow-y-auto hide-scrollbar pr-2">
              {qnaBlocks.map((block, index) => (
                <div
                  key={block.id}
                  className="border rounded-lg overflow-hidden bg-muted/30"
                >
                  {/* Accordion Header */}
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleToggleBlock(block.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {block.title || `Q&A Block ${index + 1}`}
                      </p>
                      {block.question && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          Q: {block.question}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlock(block.id);
                        }}
                        className="h-8 w-8"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          className="h-4 w-4 text-destructive"
                        />
                      </Button>
                      <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          block.isOpen && "rotate-180",
                        )}
                      />
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {block.isOpen && (
                    <div className="p-3 space-y-3 border-t">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Title (Optional)
                        </label>
                        <Input
                          placeholder="e.g., Product Information"
                          value={block.title}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, "title", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Question
                        </label>
                        <Textarea
                          placeholder="Enter the question..."
                          value={block.question}
                          onChange={(e) =>
                            handleUpdateBlock(
                              block.id,
                              "question",
                              e.target.value,
                            )
                          }
                          className="min-h-[80px] resize-none text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Answer
                        </label>
                        <Textarea
                          placeholder="Enter the answer..."
                          value={block.answer}
                          onChange={(e) =>
                            handleUpdateBlock(
                              block.id,
                              "answer",
                              e.target.value,
                            )
                          }
                          className="min-h-[120px] resize-none text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Submit All QNAs */}
          {qnaBlocks.length > 0 && (
            <Button
              className="w-full"
              disabled={hasInvalidBlocks || isSubmitting}
              onClick={handleSubmitAll}
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
                `Submit ${qnaBlocks.length} Q&A Block${
                  qnaBlocks.length > 1 ? "s" : ""
                }`
              )}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
