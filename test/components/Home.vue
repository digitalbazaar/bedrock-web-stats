<template>
  <q-page
    class="column gutter-md background"
    padding>
    <div class="column items-center">
      <q-btn
        id="submit-btn"
        color="faded"
        @click="getStats">
        Get Stats
      </q-btn>
    </div>
    <div>
      <canvas
        id="my-chart"
        height="50" />
    </div>
    <div>
      <pre>
        {{reports}}
      </pre>
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
      reports: []
    };
  },
  beforeCreate() {
    this._statsService = new StatsService();
  },
  methods: {
    async getStats() {
      const labels = [];
      const series1 = [];
      const result = await this._statsService.get({
        // specify which monitors to pull
        monitorIds: ['os'],
        // get stats from the last 5 seconds
        startDate: Date.now() - 100000
      });
      for(const r of result) {
        labels.push(r.createdDate);
        series1.push(r.monitors.os.currentLoad.avgload);
      }

      const ctx = document.getElementById('my-chart');
      const myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'loadavg',
            data: series1,
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

      // for chartjs, just mutate the dataset and call .update()
      let lastTime = labels[labels.length - 1];
      setInterval(async () => {
        const result = await this._statsService.get({
          monitorIds: ['os'],
          startDate: lastTime + 1
        });
        for(const r of result) {
          labels.push(r.createdDate);
          series1.push(r.monitors.os.currentLoad.avgload);
        }
        lastTime = labels[labels.length - 1];
        labels.splice(0, result.length);
        series1.splice(0, result.length);
        myChart.update();
      }, 1000);
      // this.reports = result;
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
