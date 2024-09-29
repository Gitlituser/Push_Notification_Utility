function TimeSDK() {
    var Times = $("#checkedvalue2").val();
    var enteredTimes = Times;

    var currentTimes = new Date();
    var userTimes = new Date();
    var hourss = enteredTimes.split(":")[0];
    var minutess= enteredTimes.split(":")[1];

    userTimes.setHours(hourss);
    userTimes.setMinutes(minutess);

    if (userTimes < currentTimes) {
        alert("Please enter a future time.");
        // Optionally, you can clear the input field when the time is invalid
        $("#checkedvalue2").val("");
    } else {
        // Time is valid, you can perform further actions
        return enteredTimes;
    }
}

// function TimeSDK() {
//     Time = $("#checkedvalue").val();
// return Time
// }

function showImagePreviewSDK() { // For SDK
let myFiles = $('input[id=ImageSDK]').val();
var outputs = document.getElementById('output2');
document.getElementById('output2').style.display = "inline-block";
outputs.src = myFiles;
return myFiles
}

function showIconPreviewSDK() { // For SDK
    let myFile_icons = $('input[id=IconSDK]').val();
    var output_icons = document.getElementById('output21');
    document.getElementById('output21').style.display = "inline-block";
    output_icons.src = myFile_icons;
    return ("Icon Uploaded.")
}

