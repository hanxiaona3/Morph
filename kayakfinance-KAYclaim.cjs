const ethers=require('ethers')
const axios=require('axios')
const bulbaswapWETHABI = require('../../config/bulbaswapWETHABI.json');
const bulbaswapNativeRouterABI = require('../../config/bulbaswapNativeRouterABI.json');
const {PrivateKeys$18Wallets,PrivateKeys$136Wallets}=require('../../util/privateKey.cjs');
const SWAP_UTIL=require('../../util/swaptoken.cjs');
const {NewPrivatKeys,sleep,formHexData, walletSendtxData}=require('../../util/common.cjs')


const morphl2_PRC='https://rpc-holesky.morphl2.io';//'https://rpc-quicknode-holesky.morphl2.io';//
const morphl2_Provider=new ethers.JsonRpcProvider(morphl2_PRC);//设置链接PRC
//claimMOCKToken函数
async function claimMOCKToken(wallet){
    console.log(`kayakfinance的KAY领取。。。。。。。。。。。。。。。。。。。。。`);
    const Interacted_contract_Token='0x6B9eB58bd04A8A5D6E33aA71E6EBc3471eAc70EE';
    let txData = {
        to: Interacted_contract_Token, 
        data: `0xc4595c60${'0'.repeat(62)}20${'0'.repeat(63)}2${'0'.repeat(64)}${'0'.repeat(63)}1`,
        value: 0,
    };
    await walletSendtxData(wallet,txData,maxRetries = 3,timeout=20000);
}
const main=async(privateKeys)=>{
    console.log(`当前时间点是：${new Date()}`);
    const shuffled_PrivateKeys=NewPrivatKeys(privateKeys);
    //循环获取数量
    for (let index = 0; index < shuffled_PrivateKeys.length; index++) {//PrivateKeys$18Wallets.length
        const morphl2_wallet=new ethers.Wallet(shuffled_PrivateKeys[index],morphl2_Provider);
        console.log(`第${index+1}个钱包，钱包地址是:${morphl2_wallet.address}`);
        await claimMOCKToken(morphl2_wallet) 
    }
}
main(PrivateKeys$136Wallets)