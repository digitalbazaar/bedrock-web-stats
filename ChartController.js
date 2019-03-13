/*
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {StatsService} from 'bedrock-web-stats';

// TODO: https://www.chartjs.org/docs/latest/charts/
// implement all chart types
/**
 * [ChartTypes from Chart.js](https://www.chartjs.org/docs/latest/charts/)
 * @typedef {Object} ChartType
 * @property {string} pie - For Pie charts.
 * @property {string} time - For Static Time Charts.
 * @property {string} line - For Static Line Charts.
 * @property {string} realtime - For realtime Charts.
 */
const ChartType = {
  pie: 'pie',
  time: 'time',
  line: 'line',
  realtime: 'realtime'
};

/**
 * Units such as gigabytes that the stats needed to be formatted in.
 * @typedef ChartUnit
 * @property {number} gb - the number of bytes in a gigabyte.
 */
const ChartUnit = {
  gb: Math.pow(2, 30)
};

/**
 * Describes the format of the data
 * @typedef {Object} Format
 * @property {Function} [prefix = r => r.monitors.os] -
 * Shortens the number of properties needed to get to a value.
 * @property {Function} [y] - Required for time/line charts describes the y.
 * @property {Function} [x = r => r.createdDate] -
 * Optional function that gets the x value for line charts.
 * @property {Function} [last] -
 * Pie Charts use this to calculate the last value.
 * @property {Function} max - Returns the max value.
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
    this.format.units = ChartUnit;
    this._chart = {};
    this._statsService = new StatsService({poll});
    this.id = `${type}-${Date.now()}`;
    this.updater.bind(this);
    this._statsService.subscribe(this);
  }
  /**
   * @returns {Object} An updated chart.
   */
  get chart() {
    return this._chart;
  }
  /**
   * @returns {ChartUnit} Can be used to format data.
   */
  get units() {
    return ChartUnit;
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
   * Sets the chart using the ChartType.
   *
   * @param {Object|Array<Object>} data - Data is determined by ChartType.
   *
   * @returns {Object} Chart with new data.
   */
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
      default: {
        console.warn(`unable to format ${this.type} charts`);
        return this._chart;
      }
    }
  }
  /**
   * Called by StatsService on each update.
   *
   * @param {Array} latest - The data from the latest update only.
   * @param {Object} last - The last piece of data from the update.
   * @param {Array<Object>} all - All of the data received so far.
   */
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
        break;
      }
    }
  }
}
export {ChartController};
// https://github.com/jsdoc3/jsdoc/issues/1293
