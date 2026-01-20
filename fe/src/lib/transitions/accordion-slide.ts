// Custom easing curves for smooth, natural motion
const easings = {
  // Smooth deceleration - great for elements entering
  smoothOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  // Smooth acceleration - great for elements leaving
  smoothIn: "cubic-bezier(0.55, 0, 1, 0.45)",
  // Emphasized curve for more dramatic effect
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
} as const;

// Accordion animation using CSS grid for true height animation
export const accordionSlide = {
  forwards: {
    old: {
      name: "accordionClose",
      duration: "0.4s",
      easing: easings.smoothIn,
    },
    new: {
      name: "accordionOpen",
      duration: "0.5s",
      easing: easings.smoothOut,
    },
  },
  backwards: {
    old: {
      name: "accordionClose",
      duration: "0.4s",
      easing: easings.smoothIn,
    },
    new: {
      name: "accordionOpen",
      duration: "0.5s",
      easing: easings.smoothOut,
    },
  },
};