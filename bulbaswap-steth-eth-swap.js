import { ethers } from 'ethers';
import bulbaswapWETHABI from '../../config/bulbaswapWETHABI.json' assert { type: 'json' };;
import { PrivateKeys$18Wallets, PrivateKeys$136Wallets } from '../../util/privateKey.js';
import { walletContract,RPC_provider,NewPrivatKeys, sleep, formHexData, walletSendtxData,getTokenBalance } from '../../util/common.js';
import RPC from '../../config/runnerRPC-1.json' assert { type: 'json' };;
import pLimit from 'p-limit';
const CONCURRENCY_LIMIT=8;


//mint Wsteth函数
async function claimstETHtoken(wallet){
    const address=wallet.address;
    const wstETH_contract_Token='0xcC3551B5B93733E31AF0c2C7ae4998908CBfB2A1';
    const Interacted_with_contract=`0xC872FD87D4653146d6fB2Af82C4BCC50595E4762`;
    const execute_abi=[
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "commands",
              "type": "bytes"
            },
            {
              "internalType": "bytes[]",
              "name": "inputs",
              "type": "bytes[]"
            }
          ],
          "name": "execute",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    // let value=Math.round(Math.random()*100)/2000;

    // if (value<0.01) {
    //     value=0.02;
    // } 
    // console.log(`交互数量是：${value}`);
    // let value1=ethers.parseEther((value+0.000032034).toString());
    let txData = {
        to: wstETH_contract_Token, 
        data: `0x1249c58b`,
        value: 0
    };
    await walletSendtxData(wallet,txData);
    txData = {
        to: wstETH_contract_Token, 
        data: `0x095ea7b30000000000000000000000009a5450d9c71fa9d6bf8df25e49313d7c3c42de60000000000000000000000000000000000000000000000000016345785d8a0000`,
        value: 0
    };
    await walletSendtxData(wallet,txData);

    txData=[
        `0x000000000000000000000000cc3551b5b93733e31af0c2c7ae4998908cbfb2a1000000000000000000000000ffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000${BigInt(Math.round((new Date().getTime()+30*24*3600*1000)/1000)).toString(16)}0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c872fd87d4653146d6fb2af82c4bcc50595e476200000000000000000000000000000000000000000000000000000000${BigInt(Math.round(new Date().getTime()/1000)).toString(16)}00000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000041459cce592d5d1c37c3cdf326f41867386dc70725ad61f2c2287ca46ddf824e746b9d1be3414b964db2da2432e2a8a001bd5f841f71cf319740313a46bf707c221c00000000000000000000000000000000000000000000000000000000000000`,
        `0x000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000c3663566a580000000000000000000000000000000000000000000000000000082cde1691090dc00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002bcc3551b5b93733e31af0c2c7ae4998908cbfb2a10027105300000000000000000000000000000000000011000000000000000000000000000000000000000000`,
        `0x00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000058d15e17628000000000000000000000000000000000000000000000000000003b72bd3cbb80c100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002bcc3551b5b93733e31af0c2c7ae4998908cbfb2a10000645300000000000000000000000000000000000011000000000000000000000000000000000000000000`,
        `0x000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000470de4df820000000000000000000000000000000000000000000000000000002f933a5db68ad900000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002bcc3551b5b93733e31af0c2c7ae4998908cbfb2a10001f45300000000000000000000000000000000000011000000000000000000000000000000000000000000`,
        `0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000edd3d903829c77`
    ];
    try {
        const contract=new ethers.Contract(Interacted_with_contract,execute_abi,wallet);
        const txResponse=contract.execute('0x0a0000000c',txData)
        await walletContract(txResponse);
        
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }  
}


const main=async(privateKeys)=>{

    const shuffled_PrivateKeys=NewPrivatKeys(privateKeys);
    const limit = pLimit(CONCURRENCY_LIMIT);
    const tasks=privateKeys.map(privateKey=>
        limit(async ()=>{
            let Plume_wallet=new ethers.Wallet(privateKey,await RPC_provider(RPC.morph));
            console.log(`地址：${Plume_wallet.address}`);
            // console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
            await claimstETHtoken(Plume_wallet);   
        })
     );
     await Promise.allSettled(tasks)
     .then(()=>
         console.log(`任务已完成`)
     )
     .catch(error=>{
         console.error(error.message);
     });

}
//测试时候查看是136个钱包还是18个钱包，两个不同
main(NewPrivatKeys(PrivateKeys$18Wallets)).catch(error=>{
    console.error(error.message);  
})