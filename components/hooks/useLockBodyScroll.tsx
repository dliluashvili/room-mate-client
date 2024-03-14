import React from "react";

export function useLockBodyScroll(lock) {
  React.useLayoutEffect(() => {
    // Store original overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Conditionally lock or unlock body scroll
    if (lock) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalStyle;
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]); // Add 'lock' to the dependency array
}
