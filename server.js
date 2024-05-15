
// 环境导入与配置
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');


//端口号
const port = 3000;

//数据库配置与访问
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'users'
});

connection.connect((err) => {
    if (err) {
        console.error('数据库出现错误', err);
        return;
    }
    console.log('连接成功');
});

module.exports = connection;


//函数封装（账户验证）
async function userlogin(req, res) {
    const { username, password } = req.body;
    const query = 'SELECT password FROM uap where username = ?';
    connection.query(query, [username], async (err, results) => {
        if (err) {
            console.log(err);
            res.send('发生未知错误');
            return;
        }
        else if (results.length === 0) {
            res.send('用户名不存在');
            return;
        }

        else {
            const hashDB = results[0].password;
            const isMatch = await bcrypt.compare(password, hashDB)

            if (isMatch) {
                // res.send('登录成功');
                app.post('/chatweb.html', (req, res) => {
                    res.sendFile(path.join(__dirname, 'chatweb.html'));
                });
                res.redirect('/chatweb.html');
            }
            else {
                res.send("密码错误！")
                return;
            }
        }
    });
};


// 函数封装（用户名检验）
function isUsernameTaken(username) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM uap where username = ?';
        connection.query(query, [username], (err, results) => {
            if (err) {
                console.error(err);
                reject('发生未知错误，请联系管理员！');
            }
            else {
                resolve(results.length > 0);
            }
        });
    });
};


//函数封装（特殊符号）
function Banchars(password) {
    const ban = /[\s'"<>()[\]!@#$%^&*+=\/\\|,.?`~:;]/;
    return !ban.test(password)
}


//函数封装（bcrypt加密）
function Tobcrypt(password) {
    const saltRounds = 10;
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            }
            else {
                console.log(hash);
                resolve(hash);
            }
        });
    });
}


