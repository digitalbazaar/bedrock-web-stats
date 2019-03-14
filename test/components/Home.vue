<template>
  <q-page
    v-if="!loading"
    class="column gutter-md background"
    padding>
    <div class="row">
      <span class="col-4">
        <br-gauge-chart
          title="CPU"
          :color="colors().cpu"
          :max="cpu.chart.max"
          unit="CPUS"
          :last="cpu.chart.last" />
      </span>
      <span class="col-4">
        <br-gauge-chart
          title="RAM"
          :color="colors().ram"
          :max="ram.chart.max"
          :last="ram.chart.last" />
      </span>
      <span class="col-4">
        <br-gauge-chart
          title="Disk Space"
          :color="colors().disk"
          :max="disk.chart.max"
          :last="disk.chart.last" />
      </span>
    </div>
    <br-time-series-chart
      id="load-avg"
      :line="colors().line"
      :fill="colors(0.8).cpu"
      :max="cpuseries.chart.max"
      :series="cpuseries.chart.series"
      realtime
      label="CPU Usage" />
    <br-time-series-chart
      id="mem-used"
      :line="colors().line"
      :fill="colors(0.8).ram"
      :max="ramseries.chart.max"
      :series="ramseries.chart.series"
      realtime
      label="RAM Usage GB" />
    <br-time-series-chart
      id="fs-used"
      :line="colors().line"
      :fill="colors(0.8).disk"
      :max="diskseries.chart.max"
      :series="diskseries.chart.series"
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
import {ChartController} from 'bedrock-web-stats';
import {BrGaugeChart, BrTimeSeriesChart} from 'bedrock-vue-stats';

export default {
  name: 'Home',
  components: {BrGaugeChart, BrTimeSeriesChart},
  data() {
    return {
      charts: {last: {}},
      statsService: null,
      cpu: null,
      ram: null,
      disk: null,
      cpuseries: null,
      ramseries: null,
      diskseries: null

    };
  },
  computed: {
    loading() {
      if(!this.cpu) {
        return true;
      }
      return this.cpu.loading;
    }
  },
  mounted() {
    this.$set(this, 'cpu', new ChartController(
      {
        type: 'pie',
        format: {
          prefix(r) {return r.monitors.os.currentLoad;},
          last(p) {return p.avgload;},
          max(p) {return p.cpus.length;}
        }}));
    this.$set(this, 'ram', new ChartController(
      {
        type: 'pie',
        format: {
          prefix(r) {return r.monitors.os.mem;},
          last(p) {return p.active / p.total;},
          max(p) {return Math.ceil(p.total / this.units.gb);}
        }}));
    this.$set(this, 'disk', new ChartController(
      {
        type: 'pie',
        format: {
          prefix(r) {return r.monitors.os.fsSize[0];},
          last(p) {return p.used / p.size;},
          max(p) {return Math.ceil(p.size / this.units.gb);}
        }}));
    this.$set(this, 'cpuseries', new ChartController(
      {
        type: 'realtime',
        format: {
          prefix(r) {return r.monitors.os.currentLoad;},
          y(p) {return p.avgload * p.cpus.length;},
          max(p) {return p.cpus.length;}
        }}));
    this.$set(this, 'ramseries', new ChartController(
      {
        type: 'realtime',
        format: {
          prefix(r) {return r.monitors.os.mem;},
          y(p) {return p.active / this.units.gb;},
          max(p) {return p.total / this.units.gb;}
        }}));
    this.$set(this, 'diskseries', new ChartController(
      {
        type: 'realtime',
        format: {
          prefix(r) {return r.monitors.os.fsSize[0];},
          y(p) {return p.used / this.units.gb;},
          max(p) {return p.size / this.units.gb;}
        }}));
  },
  methods: {
    colors(alpha = 1) {
      return {
        ram: `rgba(0, 0, 184, ${alpha})`,
        cpu: `rgba(100, 199, 85, ${alpha})`,
        disk: `rgba(200, 44, 146, ${alpha})`,
        line: `rgba(100,100,100, ${alpha})`
      };
    }
  }
};
</script>
<style>
main.background {
  background-color: 'black';
}
</style>
