
//웹 패키지
var transLang = {}
//네이버 API ID
var client_id = 'O_NGMD1kRYWbVhvzRGBl';
//네이버 API키
var client_secret = 'RQE6dKbeoQ';

var api_url = 'https://openapi.naver.com/v1/papago/n2mt';

//네이버 TTS 용 패키지 웹 요청 용
var request = require('request');

transLang.add = function(){
    /// 네이버 번역기 전송할 데이터 만들기
    console.log('add function');
    var options = {
        url: api_url,
        //한국어(source : ko) > 영어 (target : en ), 카톡에서 받은 메시지(text)
        form: {'source':'ko', 'target':'en', 'text':req.body.content},
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };

    //네이버로 번역하기 위해 전송(post)
    request.post(options, function (error, response, body) {
        //번역이 성공하였다면.
        if (!error && response.statusCode == 200) {
            //json 파싱
            var objBody = JSON.parse(response.body);
            //번역된 메시지
            console.log(objBody.message.result.translatedText);

            //카톡으로 번역된 메시지를 전송하기 위한 메시지
            const massage = {
                "message": {
                    "text": objBody.message.result.translatedText
                },
            };

        } else {
            //네이버에서 메시지 에러 발생
            console.log('error = ' + response.statusCode);

            const massage = {
                "message": {
                    "text": response.statusCode
                },
            };
            //카톡에 메시지 전송 에러 메시지
            //res.set({
            //    'content-type': 'application/json'
            //}).send(JSON.stringify(massage));
        }
    });

    return massage;


}

exports.transLang = transLang;