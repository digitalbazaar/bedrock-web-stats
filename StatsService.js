/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

const headers = {Accept: 'application/ld+json, application/json'};

export class StatsService {
  constructor() {
  }

  async get(params) {
    const result = await axios.get('/stats/storage/redis', {headers, params});
    return result.data;
  }
}
