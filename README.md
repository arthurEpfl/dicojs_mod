# Tailored Disco.js lib for Antibiogo

## Install and build

Type the following commands to install the Node.js modules and build the project.

```
npm ci
npm run build
```

Built files are located in the generated `dist/` directory. They are composed of Node.js TypeScript code transpiled to Node.js JavaScript. Then, the resulting JavaScript code is bundled for the browser.

To prepare the lib for production and minify the bundled JavaScript, run

```
npm run prod
```

## Usage

```html
<script>
  // base64-encoded pellet images
  const base64Strings = [ /*...*/ ]
  
  // config object and fields are optional, as the default config will fill missing information
  const config = {
    port: 4444
  }
  
  Antibiogo.init(config).then((antibiogo) => {
    const predictions = antibiogo.identify(base64Strings)
    
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
    antibiogo.fit(base64Strings, predictions)
    
    // push our local (updated) model to the server and fetch
    // the newly aggregated server-side model
    // !!! the exact scheme (when to push, when to fetch) has yet to be agreed upon !!!
    antibiogo.communicate().catch(console.error)
  }).catch(console.error)
</script>
```
