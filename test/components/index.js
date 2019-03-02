/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import * as brVue from 'bedrock-vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

// FIXME: make configurable
Vue.config.devtools = true;

// install all plugins
Vue.use(brVue);

brVue.setRootVue(async () => {
  // load dynamic imports in parallel
  const [
    brQuasar,
    Quasar,
    {default: iconSet},
    {default: Vuelidate},
    d3,
    c3,
  ] = await Promise.all([
    import('bedrock-quasar'),
    import('quasar-framework'),
    import('quasar-framework/icons/fontawesome'),
    import('vuelidate'),
    // import ('https://cdnjs.cloudflare.com/ajax/libs/c3/0.6.12/c3.min.js')
    import('https://cdnjs.cloudflare.com/ajax/libs/d3/5.9.1/d3.js'),
    import('https://cdnjs.cloudflare.com/ajax/libs/c3/0.6.12/c3.js'),
  ]);

  // FIXME: this is a hack, do not use in production code
  window.d3 = d3;
  window.c3 = c3;

  // replace default `br-root` with a custom one
  Vue.component('br-root', () => import('./BrRoot.vue'));

  // install all Vue plugins
  Vue.use(Vuelidate);

  const router = new VueRouter({
    mode: 'history',
    routes: [{
      path: '/',
      component: () => import('./Home.vue'),
      meta: {title: 'Bedrock Wizard'}
    }]
  });

  // configure quasar
  Quasar.icons.set(iconSet);

  const BrApp = Vue.component('br-app');
  return new BrApp({
    router
  });
});
