//웹 패키지
var express    = require('express');
var transfer = require('./transferation/transferation');
var app        = express();
var router  = express.Router();

//var transferation = require('./naver/transferation/transferation');
//var map = require('./naver/map/map');

//네이버 TTS 용 패키지 웹 요청 용
var request = require('request');
//카카오톡 파싱용 패키지
var bodyParser = require('body-parser');

//네이버 API ID
var client_id = 'O_NGMD1kRYWbVhvzRGBl';
//네이버 API키
var client_secret = 'RQE6dKbeoQ';

var api_url = 'https://openapi.naver.com/v1/papago/n2mt';

//router.use('/transferation',transferation);
//router.use('/map',map);



//초기 상태 get '시작'' 버튼으로 시작
router.get('/keyboard', function(req, res){
    console.log('Start keyboard');
    const menu = {
        "type": 'buttons',
        "buttons": ["시작"]
    };

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(menu));
});

//카톡 메시지 처리
router.post('/message',function (req, res) {
    console.log('Start message')
    const _obj = {
        user_key: req.body.user_key,
        type: req.body.type,
        content: req.body.content
    };
    //카톡으로 받은 메시지
    console.log("content ["+_obj.content+"]");
    /// 네이버 번역기 전송할 데이터 만들기
    console.log('add function');
    var options = {
        url: api_url,
        //한국어(source : ko) > 영어 (target : en ), 카톡에서 받은 메시지(text)
        form: {'source':'ko', 'target':'en', 'text':req.body.content},
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };
    var responseMsg = '';
    //네이버로 번역하기 위해 전송(post)
    request.post(options, function (err, res, body) {
        //번역이 성공하였다면.
        if (!err && res.statusCode == 200) {
            //json 파싱
            var objBody = JSON.parse(res.body);
            //번역된 메시지
            console.log(objBody.message.result.translatedText);

            //카톡으로 번역된 메시지를 전송하기 위한 메시지
            const massage = {
                "message": {
                    "text": objBody.message.result.translatedText
                },
            };
            responseMsg = JSON.stringify(massage);
            //카톡에 메시지 전송


        } else {
            //네이버에서 메시지 에러 발생
            res.status(res.statusCode).end();
            console.log('error = ' + res.statusCode);

            const massage = {
                "message": {
                    "text": res.statusCode
                },
            };
            //카톡에 메시지 전송 에러 메시지
            responseMsg = JSON.stringify(massage);
        }
    });
    res.set({
        'content-type': 'application/json'
    }).send(responseMsg);

});

module.exports = router;