# Docker 사용 가이드

## 프로덕션 환경 실행

```bash
# Docker 이미지 빌드
docker build -t ma-app .

# 컨테이너 실행
docker run -p 3000:3000 ma-app
```

## 개발 환경 실행

```bash
# 개발용 이미지 빌드
docker build -f Dockerfile.dev -t ma-app-dev .

# 컨테이너 실행 (볼륨 마운트로 실시간 코드 변경 반영)
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules ma-app-dev
```

## 유용한 명령어

```bash
# 실행 중인 컨테이너 확인
docker ps

# 컨테이너 로그 확인
docker logs <container_id>

# 컨테이너 내부 접속
docker exec -it <container_id> sh

# 이미지 삭제
docker rmi ma-app

# 사용하지 않는 이미지/컨테이너 정리
docker system prune
```

## 환경 변수

필요한 환경 변수가 있다면 `.env` 파일을 생성하거나 Docker 실행 시 환경 변수를 전달하세요:

```bash
docker run -p 3000:3000 -e NODE_ENV=production ma-app
```
