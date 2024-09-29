
from httplib2 import Response
from server.models import PushSubscription, RegisteredDevice
from flask.views import MethodView
from flask import make_response, render_template, request, jsonify, Blueprint, send_file
from webpush_handler import trigger_push_notifications_for_subscriptions
from firebase_admin import credentials, messaging
from server import APP, db
from datetime import datetime
import firebase_admin
import requests
import os
import json

AUTH_BLUEPRINT = Blueprint('auth', __name__)

@AUTH_BLUEPRINT.route("/")
@AUTH_BLUEPRINT.route("/main")
def home_page():
    return render_template("main.html")

@AUTH_BLUEPRINT.route("/admin") # Empty
def admin_page():
    return render_template("admin.html")

@AUTH_BLUEPRINT.route("/firebase")
def firebase_page():
    return render_template("firebase.html")

@AUTH_BLUEPRINT.route("/webapp")
def web_page():
    return render_template("webapp.html")

@AUTH_BLUEPRINT.route("/webpush")
def webpushmethod():
    return render_template("webpush.html")

@AUTH_BLUEPRINT.route("/test") # Empty
def test_page():
    return render_template("test.html")

@AUTH_BLUEPRINT.route("/ios") # Pending Initiate
def ios_page():
    return render_template("ios.html")

from flask import Response

@AUTH_BLUEPRINT.route("/firebase-messaging-sw.js")
def firebase_messaging_sw():
    with open('firebase-messaging-sw.js', 'r') as f:
        content = f.read()
    response = Response(content)
    response.headers['Content-Type'] = 'text/javascript'
    return response

# Generate VAPID keys
# const vapidKeys = webpush.generateVAPIDKeys();

# console.log('Public Key:', vapidKeys.publicKey);
# console.log('Private Key:', vapidKeys.privateKey);

class register_device_(MethodView):
    """
    Recieves device token and saves into the db.
    """
    def post(self):
        data = request.get_json(force=True)
        token = data['token']
        device = data['device']
        try:
            user_present = RegisteredDevice.query.filter_by(token=token).first()
            if not user_present:
                user = RegisteredDevice(token=token,device=device)
                db.session.add(user)
                db.session.commit()
                responseObject = {
                                'status': '200',
                                'message': 'Successfully registered.'
                            }
                return make_response(jsonify(responseObject)), 200
            else:
                responseObject = {
                                'status': '200',
                                'message': 'Already registered.'
                            }
                return make_response(jsonify(responseObject)), 200
        except Exception as e:
            responseObject = {
                            'status': '400',
                            'Error': e
                        }
            return make_response(jsonify(responseObject)), 400

class firebase_sdk_(MethodView):
    """
    This methods sends the Firebase SDK Notification.
    Payload : ServiceAccountKey JSON, FCM Token and Notification Payload.
    """
    def post(self):
        json_data = request.get_json()
        time = json_data.get('time')
        token = json_data.get('token')
        key = json_data.get('servicekey')
        json_dict = json.loads(key)
        
        if len(firebase_admin._apps) == 0:
        # Initialize the app if no app instance exists
            cred = credentials.Certificate(json_dict)
            firebase_admin.initialize_app(cred)
        else:
            # Use the default app instance
            print("Firebase Already Initialized")
        
        json_data.pop('servicekey')
        json_data.pop('token')
        try:
            message = messaging.Message(
            notification=messaging.Notification(
                title=json_data.get('title'),
                body=json_data.get('body')
                ),
            data={
                "Image_URL": str(json_data.get('image')),
                "Icon_URL": str(json_data.get('icon')),
                "Notification_Click_URL": str(json_data.get('link')),
                "Action_1_Title": str(json_data.get('set_0_input1')),
                "Action_1_URL": str(json_data.get('set_0_input2')),
                "Action_2_Title": str(json_data.get('set_1_input1')),
                "Action_2_URL": str(json_data.get('set_1_input2'))
                },
            token=token,
            )
            
            if(time == None):
                response = messaging.send(message)
                print('Successfully sent message:', response)
                return jsonify({
                "status": "success"
                }), 200
            else:
                flag = True
                while(flag):
                    if(datetime.now().strftime("%H:%M") == time):
                        response = messaging.send(message)
                        flag = False
                        print('Successfully sent message:', response)
                        return jsonify({
                        "status": "success"
                        }), 200
                    
        except messaging.UnregisteredError as error:
        # Handle unregistered error
            print("Registration token is invalid:", error)
            return jsonify({
                "status": "falied",
                "error" : str(error)
                })
        except Exception as error:
            # Handle other errors
            print("Error sending message:", error)
            return jsonify({
                "status": "falied",
                "error" : str(error)
                })
        
