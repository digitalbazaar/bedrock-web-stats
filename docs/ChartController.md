## Usage

## Classes

<dl>
<dt><a href="#ChartController">ChartController</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ChartType">ChartType</a> : <code>Object</code></dt>
<dd><p><a href="https://www.chartjs.org/docs/latest/charts/">ChartTypes from Chart.js</a></p>
</dd>
<dt><a href="#ChartUnit">ChartUnit</a></dt>
<dd><p>Units such as gigabytes that the stats needed to be formatted in.</p>
</dd>
<dt><a href="#Format">Format</a> : <code>Object</code></dt>
<dd><p>Describes the format of the data</p>
</dd>
</dl>

<a name="ChartController"></a>

## ChartController
**Kind**: global class  

* [ChartController](#ChartController)
    * [new ChartController(options)](#new_ChartController_new)
    * [.chart](#ChartController+chart) ⇒ <code>Object</code>
    * [.units](#ChartController+units) ⇒ [<code>ChartUnit</code>](#ChartUnit)
    * [.loading](#ChartController+loading) ⇒ <code>boolean</code>
    * [.updating](#ChartController+updating) ⇒ <code>boolean</code>
    * [.chart](#ChartController+chart) ⇒ <code>Object</code>
    * [.updater(latest, last, all)](#ChartController+updater)

<a name="new_ChartController_new"></a>

### new ChartController(options)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the chart. |
| [options.type] | [<code>ChartType</code>](#ChartType) | <code>&#x27;pie&#x27;</code> | Chart type. |
| options.format | [<code>Format</code>](#Format) |  | The format for the chart. |
| [options.poll] | <code>number</code> | <code>2000</code> | How often StatsService will poll. |

<a name="ChartController+chart"></a>

### chartController.chart ⇒ <code>Object</code>
**Kind**: instance property of [<code>ChartController</code>](#ChartController)  
**Returns**: <code>Object</code> - An updated chart.  
<a name="ChartController+units"></a>

### chartController.units ⇒ [<code>ChartUnit</code>](#ChartUnit)
**Kind**: instance property of [<code>ChartController</code>](#ChartController)  
**Returns**: [<code>ChartUnit</code>](#ChartUnit) - Can be used to format data.  
<a name="ChartController+loading"></a>

### chartController.loading ⇒ <code>boolean</code>
**Kind**: instance property of [<code>ChartController</code>](#ChartController)  
**Returns**: <code>boolean</code> - Is the chart loading?  
<a name="ChartController+updating"></a>

### chartController.updating ⇒ <code>boolean</code>
**Kind**: instance property of [<code>ChartController</code>](#ChartController)  
**Returns**: <code>boolean</code> - Is the chart updating?  
<a name="ChartController+chart"></a>

### chartController.chart ⇒ <code>Object</code>
Sets the chart using the ChartType.

**Kind**: instance property of [<code>ChartController</code>](#ChartController)  
**Returns**: <code>Object</code> - Chart with new data.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> \| <code>Array.&lt;Object&gt;</code> | Data is determined by ChartType. |

<a name="ChartController+updater"></a>

### chartController.updater(latest, last, all)
Called by StatsService on each update.

**Kind**: instance method of [<code>ChartController</code>](#ChartController)  

| Param | Type | Description |
| --- | --- | --- |
| latest | <code>Array</code> | The data from the latest update only. |
| last | <code>Object</code> | The last piece of data from the update. |
| all | <code>Array.&lt;Object&gt;</code> | All of the data received so far. |

<a name="ChartType"></a>

## ChartType : <code>Object</code>
[ChartTypes from Chart.js](https://www.chartjs.org/docs/latest/charts/)

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pie | <code>string</code> | For Pie charts. |
| time | <code>string</code> | For Static Time Charts. |
| line | <code>string</code> | For Static Line Charts. |
| realtime | <code>string</code> | For realtime Charts. |

<a name="ChartUnit"></a>

## ChartUnit
Units such as gigabytes that the stats needed to be formatted in.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| gb | <code>number</code> | the number of bytes in a gigabyte. |

<a name="Format"></a>

## Format : <code>Object</code>
Describes the format of the data

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [prefix] | <code>function</code> | <code>r &#x3D;&gt; r.monitors.os</code> | Shortens the number of properties needed to get to a value. |
| [y] | <code>function</code> |  | Required for time/line charts describes the y. |
| [x] | <code>function</code> | <code>r &#x3D;&gt; r.createdDate</code> | Optional function that gets the x value for line charts. |
| [last] | <code>function</code> |  | Pie Charts use this to calculate the last value. |
| max | <code>function</code> |  | Returns the max value. |


---
Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
