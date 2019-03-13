## Classes

<dl>
<dt><a href="#StatsService">StatsService</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Subscription">Subscription</a> : <code>Object</code></dt>
<dd><p>A subscription is an Object with an id and an updater function that are used
to make a chart. A ChartController implements both id and updater.</p>
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
    * [.subscribe(update)](#StatsService+subscribe)
    * [.unsubscribe(sub)](#StatsService+unsubscribe)

<a name="new_StatsService_new"></a>

### new StatsService(options)
Stats Service is a singleton.
It polls the stats api using an interval.
It is stored in window.bedrock.statsService.

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

**Kind**: instance method of [<code>StatsService</code>](#StatsService)  
<a name="StatsService+subscribe"></a>

### statsService.subscribe(update)
This takes in a Subscription used to update a graph.

**Kind**: instance method of [<code>StatsService</code>](#StatsService)  

| Param | Type | Description |
| --- | --- | --- |
| update | [<code>Subscription</code>](#Subscription) | This can be a ChartController. |

<a name="StatsService+unsubscribe"></a>

### statsService.unsubscribe(sub)
Each subscription is unique and can be deleted.

**Kind**: instance method of [<code>StatsService</code>](#StatsService)  

| Param | Type | Description |
| --- | --- | --- |
| sub | [<code>Subscription</code>](#Subscription) | This can be a ChartController. |

<a name="Subscription"></a>

## Subscription : <code>Object</code>
A subscription is an Object with an id and an updater function that are used
to make a chart. A ChartController implements both id and updater.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | a unique id for the subscription |
| updater | <code>function</code> | a function called on update |

