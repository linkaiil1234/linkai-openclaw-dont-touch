"use client";

import { FC, ReactNode, useEffect } from "react";

import Lenis from "@studio-freight/lenis";

type SmoothScrollProps = {
  children: ReactNode;
};

export const SmoothScroll: FC<SmoothScrollProps> = (props) => {
  useEffect(() => {
    const lenis = new Lenis();
    let animationFrameId = 0;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return <div>{props.children}</div>;
};
