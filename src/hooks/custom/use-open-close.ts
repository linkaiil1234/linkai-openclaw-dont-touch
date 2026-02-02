import { useState } from "react";

export const useOpenClose = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);
  const onOpenChange = (open: boolean) => setIsOpen(open);

  return {
    isOpen,
    open,
    close,
    toggle,
    onOpenChange,
  };
};
