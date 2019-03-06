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
    labels: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.chart = new Chart(this.$el, {
      type: 'doughnut',
      data: {
        labels: ['Red', 'Blue'],
        datasets: [{
          label: 'Gauge',
          data: [10, 190],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ]
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
