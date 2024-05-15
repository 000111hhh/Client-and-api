
var chatContent = document.querySelector(".chat-content");
var chatInput = document.querySelector(".chat-input input[type='text']");
var sendBtn = document.querySelector(".chat-input button");

let number = 2;

document.getElementById('change-bg-link').addEventListener('click',function(event){
  event.preventDefault();

  var link = document.querySelector('link[rel="stylesheet"]');
  link.href = `style${number}.css`;

  number++;

  if(number > 8){
    number = 1;
  }

})


function randomid(length){
  let code = '';
    const charset = '0123456789';
    for (let i = 0; i < length; i++) {
        const randomindex = Math.floor(Math.random() * charset.length);
        code += charset[randomindex];
    }
    return code;
}

var id = randomid(13);

function sendMessage(id) {
  var message = chatInput.value;
  if (!message) {
    return;
  }

  var messageElem = document.createElement("div");
  messageElem.classList.add("message");
  messageElem.textContent = message;
  messageElem.style.backgroundColor = 'green';
  messageElem.style.color = 'white';
  messageElem.style.padding = '5px 10px';
  messageElem.style.marginBottom = '10px';
  messageElem.style.textAlign = 'right';
  messageElem.style.borderRadius = '15px';

  chatContent.appendChild(messageElem);

  getMessage(message,id);

  chatInput.value = "";
}

// async function getMessage(message) {
//   try {
//     const response = await fetch("https://api.binjie.fun/api/generateStream", {
//       method: 'POST',
//       headers: {
//         "Content-Type": "application/json",
//         "origin": "https://chat18.aichatos.xyz"
//       },
//       body: JSON.stringify({
//         "prompt": "你好",
//         "stream": false,
//         "system": "",
//         "network": false,
//         "userId": "#/chat/1700836720616",
//         "withoutContext": false
//       })
//     });

//     if (response.ok) {
//       const textData = await response.text();
//       console.log(textData);
//       ChatReply(textData); 
//     } else {
//       throw new Error('网络请求失败');
//     }
//   } catch (error) {
//     console.log('捕获到错误:', error);
//   }
// }


async function getMessage(message,id) {

    const data = {
    prompt: `${message}`,
    stream: false,
    system: "",
    network: false,
    userId: `#/chat/${id}`,
    withoutContext: false
  };

  await fetch("http://localhost:3000/api/sendMessage", 
  {
    method: 'POST',
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (response.ok) {
      return  response.text(); 
    } else {
      throw new Error('Network response was not ok.');
    }
  })
  .then(data => {
    ChatReply(data)
    console.log(data); 
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

}



function ChatReply(textData){
  const oppenentReplyDiv = document.createElement('div');
  oppenentReplyDiv.textContent = textData;
  oppenentReplyDiv.style.backgroundColor = 'white';
  oppenentReplyDiv.style.color = 'black';
  oppenentReplyDiv.style.padding = '5px 10px';
  oppenentReplyDiv.style.marginBottom = '10px';
  oppenentReplyDiv.style.textAlign = 'left';
  oppenentReplyDiv.style.borderRadius = '10px';
  chatContent.appendChild(oppenentReplyDiv);
}

sendBtn.addEventListener("click", sendMessage(id));

chatInput.addEventListener("keydown", function(e) {
  if (e.keyCode === 13) {
    sendMessage(id);
  }
});
