
import { ethers } from 'ethers';
import pLimit from 'p-limit';
import { PrivateKeys$18Wallets, PrivateKeys$136Wallets } from '../../util/privateKey.js';
import { RPC_provider,formHexData,walletSendtxData, walletContract,sleep,NewPrivatKeys,getTokenBalance} from '../../util/common.js';
import RPC from '../../config/runnerRPC-1.json' assert { type: 'json' };
import { wallet_create } from '../../util/wallet_create.js';
import bulbaswapWETHABI from '../../config/bulbaswapWETHABI.json' assert { type: 'json' };

const CONCURRENCY_LIMIT=5;

const Mock_USDC=`0x9B056FbA1201d05376383708a45ECF91e3B975F4`;
const Mock_USDC_Contract=`0xea10cc1f6D4BbC5D3de25cC88d40d51eB38DCb7b`;
const Mock_USDT=`0xaa38d0C08FC1eC4fba065Ef4e3DbCe1CA3f2D0fa`;
const Mock_DAI=`0x14f94ba0C72A25aF195c6ac333652498C07A8B46`;
const Mock_USDT_Contract=`0x9a5450d9c71fa9d6bf8df25e49313d7c3c42de60`;
const usdt_eth_constract=`0xC872FD87D4653146d6fB2Af82C4BCC50595E4762`;
const constract_abi=[{"inputs":[{"internalType":"bytes","name":"commands","type":"bytes"},{"internalType":"bytes[]","name":"inputs","type":"bytes[]"}],"name":"execute","outputs":[],"stateMutability":"payable","type":"function"}];
//claimMOCKToken函数，主要作用就是领取测试网的水
async function claimMOCKToken(wallet){
    console.log(`kayakfinance领取测试币。。。。。。。。。。。。。。。。。。。。。`);
    let txData = {
        to: '0x9E40aA181E0f2d4013D722c60DA4ec8415f5620F', 
        data: `0x4e71d92d`,
        value: 0,
        // nonce:await morphl2_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData);
    await sleep(3);
}
//swap_USDC_USDT_Token数据
async function swap_USDC_USDT_Token(wallet,usdc_amount){
    console.log(`Mock_USDC swap过程。。。。。。。。。。。。。。。。。。。。。`);
    const xishu=0.998;//0.999425
    const usdt_amount= xishu * usdc_amount;
    const usdc_amount_bigint=ethers.parseEther(usdc_amount.toString());
    const usdt_amount_bigint=ethers.parseEther(usdt_amount.toString());

    let txData = {
        to: Mock_USDC, 
        data: `0x095ea7b3${formHexData(Mock_USDC_Contract.substring(2))}${formHexData(BigInt(usdc_amount_bigint).toString(16))}`,
        value: 0,
    };
    // console.log(txData);
    
    await walletSendtxData(wallet,txData);
    await sleep(3);

    // data: `0x2a5f1f83${'0'.repeat(63)}80${formHexData(BigInt(usdc_amount_bigint).toString(16))}${formHexData(BigInt(usdt_amount_bigint).toString(16))}${formHexData(BigInt(Math.round(new Date().getTime()/1000)+1800).toString(16))}${'0'.repeat(63)}2${formHexData(Mock_USDC.substring(2))}${formHexData(Mock_USDT.substring(2))}`,

    txData = {
        to: Mock_USDC_Contract, 
        data: `0x2a5f1f83${'0'.repeat(62)}80${formHexData(BigInt(usdc_amount_bigint).toString(16))}${formHexData(BigInt(usdt_amount_bigint).toString(16))}${formHexData(BigInt(Math.round(new Date().getTime()/1000)+1800).toString(16))}${'0'.repeat(63)}2${formHexData(Mock_USDC.substring(2))}${formHexData(Mock_USDT.substring(2))}`,
        // data: `0x2a5f1f83${'0'.repeat(63)}80${formHexData(BigInt(usdc_amount_bigint).toString(16))}0000000000000000000000000000000000000000000000056a13e5f48861bf30${formHexData(BigInt(Math.round(new Date().getTime()/1000)+1800).toString(16))}${'0'.repeat(63)}2${formHexData(Mock_USDC.substring(2))}${formHexData(Mock_USDT.substring(2))}`,
        value: 0,
    };
    // console.log(txData);

    await walletSendtxData(wallet,txData);
    await sleep(3);    
}

//swap_DAI_USDT_Token数据
async function swap_DAI_USDT_Token(wallet,DAI_amount){
    console.log(`Mock_DAI swap过程。。。。。。。。。。。。。。。。。。。。。`);
    const xishu=0.998;
    const usdt_amount= xishu * DAI_amount;
    const DAI_amount_bigint=ethers.parseEther(DAI_amount.toString());
    const usdt_amount_bigint=ethers.parseEther(usdt_amount.toString());

    let txData = {
        to: Mock_DAI, 
        data: `0x095ea7b3${formHexData(Mock_USDC_Contract.substring(2))}${formHexData(BigInt(DAI_amount_bigint).toString(16))}`,
        value: 0,
    };
    // console.log(txData);

    await walletSendtxData(wallet,txData);
    await sleep(3);

    // data: `0x2a5f1f83${'0'.repeat(63)}80${formHexData(BigInt(DAI_amount_bigint).toString(16))}${formHexData(BigInt(usdt_amount_bigint).toString(16))}${formHexData(BigInt(Math.round(new Date().getTime()/1000)+1800).toString(16))}${'0'.repeat(63)}2${formHexData(Mock_DAI.substring(2))}${formHexData(Mock_USDT.substring(2))}`,

    txData = {
        to: Mock_USDC_Contract, 
        data: `0x2a5f1f83${'0'.repeat(62)}80${formHexData(BigInt(DAI_amount_bigint).toString(16))}${formHexData(BigInt(usdt_amount_bigint).toString(16))}${formHexData(BigInt(Math.round(new Date().getTime()/1000)+1800).toString(16))}${'0'.repeat(63)}2${formHexData(Mock_DAI.substring(2))}${formHexData(Mock_USDT.substring(2))}`,
        // data: `0x2a5f1f83${'0'.repeat(63)}80${formHexData(BigInt(DAI_amount_bigint).toString(16))}000000000000000000000000000000000000000000000005697a9c4819c76e10${formHexData(BigInt(Math.round(new Date().getTime()/1000)+1800).toString(16))}${'0'.repeat(63)}2${formHexData(Mock_DAI.substring(2))}${formHexData(Mock_USDT.substring(2))}`,
        value: 0,
    };
    // console.log(txData);

    await walletSendtxData(wallet,txData);
    await sleep(3);    
}

//swap_USDT_ETH_Token数据
async function swap_USDT_ETH_Token(wallet,USDT_amount=5){
    console.log(`swap_USDT_ETH_Token swap过程。。。。。。。。。。。。。。。。。。。。。`);  `1 ETH = 836.355 Mock USDT`
    const xishu=0.001;
    const ETH_amount= xishu * USDT_amount;
    console.log(USDT_amount);
    
    console.log(ETH_amount);
    
    // const ETH_amount= 100;
    const USDT_amount_bigint=ethers.parseEther(USDT_amount.toString());
    console.log(USDT_amount_bigint);
    
    const ETH_amount_bigint=ethers.parseEther(ETH_amount.toString());
    console.log(ETH_amount_bigint);
    

    //approve过程
    let txData = {
        to: Mock_USDT, 
        data: `0x095ea7b3${formHexData(Mock_USDT_Contract.substring(2))}${formHexData(BigInt(USDT_amount_bigint).toString(16))}`,
        value: 0,
    };
    // console.log(txData);
    
    await walletSendtxData(wallet,txData);
    await sleep(3);

    //swap过程
    let date_temp_1=Math.round(new Date().getTime()/1000);
    let date_temp=date_temp_1+24*30*3600;
    const domain =  {
        name: "Permit2",
        chainId: 2810,
        verifyingContract: "0x9a5450d9c71fa9d6bF8Df25e49313D7C3C42de60"
    };
    
    const types = {
        PermitSingle: [{
            name: "details",
            type: "PermitDetails"
        }, {
            name: "spender",
            type: "address"
        }, {
            name: "sigDeadline",
            type: "uint256"
        }],
        PermitDetails: [{
            name: "token",
            type: "address"
        }, {
            name: "amount",
            type: "uint160"
        }, {
            name: "expiration",
            type: "uint48"
        }, {
            name: "nonce",
            type: "uint48"
        }]
    };
    
    const message = {
        details:{
            token: Mock_USDT,
            amount: '0xffffffffffffffffffffffffffffffffffffffff',//BigInt(`1461501637330902918203684832716283019655932542975`),
            expiration: BigInt(date_temp),
            nonce: 0,
        },
        spender: `0xC872FD87D4653146d6fB2Af82C4BCC50595E4762`,
        sigDeadline: BigInt(date_temp_1)
    }
    const signature = await wallet.signTypedData(domain, types, message);

    // let signature=await wallet.signMessage(JSON.stringify(details));
    // txData=[`0x${'0'.repeat(63)}2${formHexData(BigInt(USDT_amount_bigint).toString(16))}${formHexData(BigInt(ETH_amount_bigint).toString(16))}${'0'.repeat(62)}a0${'0'.repeat(63)}1${'0'.repeat(63)}2${formHexData(Mock_USDT.substring(2))}0000000000000000000000005300000000000000000000000000000000000011`,`0x${'0'.repeat(63)}1${formHexData(BigInt(ETH_amount_bigint).toString(16))}`];
    // let txData1=`0x${formHexData(Mock_USDT.substring(2))}000000000000000000000000ffffffffffffffffffffffffffffffffffffffff${formHexData(BigInt(date_temp).toString(16))}${'0'.repeat(64)}${formHexData(usdt_eth_constract.substring(2))}${formHexData(BigInt(date_temp_1).toString(16))}${'0'.repeat(62)}e0${'0'.repeat(62)}41${signature.substring(2)}${'0'.repeat(62)}`;
    let txData2=`0x${'0'.repeat(63)}2${formHexData(BigInt(USDT_amount_bigint).toString(16))}${formHexData(BigInt(ETH_amount_bigint).toString(16))}${'0'.repeat(62)}a0${'0'.repeat(63)}1${'0'.repeat(62)}2b${Mock_USDT.substring(2)}0001f45300000000000000000000000000000000000011000000000000000000000000000000000000000000`;
    let txData3=`0x${'0'.repeat(63)}1${formHexData(BigInt(ETH_amount_bigint).toString(16))}`
    // txData=[txData1,txData2,txData3];
    txData=[txData2,txData3];
    
    console.log(txData);
    
    try {

        const contract=new ethers.Contract(usdt_eth_constract,constract_abi,wallet);
        const txResponse=contract.execute("0x000c",txData);//此步不需要增加await，不然在下一步会报错误
        await walletContract(txResponse);   
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    } 
    await sleep(3);    
}

const main=async(privateKeys)=>{
    console.log(`当前时间点是：${new Date()}`);

    const limit = pLimit(CONCURRENCY_LIMIT);
    const tasks=privateKeys.map(privateKey=>
        limit(async ()=>{
            let wallet=new ethers.Wallet(privateKey.privateKey,await RPC_provider(RPC.morph));
            console.log(`地址：${wallet.address}`);
            // await claimMOCKToken(wallet) 
               
            const Mock_USDC_amount=await getTokenBalance(Mock_USDC,bulbaswapWETHABI,wallet);
            console.log(`Mock_USDC_amount的数量是${Mock_USDC_amount}`);
            // await swap_USDC_USDT_Token(wallet,Mock_USDC_amount)

            const Mock_DAI_amount=await getTokenBalance(Mock_DAI,bulbaswapWETHABI,wallet);
            console.log(`Mock_DAI_amount的数量是${Mock_DAI_amount}`);
            // await swap_DAI_USDT_Token(wallet,Mock_DAI_amount)
            
            const Mock_USDT_amount=await getTokenBalance(Mock_USDT,bulbaswapWETHABI,wallet);
            console.log(`Mock_USDT_amount的数量是${Mock_USDT_amount}`);
            await swap_USDT_ETH_Token(wallet,Math.round(Mock_USDT_amount)-100);            
            // await swap_USDT_ETH_Token(wallet);            
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
    
main(wallet_create.slice(4,5)).catch(error=>{
    console.error(error.message);  
})
// `f13e4c2be10cf1425b221cc0e129864707a4ad024cf215796d2f23babdfdb09b`
//循环获取数量
// const shuffled_PrivateKeys=NewPrivatKeys(privateKeys);
// for (let index = 0; index < privateKeys.length; index++) {//shuffled_PrivateKeys.length
//     const morphl2_wallet=new ethers.Wallet(privateKeys[index],morphl2_Provider);
//     const address=morphl2_wallet.address;
//     console.log(`第${index+1}个钱包，钱包地址是:${address}`);
//     await claimMOCKToken(morphl2_wallet) 
// }

