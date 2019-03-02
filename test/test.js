/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
require('bedrock-karma');
require('bedrock-stats');
require('bedrock-stats-storage-redis');
require('bedrock-stats-http');
require('bedrock-stats-monitor-os');
require('bedrock-views');
require('./config');

require('bedrock-test');
bedrock.start();
