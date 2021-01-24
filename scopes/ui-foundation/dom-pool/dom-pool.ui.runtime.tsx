import React, { ReactNode } from 'react';
import { UIRuntime, UIAspect, UiUI } from '@teambit/ui';
import { DomPoolAspect } from './dom-pool.aspect';

import { DomPool, domPoolContext } from './dom-pool';

export class DomPoolUI {
  static dependencies = [UIAspect];
  static runtime = UIRuntime;
  static slots = [];
  static async provider([uiUI]: [UiUI] /* , config, slots */) {
    const domPoolUI = new DomPoolUI();
    const pool = new DomPool();

    uiUI.registerHudItem(<pool.Render key="dom-pool" />);
    uiUI.registerRenderHooks({
      reactContext: CreateProvider(pool),
    });

    return domPoolUI;
  }
}

DomPoolAspect.addRuntime(DomPoolUI);

function CreateProvider(pool: DomPool) {
  return function DomPoolProvider({ children }: { children: ReactNode }) {
    return <domPoolContext.Provider value={pool}>{children}</domPoolContext.Provider>;
  };
}
