## Usage

## Classes

<dl>
<dt><a href="#StatsService">StatsService</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Subscription">Subscription</a> : <code>Promise</code></dt>
<dd><p>A subscription is an async Function (such as ChartController.subscription)
that is used to format the data for a Chart.</p>
</dd>
</dl>

<a name="StatsService"></a>

## StatsService
**Kind**: global class  

* [StatsService](#StatsService)
    * [new StatsService(options)](#new_StatsService_new)
    * [.loading](#StatsService+loading) ⇒ <code>boolean</code>
    * [.updating](#StatsService+updating) ⇒ <code>boolean</code>
    * [.lastTime](#StatsService+lastTime) ⇒ <code>string</code>
    * [.update()](#StatsService+update)
    * [.subscribe(subscription)](#StatsService+subscribe)
    * [.unsubscribe(subscription)](#StatsService+unsubscribe)

<a name="new_StatsService_new"></a>

### new StatsService(options)
Stats Service is a singleton.
It polls the stats api using an interval.

**Returns**: [<code>StatsService</code>](#StatsService) - Either an existing one or a new one.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the StatsService. |
| [options.poll] | <code>number</code> | <code>1000</code> | time in ms for each request to the api. |

<a name="StatsService+loading"></a>

### statsService.loading ⇒ <code>boolean</code>
Determines if this is the first load.

**Kind**: instance property of [<code>StatsService</code>](#StatsService)  
**Returns**: <code>boolean</code> - True only if there are no results.  
<a name="StatsService+updating"></a>

### statsService.updating ⇒ <code>boolean</code>
Determines if this is a subsequent update and not an initial load.

**Kind**: instance property of [<code>StatsService</code>](#StatsService)  
**Returns**: <code>boolean</code> - True only if there are results.  
<a name="StatsService+lastTime"></a>

### statsService.lastTime ⇒ <code>string</code>
Gets the last time or returns a time 100000 ms from now.

**Kind**: instance property of [<code>StatsService</code>](#StatsService)  
**Returns**: <code>string</code> - A utc timestamp in milliseconds.  
<a name="StatsService+update"></a>

### statsService.update()
Is passed to the interval and fires on every poll.
It then updates each subscription.

**Kind**: instance method of [<code>StatsService</code>](#StatsService)  
<a name="StatsService+subscribe"></a>

### statsService.subscribe(subscription)
This takes in a Subscription used to update a chart and adds it to a set.

**Kind**: instance method of [<code>StatsService</code>](#StatsService)  

| Param | Type | Description |
| --- | --- | --- |
| subscription | [<code>Subscription</code>](#Subscription) | - This can be a ChartController's subscription function. |

<a name="StatsService+unsubscribe"></a>

### statsService.unsubscribe(subscription)
Each subscription is unique and can be deleted.

**Kind**: instance method of [<code>StatsService</code>](#StatsService)  

| Param | Type | Description |
| --- | --- | --- |
| subscription | [<code>Subscription</code>](#Subscription) | - This can be a ChartController's subscription function. |

<a name="Subscription"></a>

## Subscription : <code>Promise</code>
A subscription is an async Function (such as ChartController.subscription)
that is used to format the data for a Chart.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Data from the StatsService update. |
| data.latest | <code>Object</code> | The data from the latest update only. |
| data.all | <code>Array.&lt;Object&gt;</code> | All of the data received so far. |


---
Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
