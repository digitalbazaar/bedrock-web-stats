<template>
  <div>
    <div class="q-m-a-lg q-p-a-lg">
      <q-select
        v-model="timeUnit"
        :options="times"
        @input="changeTime()" />
    </div>
    <canvas
      :id="id"
      height="50" />
  </div>
</template>

<script>
/* globals Chart */
import 'chartjs-plugin-responsive-downsample';

export default {
  Name: 'Chart',
  props: {
    id: {
      type: String,
      default: () => `chart-${Date.now()}`
    },
    label: {
      type: String,
      default: () => 'Label'
    },
    line: {
      type: String,
      default: () => 'red'
    },
    fill: {
      type: String,
      default: () => 'blue'
    },
    series: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({
        responsiveDownsample: {
          enabled: false,
          /**
           * Choose aggregation algorithm 'AVG'(Average values) or
           * 'LTTB' (Largest-Triangle-Three-Buckets). Default: 'LTTB'
           */
          aggregationAlgorithm: 'LTTB',
          /**
           * The desired minimal distance between data points in pixels.
           * The plugin downsamples the data and tries to match this threshold.
           * Default: 1 pixel
           */
          desiredDataPointDistance: 1,
          /**
            * The minimal number of data points.
            * The chart data is not downsampled further than
            * this threshold. Default: 100
           */
          minNumPoints: 100,
          /**
           * Cull data to displayed range of x scale. Default: true
          */
          cullData: true
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'second'
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 1,
            }
          }]
        }
      })
    }
  },
  data() {
    return {
      chart: null,
      timeUnit: 'second',
      units: [
        'millisecond', 'second', 'minute',
        'hour', 'day', 'week', 'month',
        'quarter', 'year'
      ]
    };
  },
  computed: {
    times() {
      return this.units.map(u => ({label: u, value: u}));
    },
    x() {
      return this.series.map(s => s.label);
    },
    y() {
      return this.series.map(s => s.value);
    }
  },
  watch: {
    series() {
      this.chart.data.labels = this.x;
      this.chart.data.datasets[0].data = this.y;
      this.chart.update();
    }
  },
  mounted() {
    const ctx = document.getElementById(this.id);
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.x,
        datasets: [{
          label: this.label,
          data: this.y,
          borderColor: this.line,
          backgroundColor: this.fill,
          pointRadius: 1,
        }]
      },
      options: this.options
    });
    this.chart = myChart;
  },
  methods: {
    changeTime() {
      this.chart.options.scales.xAxes[0].time.unit = this.timeUnit;
      this.chart.update();
      console.log('time unit', this.timeUnit);
    }
  }
};
</script>

<style scoped>
</style>
