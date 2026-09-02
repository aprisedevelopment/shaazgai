const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const match = data.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+\.css[^"]*)"/);
    if (match) {
      const cssUrl = 'http://localhost:3000' + match[1];
      console.log('Fetching CSS:', cssUrl);
      http.get(cssUrl, (cssRes) => {
        let cssData = '';
        cssRes.on('data', (c) => cssData += c);
        cssRes.on('end', () => {
          console.log('CSS SIZE:', cssData.length);
          console.log('Includes .flex ?', cssData.includes('.flex'));
          console.log('Includes .grid-cols-12 ?', cssData.includes('.grid-cols-12'));
          console.log('Includes .bg-\\[\\#0f2b5c\\] ?', cssData.includes('.bg-\\[\\#0f2b5c\\]'));
          console.log('First 500 chars:', cssData.substring(0, 500));
        });
      });
    } else {
      console.log('No stylesheet found in HTML. Maybe inline?');
      console.log(data.substring(0, 500));
    }
  });
}).on('error', (e) => {
  console.error(e);
});
