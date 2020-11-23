import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
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
// @ts-ignore
const parents = [new Snap(hash, new Date(), null, author, message)];

export const VersionBlockSimple = () => {
  const history = createBrowserHistory();
  return (
    <Router history={history}>
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
    </Router>
  );
};
