// 클레이튼 블록체인과 소통할 수 있는 라이브러리
import Caver from 'caver-js';

// 환경설정 변수
// rpcURL: 어떤 클레이트 노드에 연결해서 사용할지 정의(여기에서는 baobab 테스트넷)
const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651'
}

// Bapp에서 사용할 수 있도록 rpcURL을 Caver 생성자에 넘겨 인스턴스화
const cav = new Caver(config.rpcURL);

const App = {
  // 전역 변수: 접근방법 지정, keystore 전체 내용 및 비밀번호 저장
  auth: {
    accessType: 'keystore',
    keystore: '',
    password: ''
  },

  start: async function () {

  },

  // 유효한 keystore 파일인지 확인 및 내용 가져오기
  handleImport: async function () {
    const fileReader = new fileReader();
    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (event) => {
      try {
        if (!this.checkValidKeystore(event.target.result)) {
          $('#message').text('유효하지 않은 keystore 파일입니다.')  // 에러 메세지
          return;
        }
        this.auth.keystore = event.target.result;
        $('#message').text('keystore 통과, 비밀번호를 입력하세요.') // 성공 메세지
        document.querySelector('#input-password').focus();  // password 필드 포커싱
      } catch (event) {
        $('#message').text('유효하지 않은 keystore 파일입니다.')  // 에러 메세지
        return;
      }
    }
  },

  // 입력한 비밀번호 가져오기
  handlePassword: async function () {
    this.auth.password = event.target.value;
  },

  handleLogin: async function () {

  },

  handleLogout: async function () {

  },

  generateNumbers: async function () {

  },

  submitAnswer: async function () {

  },

  deposit: async function () {

  },

  callOwner: async function () {

  },

  callContractBalance: async function () {

  },

  getWallet: function () {

  },

  // keystore 파일 유효성 검사
  checkValidKeystore: function (keystore) {
    const parsedKeystore = JSON.parse(keystore); // keystore 파일 내 내용 분해, 오브젝트 변환 후 저장
    const isValidKeystore = parsedKeystore.version && 
      parsedKeystore.id && 
      parsedKeystore.address && 
      parsedKeystore.keyring;

    return isValidKeystore;
  },

  integrateWallet: function (privateKey) {

  },

  reset: function () {

  },

  changeUI: async function (walletInstance) {

  },

  removeWallet: function () {

  },

  showTimer: function () {

  },

  showSpinner: function () {

  },

  receiveKlay: function () {

  }
};

window.App = App;

window.addEventListener("load", function () {
  App.start();
});

var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#5bc0de', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};