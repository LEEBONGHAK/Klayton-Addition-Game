// 클레이튼 블록체인과 소통할 수 있는 라이브러리
import Caver from 'caver-js';

// 대기 시간동안 보여줄 load spinner 를 위한 라이브러리
import {Spinner} from 'spin.js';

// 환경설정 변수
// rpcURL: 어떤 클레이트 노드에 연결해서 사용할지 정의(여기에서는 baobab 테스트넷)
const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651'
}

// Dapp에서 사용할 수 있도록 rpcURL을 Caver 생성자에 넘겨 인스턴스화
const cav = new Caver(config.rpcURL);

// 배포한 컨트랙트에 접근할 수 있도록 인스턴스 생성
// 배포한 컨트랙트의 ABI 정보와 주소 필요
/* 
  DEPLOYED_ABI, DEPLOYED_ADDRESS
  - Dapp 내부에서 사용할 수 있는 전역 상수들 
  - 생성한 deployedABI, deployedAddress 파일을 읽어서 webpack에서 자동으로 세팅해줌 (webpack.config.js 파일 참조)
*/
const agContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

const App = {
  // 전역 변수: 접근방법 지정, keystore 전체 내용 및 비밀번호 저장
  auth: {
    accessType: 'keystore',
    keystore: '',
    password: ''
  },

  // sessionStorage에 저장된 계정 정보를 불러와 계정인증 상태 유지
  start: async function () {
    const walletFromSession = sessionStorage.getItem('walletInstance'); // walletInstance(계정정보) 가져오기
    if (walletFromSession) {
      try {
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
        this.changeUI(JSON.parse(walletFromSession));
      } catch (e) {
        sessionStorage.removeItem('walletInstance');
      }
    }
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

  // 정보들을 baobab 노드에 보냈을 때 인증에 성공할 수 있는 계정인지 확인
  handleLogin: async function () {
    if (this.auth.accessType === 'keystore') {
      try {
        // Caver 인스턴스에 accounts 멤버를 통해 decrypt 함수로 해독(keystor파일 + 비밀번호) -> decrypt 된 계정 오브젝트 -> privateKey 가져오기
        const privateKey = cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
        this.integrateWallet(privateKey);
      } catch (e) {
        $('#message').text('비밀번호가 일치하지 않습니다.')  // 에러 메세지
      }
    }
  },

  // logout 담당
  handleLogout: async function () {
    this.removeWallet();
    location.reload();  // 페이지 새로고침
  },

  generateNumbers: async function () {
    var num1 = Math.floor((Math.random() * 50) + 10);  // 10 ~ 59
    var num2 = Math.floor((Math.random() * 50) + 10);  // 10 ~ 59
    sessionStorage.setItem('result', num1 + num2);  // 세션 스토리지에 정답 저장 (정답 확인용)

    $('#start').hide();
    $('#num1').text(num1);
    $('#num2').text(num2);
    $('#question').show();
    document.querySelector('#answer').focus();

    this.showTimer();
  },

  // 제출된 정답 판단 및 정답 시 클레이 전송
  submitAnswer: async function () {
    const result = sessionStorage.getItem('result');
    var answer = $('#answer').val();

    if (answer === result) {
      if (confirm('대단해요!! 0.1 KLAY 받기')) {
        // 잔액 확인
        if (await this.callContractBalance() >= 0.1) {
          this.receiveKlay();
        } else {
          alert('죄송합니다. 컨트랙트의 KLAY가 다 소모되었습니다.');
        }
      }
    } else {
      alert('땡! 틀렸습니다!');
    }
  },

  // 배포한 계정(owner 계정)으로 컨트랙트로 KLAY 송금
  deposit: async function () {
    var spinner = this.showSpinner();
    const walletInstance = this.getWallet();  // 현재 로그인된 계정 정보 불러오기

    if (walletInstance) {
      // 로그인된 계정이 owner 계정인지 확인
      if (await this.callOwner() !== walletInstance.address) return;
      else {
        var amount = $('#amount').val();
        if (amount) {
          // 컨트랙트 인스턴스를 사용해 deposit 함수를 불러 KLAY를 보냄
          agContract.methods.deposit().send({
            from: walletInstance.address,
            gas: '250000',
            value: cav.utils.toPeb(amount, "KLAY")
          })
          .then('transactionHash', (txHash) => {
            console.log(`txHash: ${txHash}`);
          })
          .then('receipt', (receipt) => {
            console.log(`(#${receipt.blockNumber}) `, receipt);
            spinner.stop();
            alert(amount + ' KLAY를 컨트랙트에 송금했습니다.');
            location.reload();
          })
          .then('error', (error) => {
            alert(error.message);
          });
        }
        return ;
      }
    }
  },

  // 컨트랙트의 owner 상태 변수 값 불러오기
  callOwner: async function () {
    return await agContract.methods.owner().call();
  },

  // 컨트랙트의 Balance 값 불러오기
  callContractBalance: async function () {
    return await agContract.methods.getBalance().call();
  },

  // Caver 월렛에 존재하는 현재 게정 정보 가져오기
  getWallet: function () {
    if (cav.klay.accounts.wallet.length) {
      return cav.klay.accounts.wallet[0];
    }
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

  // privateKey를 이용해 wallet 인스턴스 가져오기
  integrateWallet: function (privateKey) {
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey); // 계정 정보 인스턴스 가져오기
    cav.klay.accounts.wallet.add(walletInstance); // Caver 인스턴스에 계정 정보 추가 -> 앞으로 트랜젝션 발생 시 쉽게 불러와 트랜젝션 처리 가능
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance)); // 세션 스토리지 설정 / 세션 스토리지: 탭 또는 웹 페이지가 꺼지기 전까지 사용 가능한 웹 브라우저 내 저장공간
    this.changeUI(walletInstance);
  },

  // 전역 변수 초기화
  reset: function () {
    this.auth = {
      keystore: '',
      password: ''
    };
  },

  // UI 변경
  changeUI: async function (walletInstance) {
    $('#loginModal').modal('hide'); // 모달 닫기
    $('#login').hide();  // 로그인 버튼 없애기
    $('#logout').show();  // 로그아웃 버튼 보이기
    $('#game').show();  // 게임 시작 버튼 보이기
    $('#address').append('<br><p>내 계정 주소: ' + walletInstance.address + '</p>'); // 계정 주소 보여주기
    $('#contractBalance').append('<p>이벤트 잔액: ' + cav.utils.fromPeb(await this.callContractBalance(), "KLAY") + 'KLAY</p>'); // 컨트랙트 balance 보여주기
    
    if (await this.callOwner().toUpperCase() === walletInstance.address.toUpperCase()) {
      $('#owner').show();
    }
  },

  // 월렛, 세션 스토리지 클리어
  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem('walletInstance');
    this.reset();
  },

  // 타이머 생성
  showTimer: function () {
    var seconds = 3;
    $('#timer').text(seconds);
    
    // 1초 간격으로 실행할 것 
    var interval = setInterval(() => {
      $('#timer').text(--seconds);
      if (seconds === 0) {
        $('#timer').text('');
        $('#answer').val('');
        $('#question').hide();
        $('#start').show();
        clearInterval(interval);
      }
    }, 1000);
  },

  // load spinner 보여주기
  showSpinner: function () {
    var target = document.getElementById('spin');
    // spinner instance 리턴
    return new Spinner(opts).sip(target);
  },

  receiveKlay: function () {
    var sipnner = this.showSpinner();
    const walletInstance = this.getWallet();

    if (!walletInstance) return ;

    agContract.methods.transfer(cav.utils.toPeb("0.1", "KLAY")).send({
      from: walletInstance.address,
      gas: '250000'
    })
    .then((receipt) => {
      if (receipt.status) {
        spinner.stop();
        alert('0.1 KLAY가 ' + walletInstance.address + ' 계정으로 지급되었습니다.');
        $('#transaction').html('');
        $('#transaction').append(`<p><a href='https://baobab.klaytnscope.com/tx/${receipt.txHash}' target='_blank'>클레이튼 Scope에서 트랜잭션 확인<p/>`);
        return agContract.methods.getBalance().call()
          .then((balance) => {
            $('#contractBalance').html('');
            $('#contractBalance').append('<p>이벤트 잔액: ' + cav.utils.fromPeb(balance, "KLAY") + 'KLAY</p>');
          })
      }
    })
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