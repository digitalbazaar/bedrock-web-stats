<template>
  <div @click="log()">
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
    length: {
      type: Number,
      default: 0
    },
    id: {
      type: String,
      required: true,
      default: () => `chart-${Date.now()}`
    },
    label: {
      type: String,
      default: () => 'Label'
    },
    series: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      chart: null
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
    console.log('x', this.x, 'y', this.y);
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.x,
        datasets: [{
          label: this.label,
          data: this.y,
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
  }
};
</script>

<style scoped>
</style>
