<template>
  <q-page
    class="column gutter-md background"
    padding>
    <time-series
      id="load-avg"
      :series="loadavg"
      label="Load Average" />
    <time-series
      id="mem-used"
      line="green"
      fill="red"
      :series="memused"
      label="Memory Used" />
    <time-series
      id="fs-used"
      line="purple"
      fill="grey"
      :series="fssize"
      label="Hard Drive Usage" />
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
      loadavg: [],
      memused: [],
      fssize: []
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
      const loadAvg = results.map(r => (
        {x: r.createdDate, y: r.monitors.os.currentLoad.avgload}));
      this.$set(this, 'loadavg', loadAvg);
      const memUsed = results.map(r => (
        {x: r.createdDate, y: r.monitors.os.mem.used}));
      this.$set(this, 'memused', memUsed);
      const fsSize = results.map(r => (
        {x: r.createdDate,
          y: r.monitors.os.fsSize.reduce((acc, cur) => acc + cur.used, 0)}));
      this.$set(this, 'fssize', fsSize);
    }
  }
};
</script>
<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/c3/0.6.12/c3.min.css"
</style>
