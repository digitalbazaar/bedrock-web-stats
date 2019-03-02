<template>
  <q-page
    class="column gutter-md background"
    padding>
    <div class="column items-center">
      <q-btn
        id="submit-btn"
        color="faded"
        @click="getStats">
        Get Stats
      </q-btn>
    </div>
    <div>
      <pre>
        {{reports}}
      </pre>
    </div>
  </q-page>
</template>
<script>
/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {StatsService} from 'bedrock-web-stats';

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      reports: []
    };
  },
  beforeCreate() {
    this._statsService = new StatsService();
  },
  methods: {
    async getStats() {
      const result = await this._statsService.get({
        monitorIds: ['os'],
        startDate: Date.now() - 5000
      });
      this.reports = result;
    },
    done() {
      console.log('Done!', this.form);
    }
  }
};
</script>
<style>
</style>
