// Node.js, Express 패키지를 활용하여 간단한 서버 구성

const express = require('express');

const app = express();


const clientId='2u10LiO30qmvNi3RasVi';
const clientSecret = 'Kxcj3CQqUy';

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
    // text프로퍼티에 있는 값을 query라는 이름의 변수에 담고 싶고, targetLanguage는 그 이름 그대로 동일한 이름의 변수로 담고 싶음
    // const { text: query, } = request.body;
    console.log(request.body);

    // 실제 papago 서버에 언어 감지 요청을 위한 url
    const url = 'https://openapi.naver.com/v1/papago/detectLangs';

    // 실제 언어감지 API 요청 전송
    // options: 서버에 전송할 데이터 및 header 정보 등을 모아 놓은 복합 객체(object)
    // () => {}: 요청에 따른 응답 정보를 확인하는 부분
    // const options = {
    //     url,
    //     form: { query },
    //     headers: {
    //         'X-Naver-Client-Id': clientId,
    //         'X-Naver-Client-Secret': clientSecret,
    //     }
    // };

    httpRequest.post(optionsFrom(), (error, httpResponse, body) => {
        if (!error && httpResponse.statusCode === 200) {
            const parsedData = JSON.parse(body); // body를 parsing 처리 -> {"langCode":"ko"}
            const sourceLanguage = parsedData.langCode;

            response.send(body);
            // // papago 번역 url('/translate')로 redirect(요청 재지정)
            // response.redirect(`translate?sourceLanguage=${sourceLanguage}&targetLanguage=${targetLanguage}&query=${query}`);

        } else { // 응답이 실패했을 경우
            console.log(`error = ${httpResponse.statusCode}, ${httpResponse.statusMessage}`);
        }
    });

});

// papago 번역 요청 부분
app.get('/translate', (request, response) => {
    console.log(request.query);
 
    // 실제 번역 요청을 위한 url
    const api_url = 'https://openapi.naver.com/v1/papago/n2mt';
   
    // 실제 번역 API 요청 전송
    httpRequest.post(optionsFrom(url, ), (error,httpResponse,body))=>{
        if(!error&&response.statusCode===200){
            response.send(body);
        }
    }
    });

const port = 3000;
app.listen(port, () => console.log(`http://127.0.0.1:3000/ app listening on port ${port}`));

const optionsFrom = (url, form, headers)=>{
    return{
        url,
        form,
        headers:{
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
            ...headers,
        }

    }
};