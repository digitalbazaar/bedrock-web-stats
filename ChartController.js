/*
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {StatsService} from 'bedrock-web-stats';

/**
 * [ChartTypes from Chart.js](https://www.chartjs.org/docs/latest/charts/).
 * @typedef {Object} ChartType
 * @property {string} pie - For Pie charts.
 * @property {string} time - For Static Time Charts.
 * @property {string} line - For Static Line Charts.
 * @property {string} realtime - For realtime Charts.
 * @todo implement all Chart.js chart types.
 */
const ChartType = {
  pie: 'pie',
  time: 'time',
  line: 'line',
  realtime: 'realtime'
};

/**
 * Receives all the data from each update and get it ready for the other
 * functions such as x, y, last, and max.
 * @typedef {Function} Prefix
 * @param {Object} data - Data from the StatsService update.
 * @param {Object} data.latest - The data from the latest update only.
 * @param {Array<Object>} data.all - All of the data received so far.
*/

/**
 * Describes the format of the data.
 * @typedef {Object} Format
 * @property {Prefix} [prefix = ({latest, all}) => latest.monitors.os] -
 * Shortens the number of properties needed to get to a value.
 * @property {Function} [y] - Required for time/line charts describes the y.
 * @property {Function} [x = r => r.createdDate] -
 * Optional function that gets the x value for line charts.
 * @property {Function} [last] -
 * Pie Charts use this to calculate the last value.
 * @property {Function} max - Returns the max value.
 */

/**
 * The result of the updater's data applied to the Format.
 * @typedef {Object} Chart
 * @property {Array<Object>} [series] - An array used by line charts.
 * @property {Object} [last] - Used by Pie charts to update their latest value.
 * @property {number} max - The max value for the chart.
 */

class ChartController {
  /**
   * @param {Object} options - Options for the chart.
   * @param {ChartType} [options.type = 'pie'] - Chart type.
   * @param {Format} options.format - The format for the chart.
   * @param {number} [options.poll = 2000] - How often StatsService will poll.
   */
  constructor({type = 'pie', format, poll = 2000}) {
    const chartType = ChartType[type];
    if(!chartType) {
      throw new Error(`${type} Charts are unsupported`);
    }
    this.type = type;
    this.format = format;
    this._chart = {};
    this._statsService = new StatsService({poll});
    this.id = `${type}-${Date.now()}`;
    this.updater = this.updater.bind(this);
    this._statsService.subscribe(this.updater);
  }
  /**
   * @returns {boolean} Is the chart loading?
   */
  get loading() {
    return this._statsService.loading;
  }
  /**
   * @returns {boolean} Is the chart updating?
   */
  get updating() {
    return this._statsService.updating;
  }
  /**
   * @returns {Chart} An updated chart.
   */
  get chart() {
    return this._chart;
  }
  /**
   * Constructs the chart using the ChartType.
   *
   * @param {Object} data - Data from the StatsService update.
   * @param {Object} data.latest - The data from the latest update only.
   * @param {Array<Object>} data.all - All of the data received so far.
   *
   * @returns {Chart} Chart with new data.
   */
  set chart(data) {
    const {prefix = d => d} = this.format;
    const root = prefix(data) || data;
    this._chart.max = this.format.max(root);
    switch(this.type) {
      case ChartType.pie: {
        this._chart.last = this.format.last(root);
        return this._chart;
      }
      case ChartType.line:
      case ChartType.time:
      case ChartType.realtime: {
        const {x = () => data.latest.createdDate} = this.format;
        this._chart.series = [{
          x: x(root),
          y: this.format.y(root)
        }];
        return this._chart;
      }
      default: {
        console.warn(`unable to format ${this.type} charts`);
        return this._chart;
      }
    }
  }
  /**
   * Called by StatsService on each update.
   * This function is async because we do not want it blocking.
   *
   * @param {Object} data - Data from the StatsService update.
   * @param {Object} data.latest - The data from the latest update only.
   * @param {Array<Object>} data.all - All of the data received so far.
   */
  async updater(data) {
    this.chart = data;
  }
}
export {ChartController};
// https://github.com/jsdoc3/jsdoc/issues/1293
