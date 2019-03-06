/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

const headers = {Accept: 'application/ld+json, application/json'};

/**
 * Stats Service is a singleton
 * locked to poll the stats api every second.
 * It is stored in window.bedrock.statsService
 */
export class StatsService {
  constructor() {
    if(!window.bedrock) {
      console.log('no bedrock');
      window.bedrock = {};
    }
    if(window.bedrock.statsService) {
      console.log('existing service found');
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
    this.subscribers.forEach(s => s.updater(this.results, result));
  }
  subscribe(update) {
    this.subscribers.push(update);
  }
  unsubscribe(id) {
    this.subscribers = this.subscribers.filter(s => s.id !== id);
  }
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
}
