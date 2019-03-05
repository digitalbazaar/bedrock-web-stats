<template>
  <div @click="changeTime()">
    <canvas
      :id="id"
      height="50" />
  </div>
</template>

<script>
/* globals Chart */

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
      timeUnit: 'second'
    };
  },
  computed: {
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
      const units = [
        'millisecond', 'second', 'minute',
        'hour', 'day', 'week', 'month',
        'quarter', 'year'
      ];
      const index = units.indexOf(this.timeUnit) + 1;
      this.timeUnit = index === units.length ? units[0] : units[index];
      this.chart.options.scales.xAxes[0].time.unit = this.timeUnit;
      this.chart.update();
    }
  }
};
</script>

<style scoped>
</style>
