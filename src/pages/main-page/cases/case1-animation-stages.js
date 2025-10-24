// Animation Stages Configuration for Case1
// Each stage defines what animations should happen at specific scroll progress points

// Animation transition configuration
export const shapeTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1], // easeInOut
  duration: 0.5,
};

// Transition with delay for Open Story button
export const delayedTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1], // easeInOut
  duration: 0.5,
  delay: 0.75, // Delay equals main transition duration
};

// Instant transition for resetting to initial state
export const instantTransition = {
  type: "tween",
  duration: 0,
};

// Initial states for each element
export const initialLineAnimation = {
  scale: 0,
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  backgroundColor: "#007AFF",
  x: "-50%",
  y: "0px",
  opacity: 0,
};

export const initialTextAnimation = {
  y: "0px",
  opacity: 0,
  x: "-50%",
};

export const initialMaskAnimation = {
  y: "0px",
  height: "50vh",
  width: "100vw",
  x: "-50%",
  backgroundColor: "#ffffff",
  opacity: 1,
};

export const initialButtonContentAnimation = {
  opacity: 0,
};

export const initialOpenStoryAnimation = {
  width: "300px",
  height: "0px",
  opacity: 0,
  y: "520px", // Half of video height (390px) + gap (100px) + half button (30px)
  x: "-50%",
};

