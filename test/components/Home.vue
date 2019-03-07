<template>
  <q-page
    class="column gutter-md background"
    padding>
    <div class="row">
      <span>
        <gauge
          title="CPU"
          :color="loadDisplay"
          :max="charts.maxCPU"
          unit="CPUS"
          :last="charts.lastCPU" />
      </span>
      <span>
        <gauge
          title="RAM"
          :color="memDisplay"
          :max="charts.maxRAM"
          :last="charts.lastRAM" />
      </span>
      <span>
        <gauge
          title="Disk Space"
          :color="fsDisplay"
          :max="charts.maxDISK"
          :last="charts.lastDISK" />
      </span>
    </div>
    <time-series
      id="load-avg"
      fill="rgba(10,100,200,0.5)"
      :max="charts.maxCPU"
      :series="charts.loadavg"
      label="CPU Usage" />
    <time-series
      id="mem-used"
      line="green"
      fill="rgba(10,255,30,0.5)"
      :max="charts.maxRAM"
      :series="charts.memused"
      label="RAM Usage Gb" />
    <time-series
      id="fs-used"
      line="purple"
      fill="rgba(255,100,255,0.5)"
      :max="charts.maxDISK"
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
      charts: {last: {}},
      loadDisplay: 'rgba(255,0,100)',
      memDisplay: 'rgba(5,255,100)',
      fsDisplay: 'rgba(155,5,100)'
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
      const {used, total} = charts.last.monitors.os.mem;
      charts.lastRAM = used / total;
      const {fsSize} = charts.last.monitors.os;
      charts.lastDISK = fsSize[0].used / fsSize[0].size;
      charts.maxCPU = charts.last.monitors.os.currentLoad.cpus.length;
      charts.maxRAM = Math.ceil(total / gb);
      charts.maxDISK = Math.ceil(fsSize[0].size / gb);
      this.$set(this, 'charts', charts);
    }
  }
};
</script>
<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/c3/0.6.12/c3.min.css"
</style>
