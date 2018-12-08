//MakeJobs

var dataList = document.getElementById('positions');
var input = document.getElementById('title_input');
var description = document.getElementById('description_input');
var type = document.getElementById('type_input');
var all_cert_select = document.getElementById('all_certs');
var rec_cert_select = document.getElementById('rec_certs');
var all_cert_search = document.getElementById('add_cert');
var rec_cert_search = document.getElementById('remove_cert');
var searchList = document.getElementById('certifications');

//Global variables
var allPositions = [];
var allCertifications = [];

//DB initialization
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



//Positions
db.collection("positions").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        //        console.log(`${doc.id} => ${doc.data()}`);
        var jsonOptions = jQuery.parseJSON(JSON.stringify(doc.data()));

        var inList = false;
        for (var k in jsonOptions) {

            var option = document.createElement('option');
            option.value = jsonOptions['title'];
            for (var j in dataList.options) {
                if (dataList.options[j].value == jsonOptions['title']) {
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
                type: jsonOptions['jobType'],
                certs: jsonOptions['certification']
            };

            for (var k in allPositions) {
                if (allPositions[k].title == position.title) {
                    isPosition = true
                }
            }
            if (!isPosition) {
                allPositions.push(position);
            }

        }
    });

    // Update the placeholder text.
    input.placeholder = "Start typing the position title ..";


});



//Certifications DataList

//all_cert_search.oninput = function (val) {
//    searchList.empty;
//    var inSearchList = false;
//
//    for (var k in allCertifications) {
//        var option = document.createElement('option');
//        option.value = allCertifications[k];
//
//        for (var j in searchList.options) {
//            if (searchList.options[j].value == allCertifications[j]) {
//                inSearchList = true;
//            }
//        }
//        if (!inSearchList) {
//            searchList.empty;
//            searchList.appendChild(option);
//             console.log(searchList.options[k].value);
//            
//        }
//       
//
//}}


function fillForm(val) {
    var elementIndex;
    for (var k in allPositions) {
        if (allPositions[k].title == val) {
            elementIndex = k;
        }
    }
    description.value = allPositions[elementIndex].desc;
    type.value = allPositions[elementIndex].type;
    //console.log(allPositions[elementIndex].certs);


    //Certifications

    db.collection("qualifications").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            var jsonOptions = jQuery.parseJSON(JSON.stringify(doc.data()));
            for (var k in jsonOptions) {
                allCertifications.push(jsonOptions['qualName']);
                var option = document.createElement('option');
                option.value = jsonOptions['qualName'];
                option.text = jsonOptions['qualName'];
                all_cert_select.options.add(option);
            }
        });
    });

    for (var i in allPositions[elementIndex].certs) {
        var option = document.createElement('option');
        option.text = allPositions[elementIndex].certs[i];
        rec_cert_select.options.add(option);

    }


}

function addToRec(val) {
    var isPresent = false;
    var valIndex = val.selectedIndex;
    var option = document.createElement('option');
    option.text = val.value;
    option.value = val.value;
    for (var i = 0; i < rec_cert_select.length; i++) {
        if (rec_cert_select.options[i].value == option.value) {
            isPresent = true;
        }
    }
    if (!isPresent) {
        rec_cert_select.options.add(option);

    }
    all_cert_select.options.remove(valIndex);

}

function removeFromRec(val) {
    var isPresent = false;
    var valIndex = val.selectedIndex;
    var option = document.createElement('option');
    option.text = val.value;
    option.value = val.value;
    for (var i = 0; i < all_cert_select.length; i++) {
        if (all_cert_select.options[i].value == option.value) {
            isPresent = true;
        }
    }
    rec_cert_select.options.remove(valIndex);
    if (!isPresent) {
        all_cert_select.options.add(option);
        all_cert_select.refresh;
    }
}
//Search for certifications

function searchCerts(val) {
    console.log('in here');
    console.log(searchList);

}
//DatePicker
