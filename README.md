
# Push Notification Utlitiy

This notification utility can be sends the notification on all platforms with different methods.


## Installation

Install with pip:

```
$ pip install -r requirements.txt
```

## Flask Application Structure 
```
.
|──────instance/
| |────config.py
|──────server/
| |────static/
| | |────images/
| | |────css/
| | | |────style.css
| | | |────styles.css
| | |────js/
| | | |────register_service_worker.js
| | | |────WebFBApiJS.js
| | | |────WebFBSdkJS.js
| | | |────WebJS.js
| | | |────service_worker
| |────templates/
| | |────ios.html
| | |────firebase.html
| | |────main.html
| | |────test.html
| | |────webapp.html
| | |────webpush.html
|──────webpush_handler.py
|──────__init__.py
|──────app.py
|──────firebase-messaging-sw.js
|──────readme.md
|──────requirements.txt
|──────tests/

```


## Flask Configuration

#### Example

```
app = Flask(__name__)
```
### Configuring From Files

#### Example Usage

```
app = Flask(__name__ )
app.config.from_pyfile('config.cfg')
```


#### Builtin Configuration Values

SERVER_NAME: Currently app is running on open host so Device IP, 127.0.0.1, localhost can be used to host the application.

PORT_NUMBER: 1000


## Run Flask
### Run flask for develop
```
$ python app.py
```
In flask, port running is `1000`

## API List

### Register Device
It will add the device type and token into DB.

URL: http://127.0.0.1:1000

Endpoint: /registerdevice

Method: POST

Authentication: No

Parameters Input: Example of giving parameters in JSON format.

```
{
    "device" : "TestDevice",
    "token" : "random_token"
}
```

Return: User already exists.
```
{
    "message": "Already registered.",
    "status": "200"
}
```

### Firebase SDK Notification
It will send firebase sdk notification.

URL: http://127.0.0.1:1000

Endpoint: /firebase/sdk

Method: POST

Authentication: No

Parameters Input: Example of giving parameters in JSON format.

```
{
    "key": "AAAAWTWs6xxxx91bH7gyo",
    "title": "Notification title",
    "body": "notification body",
    "image": "image_url",
    "link": "notification_click_link",
    "token": "fihXqlZk3v0py359Y8_uAj:APAZF7ot6G_6y",
    'set_0_input1': 'action_title_1',
    'set_0_input2': 'action_url_1',
    'set_1_input1': 'action_title_2',
    'set_1_input2': 'action_url_2',
}
```

Return: Successfully sent message.

```
{
    "multicast_id":4659721xxxx02161996,"success":1,"failure":0,"canonical_ids":0,"results":[{"message_id":"283f1231-b5ba-xxxx-9d3c-1341a4d39534"}]
}
```

Return: Failure sending message.

```
{
    "multicast_id":4659721xxxx02161996,"success":0,"failure":1,"canonical_ids":0,"results":[{"message_id":"283f1231-b5ba-xxxx-9d3c-1341a4d39534"}]
}
```

### Firebase API Notification
It will add the device type and token into DB.

URL: http://127.0.0.1:1000

Endpoint: /firebase/api

Method: POST

Authentication: No

Parameters Input: Example of giving parameters in JSON format.

```
{
    "key": "AAAAWTWs6xxxx91bH7gyo",
    "title": "Notification title",
    "body": "notification body",
    "image": "image_url",
    "link": "notification_click_link",
    "token": "fihXqlZk3v0py359Y8_uAj:APAZF7ot6G_6y",
    'set_0_input1': 'action_title_1',
    'set_0_input2': 'action_url_1',
    'set_1_input1': 'action_title_2',
    'set_1_input2': 'action_url_2',
}
```

Return: Successfully registered data.

```
{
    "message": "Successfully registered.",
    "status": "200"
}
```
Return: User already exists.
```
{
    "message": "Successfully registered.",
    "status": "200"
}
```

### Save WebPush Subscription
It will add the device type and token into DB.

URL: http://127.0.0.1:1000

Endpoint: /api/push-subscriptions

Method: POST

Authentication: No

Parameters Input: Example of giving parameters in JSON format.

```
{
    "device" : "TestDevice",
    "token" : "random_token"
}
```

Return: Successfully registered data.

```
{
    "message": "Successfully registered.",
    "status": "200"
}
```
Return: User already exists.
```
{
    "message": "Successfully registered.",
    "status": "200"
}
```

### Send WebPush Notification
It will add the device type and token into DB.

URL: http://127.0.0.1:1000

Endpoint: /admin-api/trigger-push-notifications

Method: POST

Authentication: No

Parameters Input: Example of giving parameters in JSON format.

```
{
    "title": "Notification title",
    "body": "notification body",
    "image": "image_url",
    "link": "notification_click_link",
    'set_0_input1': 'action_title_1',
    'set_0_input2': 'action_url_1',
    'set_1_input1': 'action_title_2',
    'set_1_input2': 'action_url_2',
}
```

Return: Successfully registered data.

```
{
    "message": "Successfully registered.",
    "status": "200"
}
```
Return: User already exists.
```
{
    "message": "Successfully registered.",
    "status": "200"
}
```8


## Reference

Offical Website

- [Flask](http://flask.pocoo.org/)
- [Firebase_Admin](http://flask.pocoo.org/extensions/)
- [Flask-SQLalchemy](http://flask-sqlalchemy.pocoo.org/2.1/)
- [Flask-OAuth](https://pythonhosted.org/Flask-OAuth/)
- [Flask WebPushl](http://elasticsearch-dsl.readthedocs.io/en/latest/index.html)
- [gunicorn](http://gunicorn.org/)