$(function () {
	// Fetching form input fields data.
	$("#web-sdk").submit(function (event) {
		event.preventDefault();
		var data = new FormData(event.target);
		// let value_time = TimeAPI();
		var arr = [...data.entries()];
		// arr.push(['title', "Hi"])
		// arr.push(['body', "There"])
		arr.push(['token', localStorage.getItem('token')])

		// If time array found in data, assigning it time value.
		function checkAndModifyValue(array, searchValue, newValue) {
			for (let i = 0; i < array.length; i++) {
				// Check if the search value exists in the current array
				if (array[i].includes(searchValue)) {
				// Get the index of the search value within the current array
				const index = array[i].indexOf(searchValue);
	
				// Modify the adjacent value based on the index
				if (index >= 0 && index < array[i].length - 1) {
					array[i][index + 1] = newValue;
				}
				break;
				}
			}
			}
	
			checkAndModifyValue(arr, 'time', TimeSDK());
	
		const obj = Object.fromEntries(arr);
		console.log(arr)
	
		$.ajax({
			type: 'POST',
			url: $("#web-sdk").attr("action"),
			contentType: 'application/json',
			processData: false,
			data: JSON.stringify(obj),
			success: function (response) {
				console.log("received response ", response);
			},
			error: function(xhr, status, error) {
				console.log("Error message: ", error);
			}
		}
		);
	});
	});


	$(function () {
		// Fetching form input fields data.
		$("#firebase-sdk").submit(function (event) {
			event.preventDefault();
			var data = new FormData(event.target);
			// let value_time = TimeAPI();
			var arr = [...data.entries()];
			// arr.push(['title', "Hi"])
			// arr.push(['body', "There"])
			// arr.push(['token', localStorage.getItem('token')])

			// If time array found in data, assigning it time value.
			function checkAndModifyValue(array, searchValue, newValue) {
				for (let i = 0; i < array.length; i++) {
					// Check if the search value exists in the current array
					if (array[i].includes(searchValue)) {
					// Get the index of the search value within the current array
					const index = array[i].indexOf(searchValue);
		
					// Modify the adjacent value based on the index
					if (index >= 0 && index < array[i].length - 1) {
						array[i][index + 1] = newValue;
					}
					break;
					}
				}
				}
	
			checkAndModifyValue(arr, 'time', TimeAPI());
		
			const obj = Object.fromEntries(arr);
			console.log(arr)
		
			$.ajax({
				type: 'POST',
				url: $("#firebase-sdk").attr("action"),
				contentType: 'application/json',
				processData: false,
				data: JSON.stringify(obj),
				success: function (response) {
					console.log("received response ", response);
				},
				error: function(xhr, status, error) {
					console.log("Error message: ", error);
				}
			}
			);
		});
		});
			
	const sdkModule = (function() {

	function handleAddFields() {

	// Below JS for Notification Click Action URL and Title Fields for SDK.
	const MAXM_SETS = 2;

	// Define array to hold set indices
	let setIndicess = [];

	// Get the add fields button
	const addFieldBtn = document.getElementById("add-fields-sdk");

	// Get the input fields div
	const inputFieldDiv = document.getElementById("input-fields-sdk");

	// Add event listener to the add fields button
	addFieldBtn.addEventListener("click", (e) => {
	e.preventDefault();
	// Check if maximum number of sets has been reached
	if (setIndicess.length >= MAXM_SETS) {
		alert("Maximum two buttons can be added.");
		return;
	}

	// Get the next set index
	const setIndex = setIndicess.length;

	// Add the set index to the array
	setIndicess.push(setIndex);

	// Create a div for the new set of input fields
	const setDiv = document.createElement("div");
	setDiv.classList.add("input-set");

	// Create the first input field and label
	const input1 = document.createElement("input");
	input1.type = "text";
	input1.id = `set_${setIndex}_input1`;
	input1.name = `set_${setIndex}_input1`;
	const label1 = document.createElement("label");
	label1.htmlFor = input1.id;
	label1.innerText = `Button Title ${setIndex + 1}:`;

	// Create the second input field and label
	const input2 = document.createElement("input");
	input2.type = "text";
	input2.id = `set_${setIndex}_input2`;
	input2.name = `set_${setIndex}_input2`;
	const label2 = document.createElement("label");
	label2.htmlFor = input2.id;
	label2.innerText = `Button Action ${setIndex + 1}:`;

	// Apply CSS to display the input fields and delete button inline
	input1.style.display = "inline-block";
	input2.style.display = "inline-block";


	// Create the delete button
	const deleteBtn = document.createElement("button");
	deleteBtn.id = "deletebtn"
	deleteBtn.type = "button";
	deleteBtn.innerText = "Delete";
	deleteBtn.addEventListener("click", () => {
		// Remove the set index from the array
		const index = setIndicess.indexOf(setIndex);
		setIndicess.splice(index, 1);

		// Remove the set div from the input fields div
		inputFieldDiv.removeChild(setDiv);
		setDiv.style.display = "none";
	});

	deleteBtn.style.display = "inline-block";

	// Create a line break element to break the inputs
	const lineBreak = document.createElement("br");

	// Append the input fields, label, and line break element to the set div
	setDiv.appendChild(label1);
	setDiv.appendChild(input1);
	setDiv.appendChild(document.createTextNode(' '));
	setDiv.appendChild(label2);
	setDiv.appendChild(input2);
	setDiv.appendChild(deleteBtn);

	// Append the set div to the input fields div
	inputFieldDiv.appendChild(setDiv);

	// Append a line break element to create space between each set of input fields
	inputFieldDiv.appendChild(lineBreak);
	});

	document.addEventListener('DOMContentLoaded', function() {
		var templates = document.querySelectorAll('.template');
		var buttons = document.querySelectorAll('.slider-buttons button');
		
		// Click event for buttons
		buttons.forEach(function(button, buttonIndex) {
			button.addEventListener('click', function() {
				// Remove the active class from all buttons and content
				buttons.forEach(function(button) {
					button.classList.remove('active');
				});
				templates.forEach(function(template) {
					template.classList.remove('active');
				});
				
				// Add the active class to the clicked button and content
				this.classList.add('active');
				templates[buttonIndex].classList.add('active');
			});
		});
	});

	var firebaseConfig = {
		apiKey: "AIzaSyCaKz9MVEogoKbh6CNWao2af5QawDKTHbc",
		authDomain: "fir-webpush-3ebb1.firebaseapp.com",
		projectId: "fir-webpush-3ebb1",
		storageBucket: "fir-webpush-3ebb1.appspot.com",
		messagingSenderId: "383152613780",
		appId: "1:383152613780:web:ee3783c37f6f5f60ef8781",
		measurementId: "G-6XHT25XWMD"  
	};

	if (firebase.apps.length === 0) {
	// Initialize your Firebase app here
		console.log("Initializing Firebase.")
		firebase.initializeApp(firebaseConfig);
	}
	else{
		console.log("Firebase Already Initialized!")
	}

	// Initialize firebase and generate token.
	const messagings = firebase.messaging();
	messagings.requestPermission()
		.then(function () {
			console.log('Notification permission granted.');
			return messagings.getToken();
		})
		.then(function (token) {
		
		if (token) {
			console.log("FCM Token Generated Successfully")
			const now = new Date();
			const hours = now.getHours();
			const minutes = now.getMinutes();
			const seconds = now.getSeconds();

			curr_time = `${hours}:${minutes}:${seconds}`
			localStorage.removeItem('token')
			localStorage.setItem('token', token)
			localStorage.setItem('updatedAt', curr_time)
		}
		else{
			console.log("Error generating FCM token.", err)
		}			
		})
		.catch(function (err) {
			console.log('Unable to get permission to notify.', err);
		});

	let enableForegroundNotifications = true;
	messagings.onMessage(function (payload) {
		console.log('Message received. ', payload);
		if (enableForegroundNotifications) {
			let notification = payload.notification;
			navigator.serviceWorker
				.getRegistrations()
				.then((registration) => {
					registration[0].showNotification(notification.title, notification.body);
				});
		}
	}
	);

}
return {
	handleAddFields: handleAddFields
};

})();