import { ethers } from 'ethers';
import bulbaswapWETHABI from '../../config/bulbaswapWETHABI.json' assert { type: 'json' };;
import { PrivateKeys$18Wallets, PrivateKeys$136Wallets } from '../../util/privateKey.js';
import { Contract_Addresses,convertEthToWeth,convertWethToEth,RPC_provider,NewPrivatKeys, sleep, formHexData, walletSendtxData,getTokenBalance } from '../../util/common.js';
import RPC from '../../config/runnerRPC-1.json' assert { type: 'json' };;
import pLimit from 'p-limit';
const CONCURRENCY_LIMIT=8;

   
const main=async(privateKeys)=>{
    const provider=new ethers.JsonRpcProvider(RPC.morph);//设置链接PRC
    const shuffled_PrivateKeys=NewPrivatKeys(privateKeys);
    const limit = pLimit(CONCURRENCY_LIMIT);
    // const tasks=privateKeys.map(privateKey=>
    //     limit(async ()=>{
    //         let Plume_wallet=new ethers.Wallet(privateKey,await RPC_provider(RPC.plumerpc));
    //         console.log(`地址：${Plume_wallet.address}`);
    //         // console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
    //         await Arc(Plume_wallet);   
    //     })
    //  );
    for (let index = 0; index < shuffled_PrivateKeys.length; index++) {//shuffled_PrivateKeys.length
        try {
            const wallet=new ethers.Wallet(shuffled_PrivateKeys[index],provider);
            const address=wallet.address;
            console.log(`第${index+1}个钱包${address}开始交互。。。。。。。。。。。。。。`);
            let Frist_amount_Eth=ethers.formatEther(await provider.getBalance(address));
            console.log(`第一次开始交互有: ${Frist_amount_Eth} ETH`);
            let Frist_amount_Weth=await getTokenBalance(Contract_Addresses.WETH,bulbaswapWETHABI,wallet);
            console.log(`第一次开始交互有: ${Frist_amount_Weth} WETH`);
    
            let converAmount=Math.random() * (Frist_amount_Eth/2) + Frist_amount_Eth/2;//转化一半以内的eth至weth
            await convertEthToWeth(Contract_Addresses.WETH,bulbaswapWETHABI,wallet,converAmount);
            await sleep(5)
            let amount_WETH=await getTokenBalance(Contract_Addresses.WETH,bulbaswapWETHABI,wallet);
            
            // let amount_WETH_rear=await SWAP_UTIL.getTokenBalance(SWAP_UTIL.Contract_Addresses.WETH,bulbaswapWETHABI,wallet);
    
            let converAmount1=Math.random() * (amount_WETH/4) + amount_WETH*0.75;//转化一半以内的eth至weth
            //weth转化成eth
            await convertWethToEth(Contract_Addresses.WETH,bulbaswapWETHABI,wallet,converAmount1);
            await sleep(2)
            let Last_amount_Eth=ethers.formatEther(await provider.getBalance(address));
            console.log(`最后交互有: ${Last_amount_Eth} ETH`);
            let Last_amount_Weth=await getTokenBalance(Contract_Addresses.WETH,bulbaswapWETHABI,wallet);
            console.log(`最后交互有: ${Last_amount_Weth} WETH`);
            // const amountWeth =await SWAP_UTIL.getTokenBalance(SWAP_UTIL.Contract_Addresses.WETH,bulbaswapWETHABI,wallet);
            // console.log(`WETH数量是:${amountWeth}`);
            console.log(`交互完成。。。。。。。。。。。。。。开始下一个钱包`);
            
        } catch (error) {
            console.error('2222222222发生错误:', error.message); 
        }
        
    }

}
//测试时候查看是136个钱包还是18个钱包，两个不同
main(PrivateKeys$18Wallets)