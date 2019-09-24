# WASM Moddable tools issue

A video of the issue and "fix" is available [here](https://youtu.be/y1AbuCafJ68).

<a href="https://youtu.be/y1AbuCafJ68"><img src="./thumbnail.png"></a>

## Steps to reproduce

1. Download the `sample-mod` folder from this repository.

2. Open the JavaScript console in Chrome and go to [`https://moddable-wasm-tools.netlify.com/`](https://moddable-wasm-tools.netlify.com/).

3. Click the **Choose Files** button in the top left corner, select the `sample-mod` folder from this repository, and click **Upload**.

4. The WASM Moddable tools run in a worker and throw the following error:

	```
	Uncaught (in promise) RangeError: Maximum call stack size exceeded
	```
	
### Instructions for running locally

1. Clone this repository, navigate to the directory, and start a web server:

	```
	git clone https://github.com/lprader/wasm-tools.git
	cd wasm-tools
	python -m SimpleHTTPServer 8000
	```

2. Open the JavaScript console in Chrome and go to [`http://localhost:8000`](http://localhost:8000).
