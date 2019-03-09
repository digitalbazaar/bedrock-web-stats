/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

const headers = {Accept: 'application/ld+json, application/json'};
const gb = Math.pow(2, 30);

/**
 * A subscription is an Object with an id and a function that are used
 * to make a chart.
 * @typedef {Object} Subscription
 * @property {String} id - a unique if for the subscription
 * @property {Function} updater - a function called on update
 */

/**
 * Stats Service is a singleton
 * locked to poll the stats api every second.
 * It is stored in window.bedrock.statsService
 * @param {Object} config
 * @param {number} [config.poll = 1000] -
 * time in ms for each request to the api.
 */
export class StatsService {
  constructor({poll = 1000} = {}) {
    if(!window.bedrock) {
      window.bedrock = {};
    }
    if(window.bedrock.statsService) {
      return window.bedrock.statsService;
    }
    this.update.bind(this);
    this.poll = poll;
    this.subscribers = new Set();
    this.results = [];
    if(this.intervalId) {
      return;
    }
    this.intervalId = setInterval(() => this.update(), this.poll);
    window.bedrock.statsService = this;
    return window.bedrock.statsService;
  }
  /**
   * awaits the result every second
   * concats it to the current result then updates the subscribers
   */
  async update() {
    const result = await this.get({
      monitorIds: ['os'],
      startDate: this.lastTime + 1
    });
    this.results = this.results.concat(result);
    this.subscribers.forEach(
      s => s.updater(this.formatter(result), this.results));
  }
  /**
   * this takes in a Subscription used to update a graph.
   * @param {Subscription} update
   */
  subscribe(update) {
    this.subscribers.add(update);
  }
  /**
   * each subscription is unique and can be deleted.
   * @param {Subscription} sub -
   * the subscription reference the component stored.
   */
  unsubscribe(sub) {
    this.subscribers = this.subscribers.delete(sub);
  }
  /*
   * gets the actual data from the stats rest api
   * @param {Object} params - params are passed along to axois
   * @return {Array<Object>} results - the results from the get
   */
  async get(params) {
    const result = await axios.get('/stats/storage/redis', {headers, params});
    return result.data;
  }
  /**
   * gets the last time or returns a time 100000 ms from now
   * @return {string} A utc timestamp in milliseconds.
   */
  get lastTime() {
    if(!this.results.length) {
      return Date.now() - 100000;
    }
    return this.results[this.results.length - 1].createdDate;
  }
  /*
   *  TODO: turn this into the product of applying all sub funcs
   *  to data.
   *  this is not properly abstracted so will be revising, but
   *  removes chart logic from vue
   *  @param {Array<Object>} latest - The latest stats from the api.
   *  @return {Object|null} A chart with graph info assigned to keys.
   */
  formatter(latest) {
    if(!latest.length) {
      return null;
    }
    const chart = {};
    chart.loadavg = [];
    chart.memused = [];
    chart.fssize = [];
    latest.forEach(r => {
      chart.loadavg.push(
        {x: r.createdDate, y: r.monitors.os.currentLoad.avgload * 10});
      chart.memused.push(
        {x: r.createdDate, y: r.monitors.os.mem.active / gb});
      chart.fssize.push(
        {x: r.createdDate, y: r.monitors.os.fsSize[0].used / gb});
    });
    chart.last = latest[latest.length - 1];
    chart.lastCPU = chart.last.monitors.os.currentLoad.avgload;
    const {active, total} = chart.last.monitors.os.mem;
    chart.lastRAM = active / total;
    const {fsSize} = chart.last.monitors.os;
    chart.lastDISK = fsSize[0].used / fsSize[0].size;
    chart.maxCPU = chart.last.monitors.os.currentLoad.cpus.length;
    chart.maxRAM = Math.ceil(total / gb);
    chart.maxDISK = Math.ceil(fsSize[0].size / gb);
    return chart;
  }
}
