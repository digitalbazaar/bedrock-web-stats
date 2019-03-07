/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

const headers = {Accept: 'application/ld+json, application/json'};
const gb = Math.pow(2, 30);

/**
 * A subscription is a function that takes in data and outputs formatted
 * data for a graph
 * @typedef {Object} Subscription
 * @property {String} id - a unique if for the subscription
 * @property {Function} updater - a function called on update
 */

/**
 * Stats Service is a singleton
 * locked to poll the stats api every second.
 * It is stored in window.bedrock.statsService
 */
export class StatsService {
  constructor() {
    if(!window.bedrock) {
      window.bedrock = {};
    }
    if(window.bedrock.statsService) {
      return window.bedrock.statsService;
    }
    this.update.bind(this);
    this.initialize();
    window.bedrock.statsService = this;
    return window.bedrock.statsService;
  }
  /**
   * sets up the singleton to pull every second
   */
  initialize() {
    if(this.interval) {
      return;
    }
    this.subscribers = [];
    this.results = [];
    this.intervalId = setInterval(() => this.update(), 1000);
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
    this.subscribers.forEach(s => s.updater(result, this.results));
  }
  /**
   * this takes in a Subscription used to update a graph.
   * @param {Subscription} update
   */
  subscribe(update) {
    this.subscribers.push(update);
  }
  /**
   * each subscription has a unique id used to unsubscribe
   */
  unsubscribe(id) {
    this.subscribers = this.subscribers.filter(s => s.id !== id);
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
   * gets the last time or returns a time 10000 ms from now
   */
  get lastTime() {
    if(!this.results.length) {
      return Date.now() - 100000;
    }
    return this.results[this.results.length - 1].createdDate;
  }
  formatter({limit = 100, x }) {
    const chart = {};
    chart.last = this.results[this.results.length - 1];
    chart.lastCPU = chart.last.monitors.os.currentLoad.avgload;
    const {used, total} = chart.last.monitors.os.mem;
    chart.lastRAM = used / total;
    const {fsSize} = chart.last.monitors.os;
    chart.lastDISK = fsSize[0].used / fsSize[0].size;
    chart.maxCPU = chart.last.monitors.os.currentLoad.cpus.length;
    chart.maxRAM = Math.ceil(total / gb);
    chart.maxDISK = Math.ceil(fsSize[0].size / gb);
    return chart;
  }
}
