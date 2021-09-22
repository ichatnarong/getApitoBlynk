// <--------------------------- Start Setting -------------------------->

let BlynkLib = require('blynk-library');
let axiosLib = require('axios');
let cron = require('node-cron');

let app = require('express')();
let port = process.env.PORT || 7777

let MONGO_DB_NAME_SINGHA = ["IoT.Input.SinghaS1.17",
    "IoT.Input.SinghaS2.17",
    "IoT.Input.SinghaS3.17",
    "IoT.Input.SinghaS4.17",
    "IoT.Input.SinghaS5.17",
    "IoT.Input.SinghaS6.17",
    "IoT.Input.SinghaS7.17",
    "IoT.Input.SinghaS8.17",
    "IoT.Input.SinghaS9.17",
    "IoT.Input.SinghaS10.17",
    "IoT.Input.SinghaS11.17",
    "IoT.Input.SinghaS12.17",
    "IoT.Input.SinghaS13.17",
    "IoT.Input.SinghaS14.17",
    "IoT.Input.SinghaS15.17",
    "IoT.Input.SinghaS16.17",
    "IoT.Input.SinghaS17.17",
    "IoT.Input.SinghaS18.17",
    "IoT.Input.SinghaS19.17",
    "IoT.Input.SinghaS20.17"
];
let MONGO_DB_NAME_SINGHAWS = ["IoT.Input.SingHaWS1.17",
    "IoT.Input.SingHaWS2.17",
    "IoT.Input.SingHaWS3.17",
    "IoT.Input.SingHaWS4.17",
    "IoT.Input.SingHaWS5.17"
];
let KEY_SINGHAWS = ["_id",
    "Temp",
    "Humid",
    "DewP",
    "VPDa",
    "VPDl",
    "ETo",
    "Rain",
    "Wind",
    "Dir",
    "All",
    "Vis",
    "IR"
];

//Test Serve Teacher
let AUTH_Blynk = '----------------------';
let var_singha = [];
let var_singhaws = [];
let header = {
    'Content-Type': 'application/json',
    'Authorization': '----------------------------------------'
};
let countTestRealtime = 0;
let countV_singhaWS = 0;

//connect to Blynk
let blynk = new BlynkLib.Blynk(AUTH_Blynk, options = {
    connector: new BlynkLib.TcpClient(options = { addr: "---.---.--.---", port: 8080 })
});

const timer = ms => new Promise(res => setTimeout(res, ms))

// <--------------------------- Stop Setting -------------------------->

let getDataAPI = async function(table_name, type) {
    let data = await axiosLib.post('http://---------/----/----------/------------', table_name, { headers: this.header });
    console.log("GET API TableName = " + table_name['tableDW_name'])
    if (type == "SINGHA") {
        return data.data[0]['Soil1'];
    } else if (type == "SINGHAWS") {
        return data.data[0];
    }
}

let fetchblynk_singha = async function() {
    await timer(3000);
    for (let index = 0; index < MONGO_DB_NAME_SINGHA.length; index++) {
        let data = await getDataAPI({ "tableDW_name": MONGO_DB_NAME_SINGHA[index] }, "SINGHA");
        if (var_singha.length != 20)
            var_singha[index] = new blynk.VirtualPin(100 + index); //Sendup data to Blynk [ตาม VirtualPin]
        var_singha[index].write(data);
        await timer(5);
    }
    console.log("countTestRealtime " + (1 + countTestRealtime++) + " Datetime = " + new Date())
}

let fetchblynk_singhaws = async function() {
    await timer(3000);
    for (let index1 = 0; index1 < MONGO_DB_NAME_SINGHAWS.length - 4; index1++) {
        let data = await getDataAPI({ "tableDW_name": MONGO_DB_NAME_SINGHAWS[index1] }, "SINGHAWS");
        for (let index2 = 0; index2 < KEY_SINGHAWS.length; index2++) {
            if (var_singhaws.length != 13)
                var_singhaws[countV_singhaWS] = new blynk.VirtualPin(120 + countV_singhaWS); //Sendup data to Blynk [ตาม VirtualPin]
            var_singhaws[countV_singhaWS++].write(data[KEY_SINGHAWS[index2]]);
        }
        await timer(5);
    }
    countV_singhaWS = 0;
}

// After connect Blynk Success
blynk.on('connect', function() {
    console.log("Blynk connect start.");
    cron.schedule('0 15 * * *', function() {
        fetchblynk_singha();
        fetchblynk_singhaws();
    });
});


app.get('/', function(req, res) {

    res.send('<h1>Hello Node.js</h1>')
})
app.listen(port, function() {
    console.log('Starting node.js on port ' + port)
})