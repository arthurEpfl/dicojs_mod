# Tailored Disco.js lib for Antibiogo

## Install and build

### Install dependencies

Install the required Node.js modules

```
npm ci
```

### Build the project for the Web

Bundle the project for WebView

```
npm run build:web
```

Built files are located in the generated `dist/browser/` directory. They are composed of Node.js TypeScript code transpiled to Node.js JavaScript. Then, the resulting JavaScript code is bundled for the browser in a single `dist/browser/discoj.js` file.

To prepare the lib for production and _minify_ the bundled JavaScript, run

```
npm run prod:web
```

### Build the project for Node.js

Build the project for Node.js

```
npm run build:node
```

Built files are located in the generated `dist/node/` directory. They are composed of Node.js TypeScript code transpiled to Node.js JavaScript. The lib is meant to be used as a dependency to other Node projects, as it is not bundled. You can do so by installing the lib as a local one

```
npm i "/path/to/discojs/"
```

To prepare the lib for production, run

```
npm run prod:node
```

## Usage

```html
<script type="text/javascript" src="dist/disco.js">
  // number of pellet images
  const NB_SAMPLES = 16
  // base64-encoded pellet images
  const base64Strings = [ /*...*/ ]
  // all images have dimension 64x64
  const dimensions = new Array(NB_SAMPLES).fill([64, 64])
  
  // config object and fields are optional, as the default config will fill missing information
  const config = {
    protocol: 'http',
    url: 'localhost',
    port: 4444
  }
  
  Antibiogo.init(config).then((antibiogo) => {
    const predictions = antibiogo.identify(base64Strings, dimensions)
    
    if (predictions[0].length === 1) {
      console.log("prediction on first pellet:", predictions[0][0])
    } else if (predictions[0].length > 1) {
      console.log("predictions on first pellet:", predictions[0].join(", "))
    } else {
      console.log("first pellet was not recognized, it might belong to a new class!")
    }
    
    // user manually validates predicted labels, effectively
    // mapping predictions from string[][] to string[]
    
    // learn from human-validated predictions
    antibiogo.fit(base64Strings, dimensions, predictions)
    
    // push our local (updated) model to the server and fetch
    // the newly aggregated server-side model
    // !!! the exact scheme (when to push, when to fetch) has yet to be agreed upon !!!
    antibiogo.communicate().catch(console.error)
  }).catch(console.error)
</script>
```
