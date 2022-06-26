const fs = require('fs');

const AdditionGame = artifacts.require('./AdditionGame.sol')

module.exports = function (deployer) {
    // AdditionGame contract deploy
    deployer.deploy(AdditionGame)
        .then(() => {
            if (AdditionGame.json) {
                // deployedABI에 json으로 받은 ABI 정보를 작성
                // ABI: 컨트랙트 함수와 매개 변수들을 JSON 형식으로 나타낸 리스트
                // ABI는 인터페이스 역할을 하며, 컨트랙트 내의 함수를 호출하거나 컨트랙트로부터 데이터를 얻는 방법
                fs.writeFile('deployedABI', JSON.stringify(AdditionGame.json.abi),
                    (err)=> {
                        if (err) throw err;
                        console.log("파일에 ABI 입력 성공")
                    }
                );

                // 배포된 컨트랙트 주소 저장
                fs.writeFile('deployedAddress', AdditionGame.address, 
                    (err)=> {
                        if (err) throw err;
                        console.log("파일에 컨트랙트 주소 입력 성공");
                    }
                );
            }
        })
}
