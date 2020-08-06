const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().functions);


exports.hellWord = functions.database.ref('products/{id}').onCreate((snapshot, context) => {

    var item = snapshot.val();
    var body = "Sản phẩm " + item['nameProduct'] + " đang chờ kiểm duyệt";
    const payload = {
        notification: {
            title: 'Message from happj app',
            body: body,
            badge: '1',
            sound: 'default'
        }
    };



    return admin.database().ref('fcm-token').once('value').then(allToken => {
        if (allToken.val()) {
            console.log("alltoken:  " + allToken.val());
            console.log('token avaliable');
            const token = Object.keys(allToken.val());
            return admin.messaging().sendToDevice(item['fcmtoken'], payload);
        } else {
            console.log('no token avaliable');
        }
        return null;
    });
});
exports.notifiAdmin = functions.database.ref('products/{id}').onCreate((snapshot, context) => {

    var bodyAdmin = "Có sản phẩm chờ kiểm duyệt!";
    var payloadAdmin = {
        notification: {
            title: 'Message from Happj Admin App',
            body: bodyAdmin,
            badge: '1',
            sound: 'default'
        }
    };
    return admin.database().ref('admin/fcm').once('value').then(val => {
        if (val.val()) {
            const tokena = Object.keys(val.val());
            return admin.messaging().sendToDevice(tokena, payloadAdmin);
        } else {
            console.log('no token avaliable');
        }
        return null;
    });
});





exports.notifiAll = functions.database.ref('products/{id}').onUpdate((change, context) => {
    console.log("begin inspector");

    var after = change.after.val();
    var before = change.before.val();
    var body;
    if (before['inspector']) {
        return null;
    }
    if (after['inspector']) {
        body = "Có sản phẩm mới";
    } else {
        return null;
    }
    const payload = {
        notification: {
            title: 'Message from happj app',
            body: body,
            badge: '1',
            sound: 'default'
        }
    };

    return admin.database().ref('fcm-token').once('value').then(allToken => {
        if (allToken.val()) {
            console.log('token avaliable');
            const token = Object.keys(allToken.val());
            console.log("token: " + token);
            return admin.messaging().sendToDevice(token, payload);
        } else {
            console.log('no token avaliable');
        }
        return null;
    });
});

exports.inspectorSucess = functions.database.ref('products/{id}').onUpdate((change, context) => {
    console.log("begin inspector");

    var after = change.after.val();
    var before = change.before.val();
    var body;
    if (before['inspector']) {
        return null;
    }
    if (after['inspector']) {
        body = "Sản phẩm " + after['nameProduct'] + " đã được kiểm duyệt";
    } else {
        return null;
    }
    const payload = {
        notification: {
            title: 'Message from happj app',
            body: body,
            badge: '1',
            sound: 'default'
        }
    };

    return admin.database().ref('fcm-token').once('value').then(allToken => {
        if (allToken.val()) {
            console.log('token avaliable');
            const token = Object.keys(allToken.val());
            console.log("token: " + token);
            return admin.messaging().sendToDevice(after['fcmtoken'], payload);
        } else {
            console.log('no token avaliable');
        }
        return null;
    });
});

exports.thongBaoDauGia = functions.database.ref('products/{id}').onUpdate((change, context) => {
    console.log("begin inspector");

    var after = change.after.val();
    var before = change.before.val();
    var body;
    var listBefore = [];
    var listAfter = [];
    listBefore.push.apply(listBefore, before['fcms']);
    listAfter.push.apply(listAfter, after['fcms']);
    console.log("before : " + listBefore.length + " after : " + listAfter.length);
    console.log("before : " + listBefore[listBefore.length - 1] + " after : " + listAfter[listAfter.length - 1]);
    if (listBefore[listBefore.length - 1] !== listAfter[listAfter.length - 1]) {
        console.log("xuly");
        body = "Bạn đang đứng đầu phiên đấu giá, sản phẩm: " + after['nameProduct'];
        const payload = {
            notification: {
                title: 'Message from happj app',
                body: body,
                badge: '1',
                sound: 'default'
            }
        };

        const payload1 = {
            notification: {
                title: 'Message from happj app',
                body: "Sản phẩm: " + after['nameProduct'] + " mà bạn đang đấu giá hiện đang thua",
                badge: '1',
                sound: 'default'
            }
        };
        for (var i = 1; i < listAfter.length - 1; i++) {
            admin.messaging().sendToDevice(listAfter[i], payload1);
        }
        return admin.messaging().sendToDevice(listAfter[listAfter.length - 1], payload);

    } else {
        console.log(" = nhau");
    }

    return null;



});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
