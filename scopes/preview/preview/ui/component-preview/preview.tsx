import React, { CSSProperties, createRef, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import { ComponentModel } from '@teambit/component';
import { usePubSubIframe } from '@teambit/pubsub';
import { useNode } from '@teambit/dom-pool';
import { affix } from '@teambit/base-ui.utils.string.affix';

// TEMP FILE NAMES
import { ignorePopperSize } from './popper-ignore-popper';
import { resizeToMatchReference } from './popper-resize';

export type ComponentPreviewProps = {
  /**
   * component to preview.
   */
  component: ComponentModel;

  /**
   * preview name.
   */
  previewName?: string;

  /**
   * preview style.
   */
  style?: CSSProperties;

  /**
   * string in the format of query params. e.g. foo=bar&bar=there
   */
  queryParams?: string;

  /**
   * enable/disable hot reload for the composition preview.
   */
  hotReload?: boolean;
};

const BASE_OFFSET = 0;

const popperModifiers = [
  ignorePopperSize,
  resizeToMatchReference,
  {
    name: 'flip',
    enabled: false,
  },
  {
    name: 'offset',
    options: {
      // move box from above the target ('top-start')
      // to directly cover the target.
      offset: ({ reference }: any) => [BASE_OFFSET, BASE_OFFSET - reference.height],
    },
  },
];

/**
 * renders a preview of a component.
 */
export function ComponentPreview({ component, style, previewName, queryParams }: ComponentPreviewProps) {
  const [isMounted, setMounted] = useState(false);
  const ref = createRef<HTMLIFrameElement>();
  usePubSubIframe(ref);

  useEffect(() => {
    setMounted(true);
  }, []);

  const url = toPreviewUrl(component, previewName, queryParams);

  return isMounted ? <iframe ref={ref} style={style} src={url} /> : null;
}

export function PooledComponentPreview({ component, style, previewName, queryParams }: ComponentPreviewProps) {

  // const containerRef = createRef<HTMLDivElement>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  // const iframeRef = createRef<HTMLIFrameElement>();
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);

  // console.log('containerRef', containerRef.current);
  // console.log('iframeRef', iframeRef.current);
  usePubSubIframe({ current: iframeRef });

  // const url = toPreviewUrl(component, previewName, queryParams);
  // const id = 'ID';

  const id = toPreviewServer(component);
  const url = toPreviewUrl(component, previewName, queryParams);

  const { styles, attributes, update } = usePopper(containerRef, iframeRef, {
    placement: 'top-start',
    modifiers: popperModifiers,
  });

  // TODO - prevent infinite loop
  useNode(
    id,
    <iframe
      key={id}
      ref={setIframeRef}
      src={url}
      style={styles.popper}
      {...attributes.popper}
      // style={{ height: 1, width: 1, opacity: 0, overflow: 'hidden' }}
      // style={{ position: 'fixed', left: '30vw', top: 100, height: '90vh', width: '60vw' }}
    />,
    <iframe key={id} ref={setIframeRef} src={url} style={{ height: 1, width: 1, opacity: 0, overflow: 'hidden' }} />
  );

  // motion tracking
  useEffect(() => {
    let mounted = true;

    const step = () => {
      if (!update) return;
      if (!mounted) return;
      update()
        .then(() => {
          window.requestAnimationFrame(step);
        })
        .catch(() => {});
    };

    step();

    return () => {
      mounted = false;
    };
  }, [update]);

  return (
    <div ref={setContainerRef} style={style}>
      placeholder
    </div>
    // <>
    //   (new url)
    //   <iframe ref={ref} style={style} src={url} />
    // </>
  );
}

// examples:
// https://hu9y25l.scopes.bit.dev/api/teambit.base-ui/input/button@0.6.2/~aspect/preview/#teambit.base-ui/input/button@0.6.2?preview=overview&undefinedb

export function toPreviewUrl(component: ComponentModel, previewName?: string, additionalParams?: string) {
  const serverPath = toPreviewServer(component);
  const hash = toPreviewHash(component, previewName, additionalParams);

  return `${serverPath}#${hash}`;
}

/**
 * generates preview server path from component data
 */
export function toPreviewServer(component: ComponentModel) {
  const explicitUrl = component.server?.url;

  // const envId = component.environment?.id;
  // const envBasedUrl = `/preview/${envId}`;

  // OK, this *is* working in production, e.g.
  // https://hu9y25l.scopes.bit.dev/api/teambit.base-ui/input/button@0.6.2/~aspect/preview/
  // not very efficient
  // // keep trailing '/' !
  const defaultServerUrl = `/api/${component.id.toString}/~aspect/preview/`;

  return explicitUrl || /* envBasedUrl || */ defaultServerUrl;
}

/**
 * creates component preview arguments
 */
export function toPreviewHash(
  /**
   * component to preview
   */
  component: ComponentModel,
  /**
   * current preview (docs, compositions, etc)
   */
  previewName?: string,
  /**
   * extra data to append to query
   */
  queryParams = ''
) {
  const previewParam = affix(`preview=`, previewName);

  const hashQuery = [previewParam]
    .concat(queryParams)
    .filter((x) => !!x) // also removes empty strings
    .join('&');

  const hash = `${component.id.toString()}${affix('?', hashQuery)}`;

  return hash;
}

ComponentPreview.defaultProps = {
  hotReload: true,
};
