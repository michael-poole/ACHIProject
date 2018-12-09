(function ($) {
    // firestore ref
    var db;

    // auth and setup event handlers
    var init = function () {
        auth();

        $('#AllJobs').on('click', 'button.edit', edit);
        $('#AllJobs').on('click', 'button.remove', remove);
        $('#JobsAdd').click(add);
        $('#JobsForm').submit(save);
    };

    // init on doc ready
    $(document).ready(init);

    // sign-in anonymously
    var auth = function () {
        firebase.auth().signInAnonymously()
        .then(function (result) {
			db = firebase.firestore();
			db.settings({ timestampsInSnapshots: true });
			list();
        })
        .catch(function (error) {
     alert("failed to anonymously sign-in");
        });
    };


    var listTempTr;
    // load list
    var list = function () {
        var tblBody = $('#AllJobs > tbody');
        //remove any data rows
        tblBody.find('tr.data').remove();
        //get template row
        var tempTr = tblBody.find('tr.jobsTable').removeClass('jobsTable').addClass('data').remove();
        if (tempTr.length) {
            listTempTr = tempTr;
        } else {
            tempTr = listTempTr;
        }

        // get collection of jobs
        db.collection("jobs").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // clone template row and append to table body
                var tr = tempTr.clone();
                tr.data('id', doc.id);
                var data = doc.data();
                // set cell values from jobs data
                tr.find('td[data-prop]').each(function () {
                    var td = $(this);
                    td.text(data[td.data('prop')] || '');
                });
                tblBody.append(tr);
            });
        });
    };

    // on remove
    var remove = function (e) {
        e.preventDefault();
        var id = $(this).parents('tr:first').data('id');
        db.collection("jobs").doc(id).delete().then(function () {
            // reload list
            list();
        })
        .catch(function (error) {
     alert("failed to remove job");
        });
    };

    // on add
    var add = function (e) {
        e.preventDefault();
        open('');
    };

    // on edit
    var edit = function (e) {
        e.preventDefault();
        var id = $(this).parents('tr:first').data('id');
        open(id);
    };

    // open form modal
    var open = function (id) {
        var modal = $('#JobsModal');
        // set current Job id
        modal.data('id', id);
        // reset all inputs
        modal.find('textarea').val('');
        modal.modal('show');

        if (!id) return;

        // get job to edit
        db.collection("jobs").doc(id).get().then(function (doc) {
            if (doc.exists) {
                var data = doc.data();
                //set form inputs from jobs data
                modal.find('textarea[data-prop]').each(function () {
                    var inp = $(this);
                    inp.val(data[inp.data('prop')] || '');
                });

            } else {
                alert("No such record");
            }
        }).catch(function (error) {
            alert("failed to read job");
        });
    };


    // update or add
    var save = function (e) {
        e.preventDefault();

        var modal = $('#JobsModal');
        var id = modal.data('id');
        var data = {};
        //read values from form inputs
        modal.find('textarea[data-prop]').each(function () {
            var inp = $(this);
            data[inp.data('prop')] = inp.val();
        });

        // update or add
        (id ? db.collection("jobs").doc(id).update(data) : db.collection("jobs").add(data)).then(function (result) {
            // hide modal and reload list
            modal.modal('hide');
            list();
        })
        .catch(function (error) {
     alert("failed to save job");
        });
    };

}(jQuery)); 