export const animationStages = [
  {
    id: "stage0-circle-appear",
    startProgress: 0,
    endProgress: 0.01,
    description: "Small circle appears",
    transition: shapeTransition,
    elements: {
      line: {
        scale: 1,
        width: "6px",
        height: "6px",
        borderRadius: "3px",
        backgroundColor: "#007AFF",
        x: "-50%",
        y: "0px",
        opacity: 1,
      },
      textContainer: {
        x: "-50%",
        y: "-50%",
      },
    },
  },
  {
    id: "stage1-grow-horizontal",
    startProgress: 0.01,
    endProgress: 0.05,
    description: "Line grows horizontally to 100px",
    transition: shapeTransition,
    elements: {
      line: {
        scale: 1,
        width: "100px",
        height: "6px",
        borderRadius: "3px",
        backgroundColor: "#007AFF",
        x: "-50%",
        y: "0px",
        opacity: 1,
      },
    },
  },
  {
    id: "stage2-expand-full-width",
    startProgress: 0.05,
    endProgress: 0.1,
    description: "Line expands to 50vw",
    transition: shapeTransition,
    elements: {
      line: {
        scale: 1,
        width: "50vw",
        height: "6px",
        borderRadius: "3px",
        backgroundColor: "#007AFF",
        x: "-50%",
        y: "0px",
        opacity: 1,
      },
    },
  },
  {
    id: "stage3-line-down-text-up",
    startProgress: 0.1,
    endProgress: 0.2,
    description:
      "Line moves down 200px, text appears from behind and moves up to -200px",
    transition: shapeTransition,
    elements: {
      line: {
        scale: 1,
        width: "50vw",
        height: "6px",
        borderRadius: "3px",
        backgroundColor: "#007AFF",
        x: "-50%",
        y: "55px",
        opacity: 1,
      },
      textContainer: {
        y: "-150px",
        opacity: 1,
        x: "-50%",
      },
      mask: {
        y: "55px",
        height: "50vh",
        width: "100vw",
        x: "-50%",
        backgroundColor: "#ffffff",
        opacity: 1,
      },
    },
  },
  {
    id: "stage4-line-to-button",
    startProgress: 0.2,
    endProgress: 0.35,
    description:
      "Line moves down 100px more and transforms into button with Play Reel text",
    transition: shapeTransition,
    elements: {
      line: {
        scale: 1,
        width: "50vw",
        height: "96px",
        borderRadius: "48px",
        backgroundColor: "#ffffff",
        border: "6px solid #007AFF",
        x: "-50%",
        y: "100px", // 55px + 100px
        opacity: 1,
      },
      textContainer: {
        opacity: 1,
      },
      mask: {
        opacity: 1,
      },
      buttonContent: {
        opacity: 1,
      },
    },
  },
  // {
  //   id: "stage5-expand-to-video",
  //   startProgress: 0.35,
  //   endProgress: 0.5,
  //   description:
  //     "Line expands to video proportions (1662:1080), button content fades out",
  //   transition: shapeTransition,
  //   elements: {
  //     line: {
  //       scale: 1,
  //       width: "min(1200px, 85vw)",
  //       height: "min(780px, 55.26vw)", // 1662/1080 aspect ratio
  //       borderRadius: "26px",
  //       backgroundColor: "#ffffff",
  //       border: "6px solid #007AFF",
  //       x: "-50%",
  //       y: "-50%",
  //       opacity: 1,
  //     },
  //     textContainer: {
  //       y: "-50px",
  //       opacity: 1,
  //       x: "-50%",
  //     },
  //     buttonContent: {
  //       opacity: 1,
  //     },
  //   },
  // },
  {
    id: "stage6-text-disappears",
    startProgress: 0.35,
    endProgress: 0.5,
    description: "Text fades out, video plays",
    transition: shapeTransition,
    videoExpanded: true, // Control video playback
    elements: {
      line: {
        scale: 1,
        width: "min(1200px, 85vw)",
        height: "min(780px, 55.26vw)", // 1662/1080 aspect ratio
        borderRadius: "26px",
        backgroundColor: "#ffffff",
        border: "6px solid #DDDDDD",
        x: "-50%",
        y: "-50%",
        opacity: 1,
      },
      textContainer: {
        y: "-50px",
        opacity: 0,
        x: "-50%",
      },
      mask: {
        opacity: 1,
      },
      buttonContent: {
        opacity: 0,
      },
      openStory: {
        width: "300px",
        height: "0px",
        opacity: 0,
        y: "520px",
        x: "-50%",
        reverseTransition: shapeTransition, // No delay when disappearing
      },
    },
  },
  {
    id: "stage7-open-story-appears",
    startProgress: 0.5,
    endProgress: 0.7,
    description: "Open Story button appears below video",
    transition: shapeTransition,
    videoExpanded: true,
    elements: {
      line: {
        scale: 1,
        width: "min(1200px, 85vw)",
        height: "min(780px, 55.26vw)",
        borderRadius: "26px",
        backgroundColor: "#ffffff",
        border: "6px solid #DDDDDD",
        x: "-50%",
        y: "-50%",
        opacity: 1,
      },
      textContainer: {
        y: "-50px",
        opacity: 0,
        x: "-50%",
      },
      mask: {
        opacity: 1,
      },
      buttonContent: {
        opacity: 0,
      },
      openStory: {
        width: "300px",
        height: "60px",
        opacity: 1,
        y: "490px", // Half of video height (390px) + gap (100px)
        x: "-50%",
        transition: delayedTransition,
      },
    },
  },
  {
    id: "stage8-enter-normal-flow",
    startProgress: 0.7,
    endProgress: 1,
    description:
      "Elements transition to normal document flow and become scrollable",
    transition: shapeTransition,
    videoExpanded: true,
    normalFlow: true,
    elements: {
      line: {
        scale: 1,
        width: "min(1200px, 85vw)",
        height: "min(780px, 55.26vw)",
        borderRadius: "26px",
        backgroundColor: "#ffffff",
        border: "6px solid #DDDDDD",
        x: "-50%",
        y: "-50%",
        opacity: 1,
      },
      textContainer: {
        y: "-50px",
        opacity: 0,
        x: "-50%",
      },
      mask: {
        opacity: 1,
      },
      buttonContent: {
        opacity: 0,
      },
      openStory: {
        width: "300px",
        height: "60px",
        opacity: 1,
        y: "490px",
        x: "-50%",
      },
    },
  },
];
