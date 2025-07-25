import assert from 'node:assert/strict';
import path from 'node:path';

import fs from 'fs-extra';

import pkg from '../package.json' with { type: 'json' };

import { genDir, relativeToRoot } from './paths.mts';
import { version } from './version.mts';

const updatesJsonPath = path.join(genDir, 'updates.json');
const updateRdfPath = path.join(genDir, 'update.rdf');

const [, , updateLink] = process.argv;

assert.ok(updateLink, 'Update link must be provided as first argument');

console.log(
  `Generating ${relativeToRoot(
    updatesJsonPath,
  )} and copying to ${relativeToRoot(updateRdfPath)}`,
);

const updatesJson = {
  addons: {
    [pkg.xpi.id]: {
      updates: [
        {
          version: pkg.xpi.zotero6.version,
          update_link: pkg.xpi.zotero6.updateLink,
          applications: {
            gecko: {
              strict_min_version: '60.9',
              strict_max_version: '60.9',
            },
            zotero: {
              strict_min_version: '6.999',
              strict_max_version: '7.0.*',
            },
          },
        },
        {
          version,
          update_link: updateLink,
          applications: {
            zotero: {
              strict_min_version: pkg.xpi.zoteroMinVersion,
              strict_max_version: pkg.xpi.zoteroMaxVersion,
            },
          },
        },
      ],
    },
  },
};

fs.outputJsonSync(updatesJsonPath, updatesJson, { spaces: 2 });
fs.copySync(updatesJsonPath, updateRdfPath);
