<template>
  <canvas :height="height" />
</template>

<script>
export default {
  Name: 'GaugeChart',
  props: {
    height: {
      type: Number,
      default: () => 150
    },
    labels: {
      type: Array,
      default() {
        return ['Used', 'Available'];
      }
    },
    title: {
      type: String,
      required: true
    },
    colors: {
      type: Array,
      required: true
    },
    last: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    last(latest) {
      if(!latest) {
        return false;
      }
      const [values] = this.chart.data.datasets;
      const next = [latest.toFixed(2), (1 - latest).toFixed(2)];
      values.data = next;
      this.chart.update();
    }
  },
  mounted() {
    this.chart = new Chart(this.$el, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Gauge',
          data: [0.5, 0.5],
          backgroundColor: this.colors
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
        },
        title: {
          display: true,
          text: this.title
        }
      }
    });
  }
};
</script>

<style scoped>
</style>
