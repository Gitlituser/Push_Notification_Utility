'use strict';

const version = '1.0';

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




// Check if the service worker is already active
if (!self.registration.active) {
  // Register and activate the service worker
  self.addEventListener('install', function(event) {
    console.log('Service Worker installing.');
  });
  
  self.addEventListener('activate', function(event) {
    console.log('Service Worker activating.');
    // event.waitUntil(self.clients.claim());
  });
}

var notification_click;
var action_url_1;
var action_url_2;
self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  // console.log('[Service Worker] Push Had this data.', );

  // var data = event.data.json();
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  let data = JSON.parse(event.data.text());
  // This function removes the empty valued keys from the received json. 
  const filteredPayload = {};
  for (const [key, value] of Object.entries(data.data)) {
    if (value !== undefined && value !== 'None' && String(value).trim() !== '') {
      filteredPayload[key] = value;
    }
  }

  notification_click = filteredPayload.link;

  var action_title_1 = filteredPayload.set_0_input1;
  action_url_1 = filteredPayload.set_0_input2;
  var action_title_2 = filteredPayload.set_1_input1;
  action_url_2 = filteredPayload.set_1_input2;

  const title = data.title || 'Notification Title';
  let options;

  if (action_title_1 && action_title_2) {
    console.log('Both actions are provided');
    options = {
      body: data.body || 'Notification Body',
      icon: filteredPayload.icon || '/static/images/icon.png',
      image: filteredPayload.image,
      actions: [{action: 'action-button-1', title: action_title_1},
                {action: 'action-button-2', title: action_title_2}]
    };

  } else if (action_title_1 && (action_title_2 === undefined || action_title_2 === 'None')) {
    console.log('Only action 1 is provided');
    options = {
      body: data.body || 'Notification Body',
      icon: filteredPayload.icon || '/static/images/icon.png',
      image: filteredPayload.image,
      actions: [{action: 'action-button-1', title: action_title_1}]
    };
  } else if (action_title_2 && (action_title_1 === undefined || action_title_1 === 'None')) {
    console.log('Only action 2 is provided');
    options = {
      body: data.body || 'Notification Body',
      icon: filteredPayload.icon || '/static/images/icon.png',
      image: filteredPayload.image,
      actions: [{action: 'action-button-2', title: action_title_2}]
    };
  } else {
    console.log('Neither action is provided');
    options = {
      body: data.body || 'Notification Body',
      icon: filteredPayload.icon || '/static/images/icon.png',
      image: filteredPayload.image
    };
  }

  event.waitUntil(object.run(title, options));
  // event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener('notificationclick', function(event) {

  event.notification.close();
  if (event.action === 'action-button-1') {
    event.waitUntil(
      clients.openWindow(action_url_1)
    );
  } else if (event.action === 'action-button-2') {
    event.waitUntil(
      clients.openWindow(action_url_2)
    );
  } else if(notification_click != undefined || "") {
    event.waitUntil(
      clients.openWindow(notification_click)
    );
  }else{
    console.log('Neither action buttons nor notification click link provided.')
  }
});

