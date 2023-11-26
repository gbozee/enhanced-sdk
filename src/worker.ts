// worker.js
self.onmessage = function (event) {
  // Do some computation
  setTimeout(() => {
    const result = {
      hello: "world",
    };
    self.postMessage(result);
  }, 5000);
};
