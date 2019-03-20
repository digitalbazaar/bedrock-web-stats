/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';
import {StatsService} from './StatsService.js';
export const statsService = new StatsService({poll: 3000});
export default statsService;
export {StatsService};
export {ChartController} from './ChartController.js';
