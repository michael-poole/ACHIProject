//MakeJobs

var dataList = document.getElementById('positions');
var input = document.getElementById('title_input');
var description = document.getElementById('description_input');
var type = document.getElementById('type_input');
var sellocation = $('#location option:selected').text();
var all_cert_select = document.getElementById('all_certs');
var rec_cert_select = document.getElementById('rec_certs');
var all_cert_search = document.getElementById('add_cert');
var rec_cert_search = document.getElementById('remove_cert');
var locations = document.getElementById('location');

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
var init = function(){
    $('#PositionForm').submit(save);
     
};
 $(document).ready(init);
$(input).on('keydown', function(e){
    //Positions
db.collection("positions").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        var jsonOptions = jQuery.parseJSON(JSON.stringify(doc.data()));
        
        var inList = false;
        for (var k in jsonOptions) {

            var option = document.createElement('option');
            option.value = jsonOptions['title'];
            console.log(jsonOptions['title']);
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
    
})


function fillForm(val) {
    var elementIndex;
    for (var k in allPositions) {
        if (allPositions[k].title == val) {
            elementIndex = k;
        }
    }
    input.value = val;
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
        rec_cert_select.refresh;

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

//Location
function getLocations(val) {
    var isPresent = false;
    db.collection("locations").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            var jsonOptions = jQuery.parseJSON(JSON.stringify(doc.data()));
            for (var k in jsonOptions) {
                var option = document.createElement('option');
                option.value = jsonOptions['name'];
                option.text = jsonOptions['name'];

                for (var i = 0; i < locations.length; i++) {
                    if (locations.options[i].value == option.value) {
                        isPresent = true;
                    }
                }
                if (!isPresent) {
                    locations.options.add(option);
                }

            }
        });
    });

}
//$("#PostingForm").submit(function(e){
//    return false;
//});
$( "#PostingFormn" ).submit(function( event ) {
  event.preventDefault();
});
$( "#form_save" ).click(function() {
    
     var title = $('#title_input').val();
        var description = $('#description_input').val();
    var certifications = [];
    for(var i = 0; i < rec_cert_select.length; i++){
        certifications.push(rec_cert_select.options[i].value);
    }
    var location = $('#location').find(':selected').text();
    var date = [];
    $('#divdate div .datetimepicker-input').each(function (){
        if($(this).val != " "){
            date.push($(this).val());
        }
        
    })
    for(var i = 0; i < date.length; i++){
        var data={};
        data['title'] = title;
        data['description'] = description;
        data['certifications'] = certifications;
        data['location'] = location;
        data['date'] = date[i];
        data['isPublished'] = false;
         db.collection("jobs").add(data).then(function (result) {
                
             alert("Job Saved Successfully!");
             $( "#PostingForm" ).submit();
        })
        .catch(function (error) {
     alert("failed to save job");
        });
    }
    
    });
$( "#form_save_publish" ).click(function() {
    
     var title = $('#title_input').val();
        var description = $('#description_input').val();
    var certifications = [];
    for(var i = 0; i < rec_cert_select.length; i++){
        certifications.push(rec_cert_select.options[i].value);
    }
    var location = $('#location').find(':selected').text();
    var date = [];
    $('#divdate div .datetimepicker-input').each(function (){
        if($(this).val != " "){
            date.push($(this).val());
        }
        
    })
    for(var i = 0; i < date.length; i++){
        var data={};
        data['title'] = title;
        data['description'] = description;
        data['certifications'] = certifications;
        data['location'] = location;
        data['date'] = date[i];
        data['isPublished'] = true;
         db.collection("jobs").add(data).then(function (result) {
                
             alert("Job Published Successfully!");
             $( "#PostingForm" ).submit();
        })
        .catch(function (error) {
     alert("failed to save job");
        });
    }
    
    });
    



 // add position
    var save = function (e) {
        e.preventDefault();

        var modal = $('#positionModal');
        var id = modal.data('id');
        var data = {};
        //read values from form inputs
        modal.find('input[data-prop]').each(function () {
            var inp = $(this);
            data[inp.data('prop')] = inp.val();
        });
        

        // update or add
        db.collection("positions").add(data).then(function (result) {
            // hide modal and reload list
            modal.modal('hide');
            location.reload();
        })
        .catch(function (error) {
     alert("failed to add positon");
        });
    }
    
