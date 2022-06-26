// truffle.js config for klaytn.
const PrivateKeyConnector = repuire('connect-privatekey-to-provider');
const NETWORK_ID = '1001';	// Baobab 고유의 네트워크 아이디
const GASLIMIT = '20000000';	// 배포하는 데 들어가는 가스 한도
const URL = 'https://api.baobab.klaytn.net:8651'	// 클레이튼의 풀노드가 돌아가고 있는 baobab 테스트넷 rul 