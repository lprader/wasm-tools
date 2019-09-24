self.importScripts( "./tools.js" );

function handleFileSelect(files) { // files is FileList object
  postMessage("Loading tools...");
  // toolsEmscripten({ 
  tools({
    locateFile: () => {
      return "./tools.wasm" 
    }
  })
  .then(wasmTools => {
    let c = files.length;
    let promises = new Array(c);
    for (let i = 0; i < c; i++) {
      let file = files[i];
      postMessage("Loading " + file.name + "...");
      let reader = new FileReader();
      promises[i] = new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort();
          reject(new DOMException("Cannot read " + file.name));
        };
        reader.onload = () => {
          resolve({ file:file, buffer:new Uint8Array(reader.result) });
        };
        reader.readAsArrayBuffer(file);
        });
    }
    Promise.all(promises).then(results => {
      wasmTools.FS.mkdir("/mc");
      for (let i = 0; i < c; i++) {
        let result = results[i];
        wasmTools.FS.writeFile("/mc/" + result.file.name, result.buffer);
      }
      postMessage("mcrun -d /mc/manifest.json");
      wasmTools.callMain([ "mcrun", "-d", "/mc/manifest.json" ]);
      let make = JSON.parse(wasmTools.FS.readFile("/moddable/build/tmp/wasm/debug/mc/make.json", { encoding: 'utf8' }));
      for (let command of make) {
        postMessage(command.join(" "));
        wasmTools.callMain(command);
      }
      postMessage("Downloading /moddable/build/bin/wasm/debug/mc/mc.xsa");
      let archive = wasmTools.FS.readFile("/moddable/build/bin/wasm/debug/mc/mc.xsa");
      let string = String.fromCharCode.apply(null, new Uint8Array(archive));
      postMessage({string});
    });
  })
}

self.onmessage = function(e) {
	// console.log('Worker: Message received from main script');
	handleFileSelect(e.data.files);
}


