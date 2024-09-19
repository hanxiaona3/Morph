//获取批量查询的权限
import fetch from 'node-fetch';
import {ethers} from 'ethers';
import axios from 'axios';
import cryptoJS from 'crypto-js';
import { PrivateKeys$136Wallets, PrivateKeys$18Wallets } from '../../util/privateKey.js';
import SocksProxyAgent from 'socks-proxy-agent';
import RPC from '../../config/runnerRPC-1.json' assert { type: 'json' };
import fakeUa from 'fake-useragent';
import Web3 from 'web3';
// import {sendRequestFetch} from '../../util/common.js';
import {HttpsProxyAgent} from 'https-proxy-agent';


// const randomHex = require('randomhex');
// const RPC='https://rpc-holesky.morphl2.io';
const QIANDAO_URL='https://events-api-holesky.morphl2.io/activities/sign_in';
const OPENBOX_URL='https://events-api-holesky.morphl2.io/activities/open_blind_box';
const VOTE_URL='https://events-api-holesky.morphl2.io/activities/vote';
const CORSE_URL='https://events-api-holesky.morphl2.io/activities/personal_stats?address=';
const message_ALL="Welcome to Morph!\n\nThis is only for address check purposes, it will not trigger a blockchain transaction or cost any gas fees.\n"

// let headers
/**
 * 执行 HTTP 请求，并在失败时进行多次重试
 * @param {string} url - 请求的 URL
 * @param {Object} options - fetch 的配置选项
 * @param {number} retries - 最大重试次数
 * @param {number} delay - 每次重试的延迟时间（毫秒）
 * @returns {Promise<Response>} - 返回 fetch 的结果
 */
async function sendRequestFetch(url, urlConfig='', timeout = 10000, maxRetries = 3) {
    let retries = 0;
  
    // let postData={}
    // let urlConfig={
    //   method: 'post'||'get',
    //   headers: headers,
    //   body: JSON.stringify(postData),
    //   agent: proxyAgent
    // }
    while (retries < maxRetries) {
        // const source = axios.CancelToken.source();
        // const timer = setTimeout(() => {
        //     source.cancel(`Request timed out after ${timeout} ms`);
        // }, timeout);
        const newConfig = {
            ...urlConfig,
            timeout: timeout,
            method: urlConfig.method || 'get',
            // cancelToken: source.token,
            // onDownloadProgress: () => clearTimeout(timer),
        };
  
        try {
            const response = await fetch(url,newConfig);
            if (response.ok) {
              retries = maxRetries;
              // return await response.text();
              // console.log(`666666666666666666666`);
              
              return response
            }
        } catch (error) {
            // console.error(error.message);
            retries++;
            console.info(`请求失败，开始重试第 ${retries} 次`);
            await sleep(5);
        }
    }
  
    throw new Error(`Request failed after ${maxRetries} retries`);
  }
  
