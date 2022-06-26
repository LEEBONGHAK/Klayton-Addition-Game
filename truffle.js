// truffle.js config for klaytn.
require('dotenv').config();
const PrivateKeyConnector = require('connect-privkey-to-provider');
const NETWORK_ID = '1001';	// Baobab 고유의 네트워크 아이디
const GASLIMIT = '20000000';	// 배포하는 데 들어가는 가스 한도
const URL = 'https://api.baobab.klaytn.net:8651'	// 클레이튼의 풀노드가 돌아가고 있는 baobab 테스트넷
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
	networks: {
		klaytn: {
			provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
			network_id: NETWORK_ID,
			gas: GASLIMIT,
			gasPrice: null,
		}
	},
}