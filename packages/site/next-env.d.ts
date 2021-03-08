/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.svg";

declare global {
  namespace JSX {
    interface IntrinisicElements {
      "builder-fiddle": { entry: string };
    }
  }
}

// Nested types need a fix
declare module "@builder.io/widgets/*";
