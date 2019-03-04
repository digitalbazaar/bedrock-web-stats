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
      let labels = [];
      let series1 = [];
      const result = await this._statsService.get({
        // specify which monitors to pull
        monitorIds: ['os'],
        // get stats from the last 5 seconds
        startDate: Date.now() - 100000
      });
      for(const r of result) {
        labels = r.monitors.os.fsSize.map(f => f.fs);
        series1 = r.monitors.os.fsSize.map(f => f.used);
      }

      const ctx = document.getElementById('my-chart');
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            backgroundColor: ['red', 'blue'],
            data: series1,
            pointRadius: 0,
          }]
        },
        options: {}
      });

      // for chartjs, just mutate the dataset and call .update()
      let lastTime = result[result.length - 1].createdDate;
      setInterval(async () => {
        const result = await this._statsService.get({
          monitorIds: ['os'],
          startDate: lastTime + 1
        });
        console.log('result', result);
        for(const r of result) {
          labels = r.monitors.os.fsSize.map(f => f.fs);
          series1 = r.monitors.os.fsSize.map(f => f.used);
        }
        lastTime = result[result.length - 1].createdDate;
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