class firebase_api_(MethodView):
    """
    This methods sends the Firebase API Notification.
    Payload : Server Key, FCM Token and Notification Payload.
    """
    def post(self):
        json_data = request.get_json()
        time = json_data.get('time')
        token = json_data.get('token') 
        print(json_data.get('icon')) 
        key = json_data.get('key')   
        server_key = "key=" + str(key)
        json_data.pop('key')
        json_data.pop('token')
        print(json_data)
        url = 'https://fcm.googleapis.com/fcm/send'
        payload = {
                "to": token,
                'priority': 'high',
                    "notification":{
                    "title":json_data.get('title'),
                    "body" : json_data.get('body'),
                    },
                    "data":{
                        "Image_URL" : json_data.get('image'),
                        "Icon_URL" : json_data.get('icon'),
                        "Notifiction_Click_URL" : json_data.get('link'),
                        "Action_1_Title" : json_data.get('set_0_input1'),
                        "Action_1_URL" : json_data.get('set_0_input2'),
                        "Action_2_Title" : json_data.get('set_1_input1'),
                        "Action_2_URL" : json_data.get('set_1_input2')
                    }
            }
        headers = {'content-type': 'application/json',
                    'Authorization' : server_key}
        try:
            if(time == None):
                x = requests.post(url, data=json.dumps(payload), headers=headers)
                print("API Method Executed with T0.")
                print(x.text)
                return jsonify({
                "status": "success"
                })
            else:
                flag = True
                while(flag):
                    if(datetime.now().strftime("%H:%M") == time):
                        x = requests.post(url, data=json.dumps(payload), headers=headers)      
                        print("API Method Executed TF")
                        flag=False
                        return jsonify({
                        "status": "success"
                        })
        except messaging.UnregisteredError as error:
        # Handle unregistered error
            print("Registration token is invalid:", error)
            return jsonify({
                "status": "falied",
                "error" : error
                })
        except Exception as error:
            # Handle other errors
            print("Error sending message:", error)
            return jsonify({
                "status": "falied",
                "error" : error
                })

class save_push_subscription(MethodView):
    """
    This is the 5th step from webpush of sending notification.
    The received subscription is saved into the db.
    """
    def post(self):
        try:
            json_data = request.get_json()
            subscription = PushSubscription.query.filter_by(
                subscription_json=json_data['subscription_json']
            ).first()
            if subscription is None:
                subscription = PushSubscription(
                    subscription_json=json_data['subscription_json']
                )
                db.session.add(subscription)
                db.session.commit()
            return jsonify({
                "status": "success",
                "result": {
                    "id": subscription.id,
                    "subscription_json": subscription.subscription_json
                }
            })    
        except Exception as e:
            print("Error Occured : " + str(e))
            return jsonify({
                "Message" : "Exception Occured",
                "Exception" : e
            }), 400
        
class trigger_push_notifications(MethodView): 
    """
    This is the 6th step from webpush of sending notification.
    The received notification payload sent to webpush_handler
    after db verification.
    """
    def post(self):
        try:
            json_data = request.get_json()
            time = json_data.get('time')
            title = json_data.get('title')
            body = json_data.get('body')
            json_data.pop('title')
            json_data.pop('body')
            subscriptions = PushSubscription.query.all()
            if(time == None):
                results = trigger_push_notifications_for_subscriptions(
                    subscriptions,
                    title,
                    body,
                    json_data
                )           
                return jsonify({
                    "status": "success",
                    "result": results
                }), 200
            else:
                flag = True
                while(flag):
                    if(datetime.now().strftime("%H:%M") == time):
                        results = trigger_push_notifications_for_subscriptions(
                            subscriptions,
                            title,
                            body,
                            json_data
                        )
                        flag=False
                        return jsonify({
                            "status": "success",
                            "result": results
                        }), 200
        except Exception as e:
            return jsonify({
                "Message" : "Exception Occured",
                "Exception" : e
            }), 400     

register_device = register_device_.as_view('register_device')
firebase_api = firebase_api_.as_view('firebase_api')
firebase_sdk = firebase_sdk_.as_view('firebase_sdk')
send_sub = save_push_subscription.as_view('send_sub')
send_webpush = trigger_push_notifications.as_view('send_webpush')
            
AUTH_BLUEPRINT.add_url_rule(
    '/registerdevice',
    view_func=register_device,
    methods=['POST']
)
        
AUTH_BLUEPRINT.add_url_rule(
    '/firebase/api',
    view_func=firebase_api,
    methods=['POST']
)
        
        
AUTH_BLUEPRINT.add_url_rule(
    '/firebase/sdk',
    view_func=firebase_sdk,
    methods=['POST']
)
        
AUTH_BLUEPRINT.add_url_rule(
    '/api/push-subscriptions',
    view_func=send_sub,
    methods=['POST']
)
        
AUTH_BLUEPRINT.add_url_rule(
    '/admin-api/trigger-push-notifications',
    view_func=send_webpush,
    methods=['POST']
)

   