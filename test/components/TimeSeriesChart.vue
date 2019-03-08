<template>
  <div>
    <div class="row q-pa-lg">
      <q-select
        v-model="timeUnit"
        class="col-2"
        :options="times"
        @input="changeTime()" />
      <span
        class="col-1 q-mx-lg"
        @click="pause">
        <q-icon name="fas fa-pause-circle" />
        <span v-if="!paused">pause</span>
        <span v-else>resume</span>
      </span>
    </div>
    <canvas
      ref="canvas"
      height="50" />
  </div>
</template>

<script>
/* globals Chart */
import 'chart.js';
import 'chartjs-plugin-streaming';

export default {
  Name: 'TimeSeriesChart',
  props: {
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
      default: () => {
        return [];
      }
    },
    max: {
      type: Number,
      default: () => 1
    },
    min: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      paused: false,
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
      return this.units.map(
        u => ({label: u, value: u})).slice(0, 3);
    }
  },
  watch: {
    series(newSeries) {
      newSeries.forEach(p => {
        p.y = p.y.toFixed(2);
        this.chart.data.datasets[0].data.push(p);
      });
      this.chart.update();
    },
    max(newMax, oldMax) {
      if(newMax !== oldMax) {
        this.updateMax(newMax);
      }
    }
  },
  mounted() {
    const myChart = new Chart(this.$refs.canvas, {
      type: 'line',
      data: {
        datasets: [{
          label: this.label,
          data: this.series,
          borderColor: this.line,
          backgroundColor: this.fill,
          pointRadius: 1,
          pointHitRadius: 5
        }]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'realtime',
            realtime: {
              duration: 60000,
              pause: false
            },
            time: {
              unit: 'second',
            }
          }],
          yAxes: [
            {
              ticks: {
                min: this.min,
                max: this.max,
                stepSize: 1
              }
            }
          ]
        },
        animation: {
          duration: 40
        }
      }
    });
    this.chart = myChart;
  },
  methods: {
    pause() {
      const [axis] = this.chart.options.scales.xAxes;
      this.paused = !this.paused;
      axis.realtime.pause = this.paused;
      this.chart.update();
    },
    changeTime() {
      const [axis] = this.chart.options.scales.xAxes;
      axis.time.unit = this.timeUnit;
      this.chart.update();
    },
    updateMax(max) {
      const [axis] = this.chart.options.scales.yAxes;
      axis.ticks.max = max;
      axis.ticks.stepSize = Math.ceil(max / 4);
      this.chart.update();
    }
  }
};
</script>

<style scoped>
</style>
