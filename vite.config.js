// vite.config.js

export default {
    // 개발 서버 구성
    server: {
      port: 3000, // 개발 서버 포트 설정
      open: true, // 브라우저 자동 오픈 여부
    },
  
    // 빌드 설정
    build: {
      outDir: 'dist', // 빌드된 파일의 출력 디렉터리 설정
      assetsDir: 'assets', // 정적 에셋 디렉터리 설정
      sourcemap: true, // 소스맵 생성 여부
      // minify: 'terser' // 빌드 시 코드 최소화(Terser 사용)
    },
    
    // 필요에 따라 추가적인 설정을 할 수 있습니다.
  }
  