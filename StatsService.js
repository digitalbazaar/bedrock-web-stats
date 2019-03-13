/*
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

const headers = {Accept: 'application/ld+json, application/json'};

/**
 * A subscription is an Object with an id and an updater function that are used
 * to make a chart. A ChartController implements both id and updater.
 * @typedef {Object} Subscription
 * @property {String} id - a unique id for the subscription
 * @property {Function} updater - a function called on update
 */

class StatsService {
  /**
   * Stats Service is a singleton.
   * It polls the stats api using an interval.
   * It is stored in window.bedrock.statsService.
   *
   * @param {Object} options - Options for the StatsService.
   * @param {number} [options.poll = 1000] -
   * time in ms for each request to the api.
   *
   * @returns {StatsService} Either an existing one or a new one.
   */
  constructor({poll = 1000} = {}) {
    if(!window.bedrock) {
      window.bedrock = {};
    }
    if(window.bedrock.statsService) {
      return window.bedrock.statsService;
    }
    this.update.bind(this);
    this._loading = true;
    this.poll = poll;
    this.subscribers = new Set();
    this.results = [];
    if(this.intervalId) {
      return window.bedrock.statsService;
    }
    this.intervalId = setInterval(() => this.update(), this.poll);
    window.bedrock.statsService = this;
    return window.bedrock.statsService;
  }
  /**
   * Determines if this is the first load.
   *
   * @returns {boolean} True only if there are no results.
   */
  get loading() {
    return this._loading && !this.results.length;
  }
  /**
   * Determines if this is a subsequent update and not an initial load.
   *
   * @returns {boolean} True only if there are results.
   */
  get updating() {
    return this._loading && this.results.length > 0;
  }
  /**
   * Is passed to the interval and fires on every poll.
   */
  async update() {
    this._loading = true;
    const latest = await this.get({
      monitorIds: ['os'],
      startDate: this.lastTime + 1
    });
    if(!latest.length) {
      return false;
    }
    this.results = this.results.concat(latest);
    const last = latest[latest.length - 1];
    this.subscribers.forEach(
      s => s.updater(latest, last, this.results));
    this._loading = false;
  }
  /**
   * This takes in a Subscription used to update a graph.
   *
   * @param {Subscription} update - This can be a ChartController.
   */
  subscribe(update) {
    this.subscribers.add(update);
  }
  /**
   * Each subscription is unique and can be deleted.
   *
   * @param {Subscription} sub - This can be a ChartController.
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
   * Gets the last time or returns a time 100000 ms from now.
   *
   * @returns {string} A utc timestamp in milliseconds.
   */
  get lastTime() {
    if(!this.results.length) {
      return Date.now() - 100000;
    }
    return this.results[this.results.length - 1].createdDate;
  }
}

export {StatsService};
// https://github.com/jsdoc3/jsdoc/issues/1293
