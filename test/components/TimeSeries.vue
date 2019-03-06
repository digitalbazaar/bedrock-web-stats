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
  </div>
</template>

<script>
/* globals Chart */
import debounce from 'lodash/debounce';

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
      default: () => {
        return [];
      }
    },
    options: {
      type: Object,
      default: () => ({
        scales: {
          xAxes: [{
            type: 'time',
            distribution: 'series',
            ticks: {
              source: 'auto',
              max: 5,
              maxTicksLimit: 10,
            },
            time: {
              unit: 'second'
            }
          }],
        },
        animation: {
          duration: 30
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
    }
  },
  watch: {
    series(newSeries) {
      this.chart.data.datasets[0].data = newSeries;
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
      options: this.options
    });
    this.chart = myChart;
  },
  methods: {
    updateData: debounce(function(newSeries) {
      this.chart.data.datasets[0].data = newSeries;
      this.chart.update();
    }, 60),
    changeTime() {
      const [data] = this.chart.options.scales.xAxes;
      data.time.unit = this.timeUnit;
      this.chart.update();
    }
  }
};
</script>

<style scoped>
</style>
