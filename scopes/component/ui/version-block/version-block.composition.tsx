import React from 'react';
import { Snap } from '@teambit/component';
import { VersionBlock } from './version-block';

const componentId = 'ui/version-block';
const version = '0.1';
const hash = '';
const timestamp = new Date().getTime().toString();
const author = {
  displayName: 'Josh Kuttler',
  name: 'joshk',
  email: 'josh@bit.dev',
};
const message = 'simple message';
const isLatest = true;

const parents = [new Snap(hash, new Date(), parents, author, message)];

export const VersionBlockSimple = () => {
  return (
    <VersionBlock
      componentId={componentId}
      version={version}
      hash={hash}
      timestamp={timestamp}
      parents={parents}
      author={author}
      message={message}
      isLatest={isLatest}
    />
  );
};
