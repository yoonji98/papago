
const textAreaArray = document.getElementsByClassName('Card__body__content');
const [sourceTextArea, targetTextArea] = textAreaArray;
const [sourceSelect, targetSelect] = document.getElementsByClassName('form-select');

let targetLanguage = 'en';

targetSelect.addEventListener('change', () => {
    targetLanguage = targetSelect.value;
});

let debouncer; //디바운싱 &쓰로쁠릴ㅇ
sourceTextArea.addEventListener('input', (event) => {
    if(debouncer) clearTimeout(debouncer);


    debouncer = setTimeout( async () => { //이 함수는 비동기 함수이다 .
        const text = event.target.value; // 번역할 텍스트
        //비어있는 텍스트면 서버에 전송할 필요가 없도록 코드 작성
        //같은언어 선택시 한국어면 -> 영어  영영-> 한

        if(!text) return;

        const url = '/detect';

        await fetch(url, optionsFrom('POST', { query: text }))
            .then(response => response.json())
            .then(async data => {
                // 자동 언어 감지 부분을 ko면 한국어로, en이면 English로 Select박스가 변할 수 있도록
                const sourceLanguage = data.langCode;
                sourceSelect.value = sourceLanguage;

                if(sourceLanguage === targetLanguage){ //원본언어와 타겟 언어가 서로 같고,
                    if(sourceLanguage === 'ko'){//원본 언어가 한국어일경우
                        targetLanguage ='en'; //타겟 언어를 영어로변경
                    }else{//원본 언어가 한국어가 아닐 경우
                        targetLanguage = 'ko'; // 타겟 언어를 한국어로 변경
                    }
                }



                // 언어 번역 요청 전송 코드 작성
                const url = '/translate';
                const body = {
                    source: sourceLanguage,
                    target: targetLanguage,
                    text,
                };

                await fetch(url, optionsFrom('POST', body))
                    .then(response => response.json())
                    .then(data => {
                        const result = data.message.result;
                        targetTextArea.value = result.translatedText;
                        targetSelect.value = result.tarLangType; // ??
                    })
                    .catch(error => console.error(error));

            })
        .catch(error => console.error(error));
        console.log('2초경과 -> 코드실행');
    },2*1000);
});



const optionsFrom = (method, body, headers) => {
    return{
        method,
        headers:{
            'Content-Type':'application/json',
            ...headers
        },
        body:JSON.stringify(body),
    }
}


//작성 도중이면 전송못하게하고
//작성이 끝나고 2초후에 전송

//2초후에 전송이 되어야 하는데, 작성 도중에는 전송하면 안되니까
// 내가 입력한 값이 내가 텍스트를 입력하기 시작하면 카운팅을시작