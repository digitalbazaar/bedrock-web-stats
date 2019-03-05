<template>
  <q-page
    class="column gutter-md background"
    padding>
    <time-series
      id="load-avg"
      :series="reports"
      label="Load Average" />
  </q-page>
</template>
<script>
/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

// FIXME: chartjs is loaded as a global in index.js as a hack

import {StatsService} from 'bedrock-web-stats';
import TimeSeries from './TimeSeries.vue';

export default {
  name: 'Home',
  components: {TimeSeries},
  data() {
    return {
      reports: [],
    };
  },
  beforeCreate() {
    this._statsService = new StatsService();
  },
  mounted() {
    this._statsService.subscribe({id: 'loadavg', updater: this.subscriber});
  },
  methods: {
    subscriber(results) {
      const labelValues = results.map(r => (
        {label: r.createdDate, value: r.monitors.os.currentLoad.avgload}));
      this.$set(this, 'reports', labelValues);
    }
  }
};
</script>
<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/c3/0.6.12/c3.min.css"
</style>
