import { Crypto, Account, RestClient, Oep4, utils, TransactionBuilder } from 'ontology-ts-sdk';

const PrivateKey = Crypto.PrivateKey;
const Address = Crypto.Address;
const Oep4TxBuilder = Oep4.Oep4TxBuilder;

const NODE_URL = 'http://polaris2.ont.io:20334';
const PRIVATE_KEY = '7c47df9664e7db85c1308c080f398400cb24283f5d922e76b478b5429e821b93';
const ASSET_HASH = 'ff31ec74d01f7b7d45ed2add930f5d2239f7de33';
const SPENDER = 'AbXMKotJnA3oDw84vXcCNgU2fQ8c4kETqr';

async function run() {
  const privateKey = new PrivateKey(PRIVATE_KEY);
  console.log('private key wif: ', privateKey.serializeWIF());
  const account = Account.create(privateKey, '123456', 'test');
  console.log('address: ', account.address.toBase58());

  const contractAddr = new Address(utils.reverseHex(ASSET_HASH));
  const oep4 = new Oep4TxBuilder(contractAddr);
  const restClient = new RestClient(NODE_URL);

  const gasPrice = '2500';
  const gasLimit = '1000000';

  const tx = oep4.makeApproveTx(account.address, new Address(SPENDER), '10000', gasPrice, gasLimit, account.address);
  TransactionBuilder.signTransaction(tx, privateKey);
  const response = await restClient.sendRawTransaction(tx.serialize(), false);
  console.log('result: ', JSON.stringify(response))
}

run();
