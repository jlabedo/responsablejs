# babel-plugin-remove-server-code

Remove server code from client code source

## Example

**In**

```js
// input code
```

**Out**

```js
"use strict";

// output code
```

## Installation

```sh
$ npm install babel-plugin-remove-server-code
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["remove-server-code"]
}
```

### Via CLI

```sh
$ babel --plugins remove-server-code script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["remove-server-code"]
});
```
