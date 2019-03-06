<template>
  <q-page
    class="column gutter-md background"
    padding>
    <div class="row">
      <span>
        <gauge
          title="CPU"
          :colors="loadDisplay"
          :last="lastCPU" />
      </span>
      <span>
        <gauge
          title="RAM"
          :colors="memDisplay"
          :last="lastRAM" />
      </span>
      <span>
        <gauge
          title="Disk Space"
          :colors="fsDisplay"
          :last="lastDISK" />
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
      lastRAM: 0.5,
      lastCPU: 0.5,
      lastDISK: 0.5,
      loadDisplay: ['rgba(255,0,100)', 'rgba(10, 255, 255)'],
      memDisplay: ['rgba(5,255,100)', 'rgba(100, 25, 255)'],
      fsDisplay: ['rgba(155,5,100)', 'rgba(100, 155, 255)']
    };
  },
  beforeCreate() {
    this._statsService = new StatsService();
  },
  mounted() {
    this._statsService.subscribe({id: 'loadavg', updater: this.subscriber});
  },
  methods: {
    subscriber(latest) {
      if(!latest.length) {
        return false;
      }
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
      const last = latest[latest.length - 1];
      const lastCPU = last.monitors.os.currentLoad.avgload;
      this.$set(this, 'lastCPU', lastCPU);
      const lastRAM =
        last.monitors.os.mem.active / last.monitors.os.mem.available;
      this.$set(this, 'lastRAM', lastRAM);
      const lastDISK = 0.4;
      this.$set(this, 'lastDISK', lastDISK);
    }
  }
};
</script>
<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/c3/0.6.12/c3.min.css"
</style>
