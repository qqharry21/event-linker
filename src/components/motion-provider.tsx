"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";

export default function MotionProvider({ children }: PropsWithChildren) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}
