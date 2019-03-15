/*
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

const headers = {Accept: 'application/ld+json, application/json'};

/**
 * A subscription is an async Function (such as ChartController.updater)
 * that is used to format the data for a Chart.
 * @typedef {Promise} Subscription
 * @param {Object} data - Data from the StatsService update.
 * @param {Object} data.latest - The data from the latest update only.
 * @param {Array<Object>} data.all - All of the data received so far.
 */

// instance stores the singleton
let instance = null;

class StatsService {
  /**
   * Stats Service is a singleton.
   * It polls the stats api using an interval.
   *
   * @param {Object} options - Options for the StatsService.
   * @param {number} [options.poll = 1000] -
   * time in ms for each request to the api.
   *
   * @returns {StatsService} Either an existing one or a new one.
   */
  constructor({poll = 1000} = {}) {
    if(instance) {
      return instance;
    }
    this.update = this.update.bind(this);
    this._loading = true;
    this.poll = poll;
    this.subscribers = new Set();
    this.results = [];
    if(!this.intervalId) {
      this.intervalId = setInterval(this.update, this.poll);
    }
    instance = this;
    return instance;
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
   * It then updates each subscription.
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
    latest.forEach(latest => {
      this.results.push(latest);
      this.subscribers.forEach(
        subscription => subscription({latest, all: this.results}));
    });
    this._loading = false;
  }
  /**
   * This takes in a Subscription used to update a chart and adds it to a set.
   *
   * @param {Subscription} subscription
   * - This can be a ChartController's updater function.
   */
  subscribe(subscription) {
    this.subscribers.add(subscription);
  }
  /**
   * Each subscription is unique and can be deleted.
   *
   * @param {Subscription} subscription
   * - This can be a ChartController's updater function.
   */
  unsubscribe(subscription) {
    this.subscribers = this.subscribers.delete(subscription);
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
