import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useReducer,
  createContext,
  useContext,
  DispatchWithoutAction,
} from 'react';

export class DomPool {
  private nodes = new Map<string, ReactNode>();
  // private garbageCollection = new Set<string>();
  private _rerender: DispatchWithoutAction = () => {};

  constructor(private poolSize = 6) {}

  Render = (props: React.HTMLAttributes<HTMLDivElement>) => {
    const [, rerender] = useReducer((x) => x + 1, 0);
    this._rerender = rerender;
    const arr = this.toArray();

    return (
      <div {...props} style={{ height: 1, marginBottom: -1, overflow: 'hidden', ...props.style }}>
        {arr}
      </div>
    );
  };

  toArray() {
    return Array.from(this.nodes.values());
  }

  peek(key: string) {
    return this.nodes.get(key);
  }

  use(key: string, node: ReactNode) {
    this.nodes.set(key, node);
    // this.garbageCollection.delete(key);
    this.refresh();
  }

  release(key: string, node?: ReactNode) {
    this.nodes.set(key, node);
    // this.garbageCollection.add(key);
    this.refresh();
  }

  private refresh() {
    this._rerender();
  }
}

export const domPoolContext = createContext<DomPool | undefined>(undefined);

export function useNode(key: string, node: ReactElement, inactiveNode?: ReactNode) {
  const pool = useContext(domPoolContext);

  useEffect(() => {
    return () => {
      pool?.release(key, inactiveNode);
    };
  }, [pool]);

  // TODO - pool.use(...) triggers a re-render of DomPool,
  // which is risky because the consuming component usually redeclares node on every render.
  // React seems to be smart enough to prevent an infinite render loop though.
  useEffect(() => {
    pool?.use(key, node);
  }, [key, node, pool]);
}
