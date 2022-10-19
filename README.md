# js-sql-query-builder

WIP Javascript SQL Query builder meant to help avoid string concatenation for raw sql queries


## Usage
```js
import {queryBuilder} from 'js-sql-query-builder';

const query = queryBuilder();

const color = "green";
const count = 2;

// object bindings
const colorQuery = query
	.select("*")
	.from("mydatabase")
	.where("thing = :color", { color })
	.and("otherthing = :count", { count });

console.log(colorQuery.value, colorQuery.bindings);
//select * from mydatabase where thing = :color and otherthing = :count  { color: 'green', count: 2 }

// array bindings
const colorQuery = query
	.select("*")
	.from("mydatabase")
	.where("thing = ", color)
	.and("otherthing = ", count);

console.log(colorQuery.value, colorQuery.bindings);
//select * from mydatabase where thing = $0 and otherthing = $1 [ 'green', 2 ]

```