"use client";

import LoginForm from "./login-form";
import SignUpForm from "./sign-up-form";
import ForgotPasswordForm from "./forgot-password-form";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState } from "react";

type Mode = "signup" | "login" | "forgot";
const ORDER: Record<Mode, number> = { signup: 0, login: 1, forgot: 2 };

const variants: Variants = {
  enter: (dir: 1 | -1) => ({
    y: dir === 1 ? `calc(100% + 24px)` : `calc(-100% - 24px)`,
  }),
  center: { y: 0 },
  exit: (dir: 1 | -1) => ({
    y: dir === 1 ? `calc(-100% - 24px)` : `calc(100% + 24px)`,
  }),
};

export default function AuthPanel() {
  const [mode, setMode] = useState<Mode>("login");
  const [direction, setDirection] = useState<1 | -1>(1);

  const go = (next: Mode) => {
    setDirection(ORDER[next] > ORDER[mode] ? 1 : -1);
    setMode(next);
  }

  return (
    <div className="relative flex-4 overflow-hidden rounded-2xl">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={mode}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1, ease: [0.75, 0, 0.25, 1] }}
          className="absolute inset-0"
        >
          {mode === "login" && (
            <LoginForm
              onSignUp={() => go("signup")}
              onForgot={() => go("forgot")}
            />
          )}
          {mode === "signup" && <SignUpForm onBack={() => go("login")} />}
          {mode === "forgot" && <ForgotPasswordForm onBack={() => go("login")} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}