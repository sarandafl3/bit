import { ComponentContext } from '@teambit/component';
import { PooledComponentPreview } from '@teambit/preview';
import React, { useContext } from 'react';

export function Overview() {
  const component = useContext(ComponentContext);

  return <PooledComponentPreview component={component} style={{ width: '100%', height: '100%' }} previewName="overview" />;
}
