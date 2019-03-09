/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';
const {config} = require('bedrock');
const path = require('path');
require('bedrock-views');

config.mongodb.name = 'bedrock_web_stats_test';

config.paths.cache = path.join(__dirname, '.cache');

const cfg = config['stats'];
// generate reports at this interval in ms
cfg.report.interval = 5000;
cfg.storage.push({name: 'redis'});

// add pseudo packages
config.views.system.packages.push({
  path: path.join(__dirname, 'components'),
  manifest: path.join(__dirname, 'package.json')
});
