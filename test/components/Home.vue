<template>
  <q-page
    class="column gutter-md background"
    padding>
    <div class="row">
      <span>
        <gauge
          title="CPU"
          :colors="loadDisplay"
          :last="charts.lastCPU" />
      </span>
      <span>
        <gauge
          title="RAM"
          :colors="memDisplay"
          :last="charts.lastRAM" />
      </span>
      <span>
        <gauge
          title="Disk Space"
          :colors="fsDisplay"
          :last="charts.lastDISK" />
      </span>
    </div>
    <time-series
      id="load-avg"
      :series="charts.loadavg"
      label="CPU Usage" />
    <time-series
      id="mem-used"
      line="green"
      fill="red"
      :series="charts.memused"
      label="RAM Usage Gb" />
    <time-series
      id="fs-used"
      line="purple"
      fill="grey"
      :series="charts.fssize"
      label="Disk Space in Gb" />
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
      charts: {},
      loadDisplay: ['rgba(255,0,100)', 'rgba(10, 255, 255)'],
      memDisplay: ['rgba(5,255,100)', 'rgba(100, 25, 255)'],
      fsDisplay: ['rgba(155,5,100)', 'rgba(100, 155, 255)']
    };
  },
  beforeCreate() {
    this._statsService = new StatsService();
  },
  mounted() {
    this._statsService.subscribe({id: 'demo', updater: this.subscriber});
  },
  methods: {
    subscriber(latest) {
      const gb = Math.pow(2, 30);
      if(!latest.length) {
        return false;
      }
      const charts = {};
      charts.loadavg = latest.map(r => (
        {x: r.createdDate, y: r.monitors.os.currentLoad.avgload}));
      charts.memused = latest.map(r => (
        {x: r.createdDate, y: r.monitors.os.mem.used / gb}));
      charts.fssize = latest.map(r => (
        {x: r.createdDate, y: r.monitors.os.fsSize
          .reduce((acc, cur) => acc + cur.used, 0) / gb}));
      charts.last = latest[latest.length - 1];
      charts.lastCPU = charts.last.monitors.os.currentLoad.avgload;
      charts.lastRAM =
        charts.last.monitors.os.mem.active / charts.last.monitors.os.mem.available;
      charts.lastDISK =
        charts.last.monitors.os.fsSize[0].used / charts.last.monitors.os.fsSize[0].size;
      this.$set(this, 'charts', charts);
    }
  }
};
</script>
<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/c3/0.6.12/c3.min.css"
</style>
