//MakeJobs
// Get the <datalist> and <input> elements.
var dataList = document.getElementById('positions');
var input = document.getElementById('title_input');
var description = document.getElementById('description_input');
var type = document.getElementById('type_input');
var config = {
    apiKey: "AIzaSyAC8o-CsLGlB2PRqLqCijw8DbyF9E51iy8",
    authDomain: "flexiblescheduler-fdf1e.firebaseapp.com",
    databaseURL: "https://flexiblescheduler-fdf1e.firebaseio.com",
    projectId: "flexiblescheduler-fdf1e",
    storageBucket: "flexiblescheduler-fdf1e.appspot.com",
    messagingSenderId: "236803659888"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});
//var positions = "";
//var descInfo = [];
//var typeInfo = [];
//var certs = [];


var allPositions = [];
db.collection("positions").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        //        console.log(`${doc.id} => ${doc.data()}`);
        positions = doc.data();
        //console.log(positions);
        var jsonOptions = jQuery.parseJSON(JSON.stringify(doc.data()));

        var inList = false;
        for (var k in jsonOptions) {

            var option = document.createElement('option');
            option.value = jsonOptions['title'];
            for (var k in dataList.options) {
                if (dataList.options[k].value == jsonOptions['title']) {
                    inList = true;
                }
            }
            if (!inList) {
                dataList.empty;
                dataList.appendChild(option);
            }
            var isPosition = false;
            var position = {
                title: jsonOptions['title'],
                desc: jsonOptions['description'],
                type: jsonOptions['jobType']
            };

            for (var k in allPositions) {
                if (allPositions[k].title == position.title) {
                    isPosition = true
                }
            }
            if (!isPosition) {
                allPositions.push(position);
            }
            //console.log(jsonOptions);

        }
    });

    // Update the placeholder text.
    input.placeholder = "Start typing the position title ..";


});

function fillForm(val) {

    var elementIndex;
    for(var k in allPositions){
        if (allPositions[k].title == val){
            elementIndex = k;
        }
    }
    description.value = allPositions[elementIndex].desc;
    type.value = allPositions[elementIndex].type;
}
