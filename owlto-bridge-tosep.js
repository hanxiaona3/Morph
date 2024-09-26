
import { ethers } from 'ethers';
import { PrivateKeys$18Wallets, PrivateKeys$136Wallets } from '../../util/privateKey.js';
import { RPC_provider,NewPrivatKeys, sleep, formHexData, walletSendtxData,getTokenBalance } from '../../util/common.js';
import RPC from '../../config/runnerRPC-1.json' assert { type: 'json' };;
import pLimit from 'p-limit';
const CONCURRENCY_LIMIT=8;

const morphl2_PRC='https://rpc-quicknode-holesky.morphl2.io';//'https://rpc-holesky.morphl2.io';

const morphl2_Provider=new ethers.JsonRpcProvider(morphl2_PRC);//设置链接PRC
//claimMOCKToken函数
async function claimMOCKToken(wallet,maxRetries = 3,timeout=3000){
    
    console.log(`OWlto交互。。。。。。。。。。。。。。。。。。。。。`);
    const address=wallet.address;
    const Interacted_contract_Token='0x5e809A85Aa182A9921EDD10a4163745bb3e36284';

    let value=Math.round(Math.random()*100)/2000;
    if (value<=0.02) {
        value=0.035;
    }
    console.log(`交互数量是：${value}`);
    let value1=ethers.parseEther(value.toString())+5032n;
    const txData = {
        to: Interacted_contract_Token, 
        data: '0x',
        value: value1,
    };
    await walletSendtxData(wallet,txData);
}

const main=async(privateKeys)=>{
    console.log(`当前时间是：${new Date()}`);
    
    //循环获取数量
    const shuffled_PrivateKeys=NewPrivatKeys(privateKeys);
    for (let index = 0; index < shuffled_PrivateKeys.length; index++) {//PrivateKeys$18Wallets.length  shuffled_PrivateKeys.length
        const morphl2_wallet=new ethers.Wallet(shuffled_PrivateKeys[index],morphl2_Provider);
        const address=morphl2_wallet.address;
        console.log(`第${index+1}个钱包，钱包地址是:${address}`);
        await claimMOCKToken(morphl2_wallet) 
    }
}

main(PrivateKeys$18Wallets)