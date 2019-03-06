<template>
  <q-page
    class="column gutter-md background"
    padding>
    <div class="row">
      <span>
        <gauge
          :display="loadDisplay"
          :series="loadavg" />
      </span>
      <span>
        <gauge
          :display="memDisplay"
          :series="memused" />
      </span>
      <span>
        <gauge
          :display="fsDisplay"
          :series="fssize" />
      </span>
    </div>
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
import TimeSeries from './TimeSeriesChart.vue';
import Gauge from './GaugeChart.vue';

export default {
  name: 'Home',
  components: {TimeSeries, Gauge},
  data() {
    return {
      loadavg: [],
      memused: [],
      fssize: [],
      loadDisplay: {
        labels: ['Last Load', 'Current Load'],
        colors: ['rgba(255,0,100)', 'rgba(10, 255, 255)']
      },
      memDisplay: {
        labels: ['Last RAM Usage', 'Current RAM Usage'],
        colors: ['rgba(5,255,100)', 'rgba(100, 25, 255)']
      },
      fsDisplay: {
        labels: ['Last HD Used', 'Current HD Usage'],
        colors: ['rgba(55,0,100)', 'rgba(100, 55, 55)']
      }
    };
  },
  beforeCreate() {
    this._statsService = new StatsService();
  },
  mounted() {
    this._statsService.subscribe({id: 'loadavg', updater: this.subscriber});
  },
  methods: {
    subscriber(results, latest) {
      const loadAvg = latest.map(r => (
        {x: r.createdDate, y: r.monitors.os.currentLoad.avgload}));
      this.$set(this, 'loadavg', loadAvg);
      const memUsed = latest.map(r => (
        {x: r.createdDate, y: r.monitors.os.mem.used}));
      this.$set(this, 'memused', memUsed);
      const fsSize = latest.map(r => (
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
