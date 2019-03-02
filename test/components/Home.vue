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
    <div style="min-height: 400px">
      <div id="chart" />
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

// FIXME: c3 is loaded as a global in index.js as a hack
/* globals c3 */

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
      const timestamps = ['x'];
      const series1 = ['avgload'];
      const result = await this._statsService.get({
        // specify which monitors to pull
        monitorIds: ['os'],
        // get stats from the last 5 seconds
        startDate: Date.now() - 50000
      });
      for(const r of result) {
        timestamps.push(r.createdDate);
        series1.push(r.monitors.os.currentLoad.avgload);
      }
      const myChart = c3.generate({
        data: {
          x: 'x',
          columns: [
            timestamps,
            series1,
          ],
          // type: 'spline'
        },
        zoom: {
          enabled: true
        },
        axis: {
          y: {
            min: 0,
            max: 1,
            label: 'avgload',
          },
          x: {
            type: 'timeseries',
            tick: {
              fit: true,
              rotate: 45,
              format: '%Y-%m-%d %H:%M:%S'
            }
          }
        }
      });
      let lastTime = timestamps[timestamps.length - 1];
      setInterval(async () => {
        const timestamps = ['x'];
        const series1 = ['avgload'];
        const result = await this._statsService.get({
          monitorIds: ['os'],
          startDate: lastTime + 1
        });
        for(const r of result) {
          timestamps.push(r.createdDate);
          series1.push(r.monitors.os.currentLoad.avgload);
        }
        lastTime = timestamps[timestamps.length - 1];
        myChart.flow({columns: [timestamps, series1]});
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
