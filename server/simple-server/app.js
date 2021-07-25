const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const MAX_COUNT = 1000000000;
const server = http.createServer((req, res) => {
  console.log('url: ' + req.url)
  const [url, queryString] = req.url.split('?');
  console.log('query: ' + queryString);
  const params = new Map()
  if (queryString) {
    queryString.split('&').forEach(element => {
      const [key, value] = element.split('=');
      params.set(key, value);
    })
  }
  if (req.url == "/") {
    createResponse("normal end.", res);
  } else if (url == "/heavy") {
    doSimpleIterate(res);
  } else if (url == "/heavy-interval") {
    doInterval(false, res);
  } else if (url == "/heavy-timeout") {
    doTimeout(false, res);
  } else if (url == "/light-interval") {
    doInterval(true, res);
  } else if (url == "/light-timeout") {
    doTimeout(true, res);
  } else if (url == "/avg") {
    asyncAvg(params.get('n'), (avg) => {
      createResponse('avg of 1-n: ' + avg, res);
    });
  } else if (url == "/dosomething") {
    const hoge = 'hoge'
    setTimeout(() => {
      hoge = doSomething()
    }
    , 0)
    console.log("↓↓↓")
    console.log(hoge)
    createResponse(hoge, res) ;
  }  else if (url == "/promise") {
    samplePromise().then(result => {
      console.log('↓↓↓');
      console.log(result);
      createResponse(String(result), res); // => 15
    });
  }  else if (url == "/async") {
    sampleAsync().then(result => {
      createResponse(String(result), res); // => 15
    });
  } else {
    createResponse('not found.', res);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function doSimpleIterate(res) {
  let cnt = 0;
  for (let i = 1; i <= 1000000000; i++) {
    // この部分で時間がかかる
    cnt++;
    if (cnt % 1000000 == 0) {
      console.log(cnt + ', do...')
    }
  }
  return createResponse("heavy end. count -> " + cnt, res);
}

function doInterval(isSync, res) {
  let cnt = 0;
  let i = 0;
  const timeout = setInterval(() => {
    if (i == 50000) {
      clearInterval(timeout); // 100億回に達したらsetIntervalを終了
      if (isSync) createResponse("interval end. count -> " + cnt, res);
    }
    cnt++;
    i++;

    if (cnt % 10000 == 0) {
      console.log(cnt + ', do...')
    }
  }, 0);

  if (!isSync) {
    createResponse("interval end. count -> " + cnt, res);
  }
}


function doTimeout(isSync, res) {
  let cnt = 0;

  setTimeout(() => {
    for (let i = 1; i <= MAX_COUNT; i++) {
      // この部分で時間がかかる
      cnt++;
      if (cnt % 1000000 == 0) {
        console.log(cnt + ', do...')
      }
    }

    if (isSync) {
      createResponse("timeout end. count -> " + cnt, res);
    }
  }, 0)

  if (!isSync) {
    createResponse("timeout end. count -> " + cnt, res);
  }
}

async function doSomething() {
  let a = "initial";

  console.log('1st log');
  console.log(`1st ${a}`);

  a = "second";
  console.log("2nd log");
  console.log(`2nd ${a}`);

  a = "thard";
  console.log("3rd log");
  console.log(`3rd ${a}`);

  return a; 
}

function asyncAvg(n, avgCB) {
  // Save ongoing sum in JS closure.
  var sum = 0;
  function help(i, cb) {
    sum += i;
    if (i == n) {
      cb(sum);
      return;
    }

    for (let cnt = 0; cnt < 100000; cnt++) {
      console.log(cnt + ", do...");
    }

    // "Asynchronous recursion".
    // Schedule next operation asynchronously.
    setImmediate(help.bind(null, i + 1, cb));
    // ↓bindしないとダメ
    //setImmediate(help(i + 1, cb));
  }

  // Start the helper, with CB to call avgCB.
  help(1, function (sum) {
    var avg = sum / n;
    avgCB(avg);
  });
}


function createResponse(value, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(value);
}

function sampleResolve(value) {
  console.log('in sampleResolve');
  console.log('  value: ' + value);
  return new Promise(resolve => {
    console.log('in Promise constructor');
    console.log('  value: '  + value);
    console.log('  resolve: ' + resolve);
      setTimeout(() => {
          console.log('in setTimeout');
          console.log('  value: ' + value);
          resolve(value * 2);
      }, 2000);
  })
}

function samplePromise() {
  return sampleResolve(5).then(result => {
    console.log('in samplePromise');
    console.log('  result:' + result);
    return result + 5;
  });
}

async function sampleAsync() {
  const result = await sampleResolve(5); // resolve(10)
  console.log('in sampleAsync');
  console.log('  result: ' + result);
  return result + 5;
}