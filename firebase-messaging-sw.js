importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyCaKz9MVEogoKbh6CNWao2af5QawDKTHbc",
    authDomain: "fir-webpush-3ebb1.firebaseapp.com",
    projectId: "fir-webpush-3ebb1",
    storageBucket: "fir-webpush-3ebb1.appspot.com",
    messagingSenderId: "383152613780",
    appId: "1:383152613780:web:ee3783c37f6f5f60ef8781",
    measurementId: "G-6XHT25XWMD"  
};// Initialize Firebase

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

class SendNotification { // wrapper class , static, tight coupling
    constructor(title, options) {
      this.title = title;
      this.options = options;
      if (new.target === SendNotification) {
        throw new TypeError("Cannot construct Abstract instances directly");
      }
    }
    run(title, options) {
      this.title = title;
      this.options = options;
      return self.registration.showNotification(title, options); // main class
    }
  }
  
  class extend extends SendNotification{} // extendeding class
  // let myObject = new SendNotification() // will create error !!
    let object = new extend()


var notification_click;
var action_url_1;
var action_url_2;

self.addEventListener('push', function(event) {
    const payload = event.data ? event.data.json() : {};
    // console.log(payload.data)
    const filteredPayload = {};
    for (const [key, value] of Object.entries(payload.data)) {
      if (value !== undefined && value !== 'None' && String(value).trim() !== '') {
        filteredPayload[key] = value;
      }
    }
    // console.log(filteredPayload)
    // console.log(filteredPayload.Icon_URL)

    notification_click = filteredPayload.Notification_Click_URL;
    action_title_1 = filteredPayload.Action_1_Title
    action_url_1 = filteredPayload.Action_1_URL
    action_title_2 = filteredPayload.Action_2_Title
    action_url_2 = filteredPayload.Action_2_URL
    

    const title = payload.notification.title || 'Notification Title';

  if (action_title_1 && action_title_2) {
    console.log('Both actions provided');
    options = {
      body: payload.notification.body || 'Notification Body',
      icon: filteredPayload.Icon_URL || '/static/images/icon.png',
      image: filteredPayload.Image_URL,
      actions: [{action: 'action-button-1', title: action_title_1},
                {action: 'action-button-2', title: action_title_2}]
    };

  } else if (action_title_1 && (action_title_2 === undefined || action_title_2 === 'None')) {
    console.log('Action 1 provided');
    options = {
      body: payload.notification.body || 'Notification Body',
      icon: filteredPayload.Icon_URL || '/static/images/icon.png',
      image: filteredPayload.Image_URL,
      actions: [{action: 'action-button-1', title: action_title_1}]
    };
  } else if (action_title_2 && (action_title_1 === undefined || action_title_1 === 'None')) {
    console.log('Action 2 provided');
    options = {
      body: payload.notification.body || 'Notification Body',
      icon: filteredPayload.Icon_URL || '/static/images/icon.png',
      image: filteredPayload.Image_URL,
      actions: [{action: 'action-button-2', title: action_title_2}]
    };
  } else {
    console.log('Neither action is provided');
    options = {
      body: payload.notification.body || 'Notification Body',
      icon: filteredPayload.Icon_URL || '/static/images/icon.png',
      image: filteredPayload.Image_URL
    };
  }
      event.waitUntil(object.run(title, options));

  });


self.addEventListener('notificationclick', function(event) {
  console.log("Click Received.")
  

  if(event.action === 'action-button-1') {
    if(action_url_1 == undefined || ""){
      event.notification.close();
    }
    else{
    event.waitUntil(clients.openWindow(action_url_1));
  }
  } 

  if (event.action === 'action-button-2') {
    if(action_url_2 == undefined || ""){
      event.notification.close();
    }
    else{
    event.waitUntil(
      clients.openWindow(action_url_2)
    );
  }
  } else if(notification_click != undefined || "") {
    console.log(notification_click)
    event.waitUntil(
      clients.openWindow(notification_click)
    );
  }else{
    console.log('No action provided.')
  }
});


