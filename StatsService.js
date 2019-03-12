/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

const headers = {Accept: 'application/ld+json, application/json'};

/**
 * A subscription is an Object with an id and an updater function that are used
 * to make a chart.
 * @typedef {Object} Subscription
 * @property {String} id - a unique id for the subscription
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
    this._loading = true;
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
   * Is this the first load?.
   * @return {boolean} True only if there are no results.
   */
  get loading() {
    return this._loading && !this.results.length;
  }
  /**
   * Is this an update?.
   * @return {boolean} True only if there are results.
   */
  get updating() {
    return this._loading && this.results.length > 0;
  }
  /**
   * awaits the result every second
   * concats it to the current result then updates the subscribers
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
}
