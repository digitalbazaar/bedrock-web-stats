<template>
  <q-page
    class="column gutter-md background"
    padding>
    <div class="row">
      <span class="col-4">
        <br-gauge-chart
          title="CPU"
          :color="colors().cpu"
          :max="charts.maxCPU"
          unit="CPUS"
          :last="charts.lastCPU" />
      </span>
      <span class="col-4">
        <br-gauge-chart
          title="RAM"
          :color="colors().ram"
          :max="charts.maxRAM"
          :last="charts.lastRAM" />
      </span>
      <span class="col-4">
        <br-gauge-chart
          title="Disk Space"
          :color="colors().disk"
          :max="charts.maxDISK"
          :last="charts.lastDISK" />
      </span>
    </div>
    <br-time-series-chart
      id="load-avg"
      :line="colors().line"
      :fill="colors(0.8).cpu"
      :max="charts.maxCPU"
      :series="charts.loadavg"
      realtime
      label="CPU Usage" />
    <br-time-series-chart
      id="mem-used"
      :line="colors().line"
      :fill="colors(0.8).ram"
      :max="charts.maxRAM"
      :series="charts.memused"
      realtime
      label="RAM Usage GB" />
    <br-time-series-chart
      id="fs-used"
      :line="colors().line"
      :fill="colors(0.8).disk"
      :max="charts.maxDISK"
      :series="charts.fssize"
      realtime
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
import {BrGaugeChart, BrTimeSeriesChart} from 'bedrock-vue-stats';

export default {
  name: 'Home',
  components: {BrGaugeChart, BrTimeSeriesChart},
  data() {
    return {
      charts: {last: {}},
    };
  },
  beforeCreate() {
    this._statsService = new StatsService({poll: 2000});
  },
  mounted() {
    this._statsService.subscribe({id: 'demo', updater: this.subscriber});
  },
  methods: {
    colors(alpha = 1) {
      return {
        ram: `rgba(0, 0, 184, ${alpha})`,
        cpu: `rgba(100, 199, 85, ${alpha})`,
        disk: `rgba(200, 44, 146, ${alpha})`,
        line: `rgba(100,100,100, ${alpha})`
      };
    },
    subscriber(charts) {
      if(!charts) {
        return false;
      }
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
