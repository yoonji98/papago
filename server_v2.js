// Node.js, Express 패키지를 활용하여 간단한 서버 구성

const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const clientId =process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const httpRequest = require('request');

// express의 static 미들웨어 활용
app.use(express.static('public'));

// express의 JSON 미들웨어 활용
app.use(express.json());

// /: root 경로
app.get('/', (request, response) => {
    response.sendFile('index.html');
});

// localhost:3000/detect 경로로 요청했을 때 동작할 함수
app.post('/detect', (request, response) => {
    // 실제 papago 서버에 언어 감지 요청을 위한 url
    const url = 'https://openapi.naver.com/v1/papago/detectLangs';

    httpRequest.post(optionsFrom(url, request.body), (error, httpResponse, body) => {
        if (!error && httpResponse.statusCode === 200) {
            response.send(body);
        } else {
            console.log(`error = ${httpResponse.statusCode}, ${httpResponse.statusMessage}`);
        }
    });

});

// papago 번역 요청 부분
app.post('/translate', (request, response) => {

    // 실제 번역 요청을 위한 url
    const url = 'https://openapi.naver.com/v1/papago/n2mt';

    // const options = {
    //     url,
    //     form: request.body,
    //     headers: {
    //         'X-Naver-Client-Id': clientId,
    //         'X-Naver-Client-Secret': clientSecret,
    //     },
    // }

    // 실제 요청 전송
    httpRequest.post(optionsFrom(url,request.body), (error, httpResponse, body) => {
        if (!error && response.statusCode === 200) {
            response.send(body);
        }
    });


    // 번역된 결과 텍스트값 출력(확인)
});

const port = 3000;
app.listen(port, () => console.log(`http://127.0.0.1:3000/ app listening on port ${port}`));

// 유틸 메서드
const optionsFrom = (url, form, headers) => {
    return {
        url,
        form,
        headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
            ...headers,
        }
    }
};