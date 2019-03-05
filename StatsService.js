/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

const headers = {Accept: 'application/ld+json, application/json'};

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
    this.initialize.bind(this);
    this.update.bind(this);
    this.get.bind(this);
    this.initialize();
    window.bedrock.statsService = this;
    return window.bedrock.statsService;
  }
  initialize() {
    if(this.interval) {
      return;
    }
    this.subscribers = [];
    this.results = [];
    this.interval = setInterval(() => this.update(), 1000);
  }
  async update() {
    const result = await this.get({
      monitorIds: ['os'],
      startDate: this.lastTime + 1
    });
    this.results = this.results.concat(result);
    this.subscribers.forEach(s => s.updater(this.results));
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
  get lastTime() {
    if(!this.results.length) {
      return Date.now() - 100000;
    }
    return this.results[this.results.length - 1].createdDate;
  }
}
