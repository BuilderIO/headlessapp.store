import type { BuilderContent } from '@builder.io/react';
import { createContext } from 'react';

const value = {
  /**
   * Content for the layout's footer.
   * Undefined is used so that it's compatible with `BuilderComponent`
   */
  footerContent: undefined as BuilderContent | undefined,
};

export const LayoutContext = createContext(value);