//开发模块之SMTP传输
function emailSMTP(email, randcode) {
    const nodemailer = require("nodemailer")

    const transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        port: 465,
        secure: true,

        auth: {
            user: '873737197@qq.com',
            pass: 'latspayxzjhbbfgh'
        }
    });

    const mailOptions = {
        from: '873737197@qq.com',
        to: `${email}`,
        subject: '您好，请通过邮箱验证码验证',
        text: `这是你的邮箱验证码${randcode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('邮件发送成功：' + info.response);
        }
    });
}


// 函数封装（随机验证码）
function randomCode(length) {
    let code = '';
    const charset = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM';
    for (let i = 0; i < length; i++) {
        const randomindex = Math.floor(Math.random() * charset.length);
        code += charset[randomindex];
    }
    return code;
}
const randcode = randomCode(6);
// console.log(randcode);


//设置session
app.use(session({
    secret: randcode,
    resave: false,
    saveUninitialized: false,
}));

// app.get('/register', (req, res) => {
//     const randcode = randomCode(6);
//     req.session.randcode = randcode;
//     res.send(`验证码:${req.session.randcode}`);
// });

//解析请求体
app.use(bodyParser.json());

app.use((req, res, next) => {
    if (!req.session.secret) {
      req.session.secret = randomCode(6);
    }
    next();
  });

//发送SMTP

app.post('/api/sendData',(req,res) => {
    // const randcode = randomCode(6);
    // req.session.secret = {secretcode : randcode};
    const secretcode = req.session.secret;
    console.log(secretcode);
    const{email} =req.body;
    emailSMTP(email,secretcode);
});



// function Tosendemail(req,res){
//     try{
//         const{email} = req.body;
//         console.log(email);

//         res.json({
//             emailSMTP(email,randcode)
//         });
//     }catch(error){
//         console.error(error);
//         res.status(500).json({error:'服务器错误！'});
//     }
// }



//函数封装（用户注册）
async function userregister(req, res) {
    const { username, password, confirm, email, inputcode } = req.body;
    console.log('执行了一次')
    if (!username || !password) {
        return res.send("请输入用户名或密码！");
    }

    if (username.length < 4 || username.length > 20) {
        return res.send("用户名长度应在4到20字符之间！");
    }

    if (password.length < 4 || password.length > 16) {
        return res.send("密码长度应在6至16个字符之间！");
    }

    if (password !== confirm) {
        return res.send("你输入的两次密码不相同！");
    }

    if (!Banchars(password)) {
        return res.send("密码中不得出现特殊符号，如：空格、引号、括号、感叹号等符号！");
    }

    if (!email || !inputcode) {
        return res.send("请输入邮箱地址和邮箱验证码！")
    }

    if (inputcode !== req.session.secret) {
        return res.send('邮箱验证码错误！');
    }

    const hash = await Tobcrypt(password);
    const hashemail = await Tobcrypt(email);

    // button1.addEventListener("click",function(){
    //     emailSMTP(email,randcode);
    // });

    // getVerificationCode(email,function(err,verificationCode){
    //     if(err){
    //         console.error('无法查询验证码记录',err);
    //         res.send('验证码发生未知错误，请联系管理员！');
    //     }else if(!verificationCode){
    //         console.log(`用户：${username}输入了错误的验证码`);
    //         res.send('你输入的邮箱验证码错误');
    //     }else if(inputCode === verificationCode){
    //         callback(null,'邮箱验证成功');
    //     }else{
    //         console.log(`用户：${username}邮箱验证失败`);
    //         res.send('邮箱验证失败！')
    //     }

    // });

    try {
        const isTaken = await isUsernameTaken(username);
        if (isTaken) {
            return res.send('用户名已被注册！');
        }

        const query = 'insert into uap(username,password,email) values(?,?,?)';
        connection.query(query, [username, hash, hashemail], (err, results) => {
            if (err) {
                console.error(err);
                res.send('发生未知错误，请联系管理员！');
            }
            else {
                res.send('注册成功');
                // res.send(hash);
            }
        });
    }
    catch (err) {
        console.err(err);
        res.send('发生未知错误，请联系管理员！');
    }
}

//中继器
async function proxysend(req,res){
    res.set('Access-Control-Allow-Origin', '*');  
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    const targetUrl = "https://api.binjie.fun/api/generateStream";
    const headers = {
        "Content-Type": "application/json",
        "origin": "https://chat18.aichatos.xyz"};
    
    const jsondata = req.body;
    console.log(jsondata)

    try {
        const response = await new Promise((resolve, reject) => {
          request.post({ url: targetUrl, headers: headers, body: jsondata, json: true }, (error, response, body) => {
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          });
        });
        
        res.status(200).send(response.body);
      } catch (error) {
        
        console.error(error);
        res.status(500).send('Proxy Error');
      }
}

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(__dirname));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept");
    res.header('Access-Control-Allow-Origin', 'https://chat18.aichatos.xyz');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // res.setHeader('Content-Type', 'application/json');
    next();
  });

//请求响应
app.post('/login', (req, res) => {
    userlogin(req, res);
});

app.get('/login', (req, res) => {
    userlogin(req, res);
});

app.post('/Toregister', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/Toregister', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.post('/register', userregister);

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('person.html',(req, res) => {
    res.sendFile(path.join(__dirname, 'person.html'));
});

app.get('logins.html',(req, res) => {
    res.sendFile(path.join(__dirname, 'logins.html'));
});


app.post('/api/sendMessage', proxysend);

/*
app.post('/register',(res,req) => {
    const userrandcode = req.body.randcode;
    if(req.session.randcode && userrandcode === req.session.randcode){
        res.send('验证码正确');
    }else{
        res.send('验证码错误');
    }
});
*/

//服务器运行
app.listen(port, () => {
    console.log('服务器已启动，监听端口');
});





//开发模块之验证码存储
/*
function saveverifycode(email,randcode){
    const query = 'INSERT INTO uap (email,verifycode) values(?)';
    connection.query(query,[email,randcode],(err,result) => {
        if(err){
            console.error(err);
            res.send('验证码生成失败');
        }else{
            res.send('验证码生成成功');
        }
    })
}
*/

//开发模块之验证码查询
// function getVerificationCode(email,callback){
/*
connection

const sql ='SELECT verifycode from uap where email =?'
connection.query(sql,[email],async(err,results) => {
    if(err){
        console.error('不能获取验证码记录',err);
        callback(err,null);
    }else{
    if(results.length ===0){
            console.log('用户验证码错误');
            callback(null,null);
        }
    else{
        const verificationCode = results[0].code;
        console.log('已获取用户验证码')
        callback(null,verificationCode);
    }
}
});
// }
*/





//开发模块之邮箱验证
// async function verifyemail(email,inputCode){
//     if(inputCode === verificationCode){

//     }
//     else{
//         res.send('邮箱验证密码错误！')
//     }
// }



//         if(savedCode === randcode){
//             return res.send('邮箱已认证');
//         }else{
//             return res.send('邮箱验证码错误！');
//         }
//     }catch(error){
//         console.error(err)
//         res.send('邮箱认证时发生错误,请联系管理员！')
//         throw error;
//     }
// }




