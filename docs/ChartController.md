## Usage

## Classes

<dl>
<dt><a href="#ChartController">ChartController</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ChartType">ChartType</a> : <code>Object</code></dt>
<dd><p><a href="https://www.chartjs.org/docs/latest/charts/">ChartTypes from Chart.js</a>.</p>
</dd>
<dt><a href="#Prefix">Prefix</a> : <code>function</code></dt>
<dd><p>Receives all the data from each update and prepares it for the other
functions such as x, y, last, and max.</p>
</dd>
<dt><a href="#Format">Format</a> : <code>Object</code></dt>
<dd><p>Describes the format of the data.</p>
</dd>
<dt><a href="#Chart">Chart</a> : <code>Object</code></dt>
<dd><p>The result of the subscription&#39;s data applied to the Format.</p>
</dd>
</dl>

<a name="ChartController"></a>

## ChartController
**Kind**: global class  

* [ChartController](#ChartController)
    * [new ChartController(options)](#new_ChartController_new)
    * [.loading](#ChartController+loading) ⇒ <code>boolean</code>
    * [.updating](#ChartController+updating) ⇒ <code>boolean</code>
    * [.chart](#ChartController+chart) ⇒ [<code>Chart</code>](#Chart)
    * [.chart](#ChartController+chart) ⇒ [<code>Chart</code>](#Chart)
    * [.subscription(data)](#ChartController+subscription)

<a name="new_ChartController_new"></a>

### new ChartController(options)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the chart. |
| [options.type] | [<code>ChartType</code>](#ChartType) | <code>&#x27;pie&#x27;</code> | Chart type. |
| options.format | [<code>Format</code>](#Format) |  | The format for the chart. |
| [options.poll] | <code>number</code> | <code>2000</code> | How often StatsService will poll. |

<a name="ChartController+loading"></a>

### chartController.loading ⇒ <code>boolean</code>
**Kind**: instance property of [<code>ChartController</code>](#ChartController)  
**Returns**: <code>boolean</code> - Is the chart loading?  
<a name="ChartController+updating"></a>

### chartController.updating ⇒ <code>boolean</code>
**Kind**: instance property of [<code>ChartController</code>](#ChartController)  
**Returns**: <code>boolean</code> - Is the chart updating?  
<a name="ChartController+chart"></a>

### chartController.chart ⇒ [<code>Chart</code>](#Chart)
**Kind**: instance property of [<code>ChartController</code>](#ChartController)  
**Returns**: [<code>Chart</code>](#Chart) - An updated chart.  
<a name="ChartController+chart"></a>

### chartController.chart ⇒ [<code>Chart</code>](#Chart)
Constructs the chart using the ChartType.

**Kind**: instance property of [<code>ChartController</code>](#ChartController)  
**Returns**: [<code>Chart</code>](#Chart) - Chart with new data.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Data from the StatsService update. |
| data.latest | <code>Object</code> | The data from the latest update only. |
| data.all | <code>Array.&lt;Object&gt;</code> | All of the data received so far. |

<a name="ChartController+subscription"></a>

### chartController.subscription(data)
Called by StatsService on each update and should not be awaited.
This method is non-blocking and should resolve with other promises.
This is to ensure that no subscription possibly holds up another update.

**Kind**: instance method of [<code>ChartController</code>](#ChartController)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Data from the StatsService update. |
| data.latest | <code>Object</code> | The data from the latest update only. |
| data.all | <code>Array.&lt;Object&gt;</code> | All of the data received so far. |

<a name="ChartType"></a>

## ChartType : <code>Object</code>
[ChartTypes from Chart.js](https://www.chartjs.org/docs/latest/charts/).

**Kind**: global typedef  
**Todo**

- [ ] implement all Chart.js chart types.

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pie | <code>string</code> | For Pie charts. |
| time | <code>string</code> | For Static Time Charts. |
| line | <code>string</code> | For Static Line Charts. |
| realtime | <code>string</code> | For realtime Charts. |

<a name="Prefix"></a>

## Prefix : <code>function</code>
Receives all the data from each update and prepares it for the other
functions such as x, y, last, and max.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Data from the StatsService update. |
| data.latest | <code>Object</code> | The data from the latest update only. |
| data.all | <code>Array.&lt;Object&gt;</code> | All of the data received so far. |

<a name="Format"></a>

## Format : <code>Object</code>
Describes the format of the data.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [prefix] | [<code>Prefix</code>](#Prefix) | <code>({latest, all}) &#x3D;&gt; latest.monitors.os</code> | Shortens the number of properties needed to get to a value. |
| [y] | <code>function</code> |  | Required for time/line charts describes the y. |
| [x] | <code>function</code> | <code>r &#x3D;&gt; r.createdDate</code> | Optional function that gets the x value for line charts. |
| [last] | <code>function</code> |  | Pie Charts use this to calculate the last value. |
| max | <code>function</code> |  | Returns the max value. |

<a name="Chart"></a>

## Chart : <code>Object</code>
The result of the subscription's data applied to the Format.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [series] | <code>Array.&lt;Object&gt;</code> | An array used by line charts. |
| [last] | <code>Object</code> | Used by Pie charts to update their latest value. |
| max | <code>number</code> | The max value for the chart. |


---
Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
