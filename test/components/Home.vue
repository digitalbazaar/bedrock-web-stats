<template>
  <q-page
    class="column gutter-md background"
    padding>
    <div>
      <canvas
        id="my-chart"
        height="50" />
    </div>
  </q-page>
</template>
<script>
/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

// FIXME: chartjs is loaded as a global in index.js as a hack
/* globals Chart */

import {StatsService} from 'bedrock-web-stats';

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      reports: [],
      chart: null
    };
  },
  computed: {
    labels() {
      return this.reports.map(r => r.createdDate);
    },
    loadAvg() {
      return this.reports.map(r => r.monitors.os.currentLoad.avgload);
    }
  },
  beforeCreate() {
    this._statsService = new StatsService();
  },
  mounted() {
    const ctx = document.getElementById('my-chart');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'loadavg',
          data: this.loadAvg,
          pointRadius: 0,
        }]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'minute'
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 1,
            }
          }]
        }
      }
    });
    this.chart = myChart;
    this._statsService.subscribe({id: 'loadavg', updater: this.update});
  },
  methods: {
    update(results) {
      this.reports = results;
      this.chart.data.labels = this.labels;
      this.chart.data.datasets[0].data = this.loadAvg;
      this.chart.update();
    },
    done() {
      console.log('Done!', this.form);
    }
  }
};
</script>
<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/c3/0.6.12/c3.min.css"
</style>
