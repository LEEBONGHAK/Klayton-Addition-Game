# Klayton-Addition-Game

## Deploy Smart Contract to Klaytn Network
  
```
> npm install
> truffle deploy --network klaytn
```
  
## Redeploy Smart Contract to Klaytn Network
  
```
> truffle deploy --compile-all --reset --network klaytn
```
- `--compile-all`: re-compile all contracts  
- `--reset`: restart script file in migrations repository by force  
  
  
  
> 참고 자료
"SEJONG IT EDU 강사님", 인프런 [Klaytn 클레이튼 블록체인 어플리케이션 만들기 - 이론과 실습](https://www.inflearn.com/course/%ED%81%B4%EB%A0%88%EC%9D%B4%ED%8A%BC/dashboard)