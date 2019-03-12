import {StatsService} from 'bedrock-web-stats';

// TODO: https://www.chartjs.org/docs/latest/charts/
// implement all chart types
const ChartType = {
  pie: 'pie',
  time: 'time',
  line: 'line',
  realtime: 'realtime'
};

const ChartUnit = {
  gb: Math.pow(2, 30)
};

/**
 * Describes the format of the data
 * @typedef {Object} Format
 * @property {ChartUnit} unit -
 * Optional param used to get the data into a specific size.
 * @property {number} [scalar = 1] - Optional param that scales the values
 * @property {string} y - Required for time/line charts describes the y.
 * @property {string} [x = 'createdDate'] - Optional key for the x value
 * @property {string|Array<string>} last - Pie Charts used the last values.
 * @property {string} max - The key for the max value for a chart.
 */

export class ChartController {
  /**
   * @param {Object} options - Options for the chart.
   * @param {ChartType} [options.type = 'pie'] - Chart type.
   * @param {Format} [keys = []] - The keys for the chart.
   * @param {number} [poll = 2000] - How often the StatsService will poll.
   */

  constructor({type = 'pie', format, poll = 2000}) {
    const chartType = ChartType[type];
    if(!chartType) {
      throw new Error(`${type} Chart is unsupported`);
    }
    this.type = type;
    this.format = format;
    this.format.units = ChartUnit;
    this._chart = {};
    this._statsService = new StatsService({poll});
    this.id = `${type}-${Date.now()}`;
    this.updater.bind(this);
    this._statsService.subscribe(this);
  }
  get chart() {
    return this._chart;
  }
  get loading() {
    return this._statsService.loading;
  }
  get updating() {
    return this._statsService.updating;
  }
  set chart(data) {
    const {prefix = r => r.monitors.os} = this.format;
    switch(this.type) {
      case ChartType.pie: {
        const root = prefix(data) || data;
        this._chart.last = this.format.last(root);
        this._chart.max = this.format.max(root);
        return this._chart;
      }
      case ChartType.line:
      case ChartType.time:
      case ChartType.realtime: {
        const last = data[data.length - 1];
        const {x = d => d.createdDate} = this.format;
        this._chart.series = data.map(d => ({
          x: x(d),
          y: this.format.y(prefix(d))
        }));
        this._chart.max = this.format.max(prefix(last));
        return this._chart;
      }
    }
  }
  updater(latest, last, all) {
    switch(this.type) {
      case ChartType.pie: {
        this.chart = last;
        break;
      }
      case ChartType.realtime: {
        this.chart = latest;
        break;
      }
      default: {
        this.chart = all;
      }
    }
  }
}
