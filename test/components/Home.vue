<template>
  <q-page
    class="column gutter-md background"
    padding>
    <div class="row">
      <span class="col-4">
        <gauge
          title="CPU"
          :color="colors().cpu"
          :max="charts.maxCPU"
          unit="CPUS"
          :last="charts.lastCPU" />
      </span>
      <span class="col-4">
        <gauge
          title="RAM"
          :color="colors().ram"
          :max="charts.maxRAM"
          :last="charts.lastRAM" />
      </span>
      <span class="col-4">
        <gauge
          title="Disk Space"
          :color="colors().disk"
          :max="charts.maxDISK"
          :last="charts.lastDISK" />
      </span>
    </div>
    <time-series
      id="load-avg"
      :line="colors().line"
      :fill="colors(0.8).cpu"
      :max="charts.maxCPU"
      :series="charts.loadavg"
      label="CPU Usage" />
    <time-series
      id="mem-used"
      :line="colors().line"
      :fill="colors(0.8).ram"
      :max="charts.maxRAM"
      :series="charts.memused"
      label="RAM Usage GB" />
    <time-series
      id="fs-used"
      :line="colors().line"
      :fill="colors(0.8).disk"
      :max="charts.maxDISK"
      :series="charts.fssize"
      label="Disk Space in GB" />
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
    };
  },
  beforeCreate() {
    this._statsService = new StatsService();
  },
  mounted() {
    this._statsService.subscribe({id: 'demo', updater: this.subscriber});
  },
  methods: {
    colors(alpha = 1) {
      return {
        ram: `rgba(0, 0, 184, ${alpha})`,
        cpu: `rgba(241, 215, 0, ${alpha})`,
        disk: `rgba(202, 44, 146, ${alpha})`,
        line: `rgba(100,100,100, ${alpha})`
      };
    },
    subscriber(latest) {
      const gb = Math.pow(2, 30);
      if(!latest.length) {
        return false;
      }
      const charts = {};
      charts.loadavg = latest.map(r => (
        {x: r.createdDate, y: r.monitors.os.currentLoad.avgload * 10}));
      charts.memused = latest.map(r => (
        {x: r.createdDate, y: r.monitors.os.mem.active / gb}));
      charts.fssize = latest.map(r => (
        {x: r.createdDate, y: r.monitors.os.fsSize
          .reduce((acc, cur) => acc + cur.used, 0) / gb}));
      charts.last = latest[latest.length - 1];
      charts.lastCPU = charts.last.monitors.os.currentLoad.avgload;
      const {active, total} = charts.last.monitors.os.mem;
      charts.lastRAM = active / total;
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
main.background {
  background-color: 'black';
}
</style>