//projectId项目类别，用于后续项目投票使用
const projectId=[
    '0a37c0a1-4297-4c9c-8c00-e1815cf6d993',//"Public AI"
    '47fe8fac-f775-44a6-a868-1244ad84ddc5',//"BulbaSwap"
    'bbdd1ebd-c5a4-4c84-9724-7679dd9e2d59',//"Morpha.nft"
    'fd397704-2149-4852-bdb5-bb0b498fff77',//"Abra Finance"
    '23585e2b-6542-4b1f-ab09-48f9cb67e275',//"PingPong"
    // '0b684f86-9f9a-4790-9be5-953e9ed153bb',//"BitMetis"
    // "463bc46e-148d-475d-806f-e79bfefb45b7",//"Starland AI"
    // "1380fac7-6907-4d09-be7f-868406dbcdd0"//"Rap Chain"
]
//休眠单独写一个函数
const  sleep = (seconds) => {
    let milliseconds = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
//将密钥打乱函数
function NewPrivatKeys(privateKeys) {
    // 用一个新数组来保存随机取出的数值
    let shuffled_PrivateKeys = [];

    // 随机取值直到取完所有数组元素
    while (privateKeys.length > 0) {
        // 生成一个随机索引
        let randomIndex = Math.floor(Math.random() * privateKeys.length);
        // 从原数组中取出随机的元素
        let randomNum = privateKeys[randomIndex];
        // 将取出的元素加入新数组
        shuffled_PrivateKeys.push(randomNum);
        // 从原数组中移除已经取出的元素
        privateKeys.splice(randomIndex, 1);
    }
    // console.log(shuffled_PrivateKeys);
    return shuffled_PrivateKeys;
}
//provider提供
const provider=new ethers.JsonRpcProvider(RPC.morph);
//破解密钥A1b2c3d4E5f6G7h8I9j0K!#
const V_key='A1b2C3d4E5f6G7h8I9j0K!#'
//2004-5-18 密码：'A7d#9kL@3mN!8xYzQ2w';2024-05-19密码："A1b2C3d4E5f6G7h8I9j0K!#"

//header获取
function getHeaders(userAgent=''){
    let options={
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'Content-Type': 'application/json',
        'authorization': 'Bearer',
        'origin': 'https://www.morphl2.io',
        'priority': 'u=1, i',
        'referer': 'https://www.morphl2.io/',
        'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': userAgent,
    }
    return options;
};

//签到积分函数
async function Qiandao(wallet,headers,agent='') {

    //匹配组合data数据
    let data_temp={
        address:wallet.address,
        projectId:Web3.utils.utf8ToHex(Web3.utils.randomHex(32))
    };
   
    //message获取
    let message=Web3.utils.sha3(JSON.stringify(data_temp));  
    let data_TX={
        message:message,
        signature:await wallet.signMessage(message_ALL),
        data:cryptoJS.AES.encrypt(JSON.stringify(data_temp), V_key).toString(),
    };

    // console.log(data_TX);
    
    console.log(`验证测试数据是否正确11111111111111`);
    // console.log(data_TX);
    
    let config={
        method:'POST',
        headers:headers,
        agent:agent,
        body:JSON.stringify(data_TX),
    }
    // console.log(config);
    
    //获取钱包账户的token
    try {
        let token= await sendRequestFetch(QIANDAO_URL,config)
        // {
        //     httpAgent:agent,
        //     httpsAgent:agent
        // });
        // console.log(token.status);
        // console.log(token.data);
        // console.log(token);
        // const response=await token.json();
        // console.log(await token.json());
        let re=await token.json();
        if (re.code===1000) {
            console.log(`签到执行完成。。。`);
        }else{
            console.log(re.message);
        }
        // console.log(token.data);
    } catch (error) {
        console.error('签到出现错误信息是:', error.message);
        // console.log(error.response);
    }
}
//开盲盒积分
async function Open_Blind_Box(wallet,headers,agent='') {

    let data_temp={
        address:wallet.address,
        projectId:Web3.utils.utf8ToHex(Web3.utils.randomHex(32))
    };

    let message=Web3.utils.sha3(JSON.stringify(data_temp));
  
    let data_TX={
        message:message,
        signature:await wallet.signMessage(message_ALL),
        data:cryptoJS.AES.encrypt(JSON.stringify(data_temp), V_key).toString()
    }
    console.log(`验证测试数据是否正确222222222222`);
    // console.log(data_TX);
    //获取钱包账户的token
    try {
        let token= await sendRequestFetch(OPENBOX_URL,{
            headers:headers,
            agent:agent,
            body:JSON.stringify(data_TX),
            method:'post'
        });
        // console.log(token);
        let re=await token.json();
        if (re.code===1000) {
            console.log(`开盲盒完成。。。`);
        }else{
            console.log(re.message);
        }
    } catch (error) {
        console.error('开盲盒出现错误信息是:', error.message);
    }
}
//获取用户积分是多少
async function Personal_Stats(wallet,headers,agent=''){
    let newUrl=`${CORSE_URL}${wallet.address}`;
    //获取钱包账户的token
    try {
        let token= await sendRequestFetch(newUrl,{
            headers:headers,
            agent:agent,
            method:'get'
        });
        // console.log(token.data);
        let re=await token.json()
        let n=re.data.total_voting_power;//total_voted;//
        let m=re.data.total_voted;
        console.log(`当前地址可投票分数是：${n-m}`);
        console.log(`当前地址已投票分数是：${m}`);
        console.log(`当前地址总积分是：${n}`);
        return n-m;//这个数值需要更换

    } catch (error) {
        console.error('个人信息出现错误信息是:', error.message);
        // console.log(error.response);
    }
}
//投票函数
async function VoteFunciton(wallet,num,headers,agent='') {
    //匹配组合data数据
    let project_Id=projectId[Math.floor(Math.random()*projectId.length)];
    let data_temp={
        address:wallet.address,
        projectId:project_Id,
        votingPower:num
    };
    // console.log(data_temp);
    
    //message获取
    let message=Web3.utils.sha3(JSON.stringify(data_temp));
    //钱包授权
    // let signature=await wallet.signMessage(JSON.stringify({
    //     address: wallet.address,
    //     hexMessage: "Welcome to Morph!\n\nThis is only for address check purposes, it will not trigger a blockchain transaction or cost any gas fees.\n",
    //     chainId: 2810
    // }));
    // console.log(signature);
    
    let data_TX={
        message:message,
        signature:await wallet.signMessage(message_ALL), 
        data:cryptoJS.AES.encrypt(JSON.stringify(data_temp), V_key).toString()
    }
    console.log(`验证测试数据是否正确3333333333333333333`);
    // console.log(data_TX);

    //获取钱包账户的token
    try {
        let token= await sendRequestFetch(VOTE_URL,{
            headers:headers,
            agent:agent,
            body:JSON.stringify(data_TX),
            method:'post'
        });
        // console.log(token);
        let re=await token.json();
        if (re.code===1000) {
            console.log(`投票完成。。。`);
        }else{
            console.log(re.message);
        }
    } catch (error) {
        console.error('投票出现错误信息是:', error.message);
    }
}
const main=async (privateKeys)=>{

    //打乱密钥顺序
    // const shuffled_PrivateKeys=NewPrivatKeys(PrivateKeys$18Wallets);
    //循环开始
    // let agent = new SocksProxyAgent.SocksProxyAgent(RPC.ip);
    
    // let agent=''
    for (let index =0; index <privateKeys.length; index++) {//PrivateKeys$136Wallets.length
        let agent = new HttpsProxyAgent(RPC.bytioproxy);
        let userAgent = fakeUa();
        let headers=getHeaders(userAgent);
        let randTime=Math.floor(Math.random() * (10))
        let wallet=new ethers.Wallet(privateKeys[index],provider);
        console.log(`开始执行第${index+1}个钱包，地址为:${wallet.address},开始执行签到：`);
        console.log(`${randTime+2}秒后执行签到`);
        await sleep(randTime+2)
        await Qiandao(wallet,headers,agent);
        //休眠
        console.log(`${randTime+2}秒后执行开盲盒`);
        await sleep(randTime+2)
        await Open_Blind_Box(wallet,headers,agent);
        console.log(`${randTime+2}秒后执行投票`);
        await sleep(randTime+2)
        //开始投票r 
        let vote_number=await Personal_Stats(wallet,headers,agent);
        while (vote_number>100) {
            await VoteFunciton(wallet,100,headers,agent);
            vote_number=vote_number-100;
            await sleep(5);
        }
        if (vote_number>0) {
            await VoteFunciton(wallet,vote_number,headers,agent);
        }
        console.log(`。。。。。。。。。。。。。。。。。。。。。。。`);
        
    }
}
main(PrivateKeys$136Wallets.slice(100))//
//100