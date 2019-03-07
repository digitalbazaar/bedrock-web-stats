<template>
  <div>
    <div class="q-m-a-lg q-p-a-lg">
      <q-select
        v-model="timeUnit"
        :options="times"
        @input="changeTime()" />
    </div>
    <canvas
      ref="canvas"
      height="50" />
    <span @click="pause">
      pause
    </span>
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
      const rounded = newSeries.map(p => {
        p.y = p.y.toFixed(2);
        return p;
      });
      // the docs for the realtime plugin use this and some testing
      // shows this cuts down requestAnimationFrame took x ms errors
      Array.prototype.push.apply(this.chart.data.datasets[0].data, rounded);
      this.chart.update();
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
        }]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'realtime',
            realtime: {
              pause: false
            },
            time: {
              unit: 'second',
            }
          }],
          yAxes: [
            {
              ticks: {
                min: this.min
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
    }
  }
};
</script>

<style scoped>
</style>
