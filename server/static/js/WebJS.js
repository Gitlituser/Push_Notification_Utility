function goback(){
    window.open("webapp");
}

function PreviewImage() {
        let myFile = $('input[id=img]').val();
        var output = document.getElementById('output');
        document.getElementById('output').style.display = "inline-block";
        output.src = myFile;
        return myFile
    }

    function TimeFXN() {
        Time = $("#checkedvalue").val();
    return Time
}

    $(function () {
        $("#trigger-push-form").submit(function (event) {
            event.preventDefault();
            var data = new FormData(event.target);
            var arr = [...data.entries()];

            arr.push(['title', "Hi"])
            arr.push(['body', "There"])

            const obj = Object.fromEntries(arr);
            console.log(arr)
            // console.log(obj);

            $.ajax({
                type: 'POST',
                url: $("#trigger-push-form").attr("action"),
                contentType: 'application/json',
                processData: false,
                data: JSON.stringify(obj),
                success: function (response) {
                    console.log("received response ", response);
                },
            }
            );
        });
    });


// Below JS for Notification Click Action URL and Title Fields.
const MAXM_SETS = 2;

// Define array to hold set indices
let setIndicess = [];

// Get the add fields button
const addFieldBtn = document.getElementById("add-fields");

// Get the input fields div
const inputFieldDiv = document.getElementById("input-fields");

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





