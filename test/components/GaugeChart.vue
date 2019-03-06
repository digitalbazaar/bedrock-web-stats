<template>
  <canvas :height="height" />
</template>

<script>
export default {
  Name: 'GaugeChart',
  props: {
    height: {
      type: Number,
      default: () => 100
    },
    display: {
      type: Object,
      required: true,
      labels: {
        type: Array,
        required: true
      },
      colors: {
        type: Array,
        required: true
      }
    },
    series: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    series(newSeries) {
      const latest = newSeries[newSeries.length - 1];
      if(!latest || !latest.y) {
        return false;
      }
      const [values] = this.chart.data.datasets;
      const next = [values.data[1], latest.y];
      values.data = next;
      this.chart.update();
    }
  },
  mounted() {
    this.chart = new Chart(this.$el, {
      type: 'doughnut',
      data: {
        labels: this.display.labels,
        datasets: [{
          label: 'Gauge',
          data: [25, 75],
          backgroundColor: this.display.colors
        }]
      },
      options: {
        circumference: Math.PI,
        rotation: Math.PI,
        cutoutPercentage: 80, // percent
        legend: {
          display: true
        },
        tooltips: {
          enabled: true
        }
      }
    });
  }
};
</script>

<style scoped>
</style>
