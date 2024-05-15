const request = require('request')

// async function getMessage(setMessage){

//     let code = '';
//     const number = '0123456789';
//     for (let i = 0; i < 13; i++) {
//       const randomindex = Math.floor(Math.random() * number.length);
//       code += number[randomindex];
//   };

//   var options = {
//     url: 'https://api.binjie.fun/api/generateStream',
//     method: 'POST',
//     Headers:{
//       'Connection': 'keep-alive',
//       'Pragma': 'no-cache',
//       'Cache-Control': 'no-cache',
//       'Accept': '*/*',
//       'Access-Control-Request-Method': 'POST',
//       'Access-Control-Request-Headers': 'content-type',
//       'Origin': 'https://chat18.aichatos.xyz',
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
//       'Sec-Fetch-Mode': 'cors',
//       'Sec-Fetch-Site': 'cross-site',
//       'Sec-Fetch-Dest': 'empty',
//       'Referer': 'https://chat18.aichatos.xyz/',
//       'Accept-Encoding':'gzip, deflate, br',
//       'Accept-Language':'zh-CN,zh;q=0.9',
//     },
//     body: JSON.stringify({
//       "prompt": `${setMessage}`,
//       "userId": `#/chat/${code}`,
//       "network": false,
//       "system": "",
//       "withoutContext": false,
//       "stream": false
//     })
//   };

//   request(options,(error, response, body) => {
//     if(error){
//       console.error(error);
//     }else{
//       console.log(body);
//     }
//   })
// };

// getMessage("你好")


request({
    url: 'https://api.binjie.fun/api/generateStream',
    method: "POST",
    json: true,
    headers: {
        'Connection':'keep-alive',
      'Content-Length':'113',
      'sec-ch-ua':'"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      'Accept':'application/json, text/plain, */*',
      'Content-Type':'application/json',
      'sec-ch-ua-mobile':'?0',
      'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'sec-ch-ua-platform':'"Windows"',
      'Origin':'https://chat18.aichatos.xyz',
      'Sec-Fetch-Site':'cross-site',
      'Sec-Fetch-Mode':'cors',
      'Sec-Fetch-Dest':'empty',
      'Referer':'https://chat18.aichatos.xyz/',
      'Accept-Encoding':'gzip, deflate, br',
      'Accept-Language':'zh-CN,zh;q=0.9',
    },
    body: JSON.stringify({
        "prompt":"你好",
        "userId":"#/chat/1700804043739",
        "network":false,
        "system":"",
        "withoutContext":false,
        "stream":false
}),
}, function(error, response, body) {
    if (!error) {
        console.log(body) // 请求成功的处理逻辑
    }
});