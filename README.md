Тестирование депозитов
```http request
POST http://127.0.0.1:4000/api/payments/create
Content-Type: application/json
x-api-key: Test!@#

{
    "id": "1234",
    "userId": "42",
    "amount": 1000,
    "successUrl": "http://url.ru",
    "rejectUrl": "http://url.ru",
    "callbackUrl": "http://127.0.0.1:3000/v1/payments/test/callback"
}
```
ответ
```http request
HTTP/1.1 201 Created
Content-Type: application/json

{
    "url": "test_url"
}
```
Тестирование вывода
```http request
POST http://127.0.0.1:4000/api/payments/withdraw
Content-Type: application/json
x-api-key: Test!@#

{
    "id": "1234",
    "userId": "42",
    "card": "1234567890123456",
    "amount": 1000,
    "callbackUrl": "http://127.0.0.1:3000/v1/payments/test/callback"
}
```
ответ 
```http request
HTTP/1.1 201 Created
Content-Type: application/json

{
    "success": true
}
```

для тестирвания неудачного сценария нужно отправить запрос с определенным зачением amount:

amount 500 - fetch запрос получит ошибку code 500,
amount 404 -  fetch запрос не получит ответ (не отпралю response)

callback
amount 13 - сделает колбек со статусом REJECTED
amount 13400 - сделает колбек со статусом CANCELLED
amount 13404 - не будет отправлять колбеки вовсе

