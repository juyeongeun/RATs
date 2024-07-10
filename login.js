const mysql = require("mysql");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const { scales } = require("chart.js");
const path = require('path');
const app = express();
const port = 8080;
// const router = express.Router();
// const csvWriter = require('csv-write-stream');
// const moment = require('moment');

//mysql 정보
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Ju981203@",
    database: "w_info",
    port:"3306"
});

//mysql 연결
connection.connect((err) => {
    if (err) {
        console.error("MySQL 연결 실패: " + err.stack);
        return;    
    }
});

// Body parser 미들웨어 추가
app.use(bodyParser.json());

// 현재 날짜를 기준으로 6개월 전과 1년 전의 날짜를 구합니다.
// const today = moment();
// const last_month = moment().subtract(1, 'month');
// const last_6months = moment().subtract(6, 'months');
// const last_year = moment().subtract(1, 'year');

// 1~6월 데이터를 아카이빙합니다.
// if (today.month() === 6) { // 7월이 되면 1~6월 데이터 아카이빙
//     const first_day_of_jan = moment().startOf('year').format('YYYY-MM-DD');
//     const last_day_of_jun = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
//     const sql_select = `SELECT * FROM packet WHERE DATE(date) >= '${first_day_of_jan}' AND DATE(date) <= '${last_day_of_jun}'`;
//     const sql_delete = `DELETE FROM packet WHERE DATE(date) >= '${first_day_of_jan}' AND DATE(date) <= '${last_day_of_jun}'`;
//     const filename = `packet_archive_${last_month.format('YYYY')}_1_6.csv`;
  
//     connection.query(sql_select, (err, results) => {
//       if (err) throw err;
      
//       const writer = csvWriter();
//       writer.pipe(fs.createWriteStream(path.join(__dirname, filename)));
//       results.forEach(result => {
//         writer.write(result);
//       });
//       writer.end();
  
//       // 아카이빙이 완료되면 해당 데이터를 삭제합니다.
//       connection.query(sql_delete, (err) => {
//         if (err) throw err;
//       });
//     });
// }

// 7~12월 데이터를 아카이빙합니다.
// if (today.month() === 0) { // 1월이 되면 7~12월 데이터 아카이빙
//   const first_day_of_jul = moment().startOf('year').add(6, 'months').format('YYYY-MM-DD');
//   const last_day_of_dec = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
//   const sql = `SELECT * FROM packet WHERE DATE(date) >= '${first_day_of_jul}' AND DATE(date) <= '${last_day_of_dec}'`;
//   const sql_delete = `DELETE FROM packet WHERE DATE(date) >= '${first_day_of_jul}' AND DATE(date) <= '${last_day_of_dec}'`;
//   const filename = `packet_archive_${last_month.format('YYYY')}_7_12.csv`;

//   connection.query(sql, (err, results) => {
//     if (err) throw err;
    
//     const writer = csvWriter();
//     writer.pipe(fs.createWriteStream(path.join(__dirname, filename)));
//     results.forEach(result => {
//       writer.write(result);
//     });
//     writer.end();
//     connection.query(sql_delete, (err) => {
//         if (err) throw err;
//       });
//   });
// }


// 처음 실행하면 로그인창 먼저
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

//이미지 불러오기
app.get("/img/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "img", filename);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('404 Not Found');
            res.end();
        } else {
            const extname = path.extname(filePath);
            const contentType = {
                ".jpg": "image/jpeg",
                ".png": "image/png",
                ".gif": "image/gif"
            }[extname] || "application/octet-stream"; // 파일 타입이 일치하지 않는 경우 기본값 지정
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

app.use(express.static('public'));


app.get('/css/:filename', function (req, res) {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "css", filename);
    fs.readFile(filePath, function (err, data) {
        if (err) {
            res.status(500).send('Error while reading file');
        } else {
            const extname = path.extname(filePath);
            res.type('text/css');
            res.send(data);
        }
    });
});

//회원가입 화면 연결
app.get("/join", (req, res) => {
    res.sendFile(__dirname + "/join.html");
});

// 메인 화면 연결 및 로그인 후 메인 창으로 이동시 가지고 와야하는 데이터
app.get("/home", (req, res) => {

    // employee 데이터베이스에서 근로자 이름과 macaddr을 가져옴
    connection.query('SELECT name, macaddr FROM employee where admin_id= ?', [adminid], (error, results, fields) => {
        if (error) {
            console.error('쿼리 오류: ' + error.stack);
            return;
        }
        // 가져온 근로자 정보를 이용하여 HTML 코드를 생성
        const employeeListItems = results.map((row) => `<li><a href="#" class="list-item" name="employee-li" id="employee-li" style="color:white; text-decoration:none;">${row.name} ${row.macaddr}</a></li>`).join("");
        const employeeListHTML = `<ul id="employee-list"">${employeeListItems}</ul>`;

        // 생성된 HTML 코드를 기존의 home.html 파일에 추가
        fs.readFile('home.html', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
            } else {
                const modifiedData = data.toString().replace("<!-- employee list -->", employeeListHTML);
                // 4. 수정된 HTML 코드를 응답으로 보냅니다.
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(modifiedData);
            }
        });
    });
});

//직원 삭제 기능
app.post('/delete', (req, res) => {
    const { name, mac } = req.body;
    var insertSql = "delete from employee where name=? AND macaddr=?";
    connection.query(insertSql, [name, mac], (error, results, fields) => {
        if (error) {
            console.error('쿼리 오류: ' + error.stack);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
            return;
        }
    });
});

//직원 추가 기능
app.post('/insert', (req, res) => {
    const { name, mac } = req.body;
    var insertSql = "insert into employee value (?,?,?)";
    connection.query(insertSql, [adminid, name, mac], (error, results, fields) => {
        if (error) {
            console.log(adminid);
            console.error('쿼리 오류: ' + error.stack);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
            return;
        }
        // console.log(adminid);
    });
});

let clickdate = "";
let clickmac = "";
//날짜별 근로자별 패킷 출력
app.post('/data', (req, res) => {
    const { name, mac } = req.body;
    clickmac = mac;
    const date = new Date();
    const today = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;


    //packet DB와 employee DB를 조인시켜서 데이터 가져오기
    const sql = 'SELECT packet.date, packet.MAC, packet.status FROM employee INNER JOIN packet ON employee.macaddr = packet.MAC WHERE employee.macaddr = ? AND DATE(STR_TO_DATE(packet.date, \'%Y-%m-%d\')) = ?';
    const csql = 'SELECT packet.date, packet.MAC, packet.status FROM employee INNER JOIN packet ON employee.macaddr = packet.MAC WHERE employee.macaddr = ? AND DATE(date) = ?';
    const timesql = 'select date_format(date, \'%T\') as date from packet where DATE(STR_TO_DATE(date, \'%Y-%m-%d\')) = ? AND MAC = ? ';
    const ctimesql = 'select date_format(date, \'%T\') as date from packet WHERE DATE(date) = ? AND MAC = ? ';

    if (clickdate != "") { //날짜 선택 했을 때
        connection.query(sql, [mac, clickdate], (error, results, fields) => {
            if (error) {
                console.error('쿼리 오류: ' + error.stack);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }
            connection.query(timesql, [clickdate, mac], (error, resultsTime, fields) => {
                if (error) {
                    console.error('쿼리 오류: ' + error.stack);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Server Error');
                    return;
                }

                const time = resultsTime[0].date;
                const timeArr = time.split(':');
                const hour = parseInt(timeArr[0]);
                const minute = parseInt(timeArr[1]);
                const dataIndex = hour * 60 + minute;
                let packetItems = '';
                results.forEach((row, index) => {
                    let borderColor;
                    if (index === 0 && dataIndex > 540) {
                        borderColor = 'red';
                    } else if (index === 0 && dataIndex <= 540) {
                        borderColor = 'blue';
                    } else {
                        borderColor = 'white';
                    }
                    const packetItem = `<div class="packetstyle" style="border: 1px solid ${borderColor};">
                            <div class="row">
                                <label class="date">${row.date}</label>
                                <label class="mac">${row.MAC}</label>
                                <label class="status">${row.status}</label>
                            </div>
                        </div>`;
                    packetItems += packetItem;
                });
                const packetData = `<div id="employee-packet">${packetItems}</div>`;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(packetData);
            });
        });

    } else { //날짜 선택하지 않았을 때(현재 날짜)
        connection.query(csql, [mac, today], (error, results, fields) => {
            if (error) {
                console.error('쿼리 오류: ' + error.stack);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }

            connection.query(ctimesql, [today, mac], (error, resultsTime, fields) => {
                if (error) {
                    console.error('쿼리 오류: ' + error.stack);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Server Error');
                    return;
                }

                const time = resultsTime[0].date;
                const timeArr = time.split(':');
                const hour = parseInt(timeArr[0]);
                const minute = parseInt(timeArr[1]);
                const dataIndex = hour * 60 + minute;

                let packetItems = '';
                results.forEach((row, index) => {
                    let borderColor;
                    if (index === 0 && dataIndex > 540) {
                        borderColor = 'red';
                    } else if (index === 0 && dataIndex <= 540) {
                        borderColor = 'blue';
                    } else {
                        borderColor = 'white';
                    }

                    const packetItem = `<div class="packetstyle" style="border: 1px solid ${borderColor};">
                            <div class="row">
                                <label class="date">${row.date}</label>
                                <label class="mac">${row.MAC}</label>
                                <label class="status">${row.status}</label>
                            </div>
                        </div>`;
                    packetItems += packetItem;
                });

                const packetData = `<div id="employee-packet">${packetItems}</div>`;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(packetData);

            });
        });
    }
});

//날짜 선택
app.post("/selectdate", function (req, res) {
    var selectedDate = req.body.selectedDate;
    clickdate = selectedDate
    // console.log(selectedDate); // 서버에서 선택한 날짜 출력
    res.send("success");
});

//차트 데이터
app.get('/chart-data', (req, res) => {
    var data = new Array(1440).fill(0);
    const date = new Date();
    const today = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    const attendancearr = new Array(1440).fill(0)

    attendancearr[540] = 1;
    attendancearr[1080] = 1;

    var arr = [];
    //사용자 mac 주소와 날짜에 맞는 시간 데이터 db에서 가져오기
    const timesql = 'select date_format(date, \'%T\') as date from packet where DATE(STR_TO_DATE(date, \'%Y-%m-%d\')) = ? AND MAC = ? ';
    const ctimesql = 'select date_format(date, \'%T\') as date from packet where DATE(date) = ? AND MAC = ? ';
    const statussql = 'select status from packet where DATE(STR_TO_DATE(date, \'%Y-%m-%d\')) = ? AND MAC =?';
    const cstatussql = 'SELECT status from packet where DATE(date) = ? AND MAC = ?';

    if (clickdate != "") { //날짜 선택 했을 때
        connection.query(statussql, [clickdate, clickmac], (error, results, fields) => {
            if (error) {
                console.error('쿼리 오류: ' + error.stack);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }
            arr = results;
        });

        connection.query(timesql, [clickdate, clickmac], (error, results, fields) => {
            if (error) {
                console.error('쿼리 오류: ' + error.stack);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }
            var connectIndex = null;
            var disconnectIndex = null;

            for (var i = 0; i < results.length; i++) {
                var status = arr[i].status; // 수정된 부분
                var timeArr = results[i].date.split(':');
                var hour = parseInt(timeArr[0]);
                var minute = parseInt(timeArr[1]);
                var dataIndex = hour * 60 + minute;

                if (status === 'connected') {
                    connectIndex = dataIndex;
                } else {
                    disconnectIndex = dataIndex;

                    if (connectIndex !== null && disconnectIndex !== null) {
                        while (connectIndex <= disconnectIndex) {
                            data[connectIndex] = 1;
                            connectIndex++;
                        }
                    }
                }
            }

            const labels = Array.from({ length: 1440 }, (_, i) => {
                const hour = Math.floor(i / 60);
                const minute = i % 60;
                return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            });

            // 데이터 처리 로직
            if (results != null) {
                const chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Time Check',
                            data: attendancearr,
                            fill: true,
                            borderColor: '#cbcde7',
                        },
                        {
                            label: 'Working',
                            data: data,
                            fill: true,
                            backgroundColor: '#ffeba7',
                            borderColor: '#fff787',
                            borderWidth: 1,
                            responsive: false,
                            maintainAspectRatio: false,
                        }

                    ],
                };

                // 클라이언트에게 JSON 형태로 응답
                res.json(chartData);
            }
        });
    }
    else { //날짜 선택하지 않았을 때(현재 날짜)
        //packet의 status
        connection.query(cstatussql, [today, clickmac], (error, results, fields) => {
            if (error) {
                console.error('쿼리 오류: ' + error.stack);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }
            arr = results;
        });

        connection.query(ctimesql, [today, clickmac], (error, results, fields) => {
            if (error) {
                console.error('쿼리 오류: ' + error.stack);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }
            var connectIndex = null;
            var disconnectIndex = null;

            for (var i = 0; i < results.length; i++) {
                var status = arr[i].status; // 수정된 부분
                var timeArr = results[i].date.split(':');
                var hour = parseInt(timeArr[0]);
                var minute = parseInt(timeArr[1]);
                var dataIndex = hour * 60 + minute;

                if (status === 'connected') {
                    connectIndex = dataIndex;
                } else {
                    disconnectIndex = dataIndex;

                    if (connectIndex !== null && disconnectIndex !== null) {
                        while (connectIndex <= disconnectIndex) {
                            data[connectIndex] = 1;
                            connectIndex++;
                        }
                    }
                }
            }
            const labels = Array.from({ length: 1440 }, (_, i) => {
                const hour = Math.floor(i / 60);
                const minute = i % 60;
                return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            });

            // 데이터 처리 로직
            if (results != null) {
                const chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Time Check',
                            data: attendancearr,
                            fill: true,
                            borderColor: '#cbcde7',
                        },
                        {
                            label: 'Working',
                            data: data,
                            fill: true,
                            backgroundColor: '#ffeba7',
                            borderColor: '#fff787',
                            borderWidth: 1,
                            responsive: false,
                            maintainAspectRatio: false,
                        }
                    ]
                };
                // 클라이언트에게 JSON 형태로 응답
                res.json(chartData);
            }
        });
    }
});

//월별 차트 데이터
app.get('/chart-mdata', (req, res) => {
    var data = new Array(1440).fill(0);
    var i = 0, k = 0;
    var arr = [];
    const attendancearr = new Array(1440).fill(0);

    const timesql = 'select date_format(date, \'%T\') as date from packet where MAC = ? ';
    const statussql = 'SELECT status from packet where MAC = ?';

    connection.query(statussql, [clickmac], (error, results, fields) => {
        if (error) {
            console.error('쿼리 오류: ' + error.stack);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
            return;
        }
        arr = results;

        connection.query(timesql, [clickmac], (error, results, fields) => {
            if (error) {
                console.error('쿼리 오류: ' + error.stack);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }
            var connectTime = null;
            var disconnectTime = null;

            for (i = 0; i < results.length; i++) {
                var status = arr[i].status;
                var timeArr = results[i].date.split(':');
                var hour = parseInt(timeArr[0]);
                var minute = parseInt(timeArr[1]);
                var dataIndex = hour * 60 + minute;

                if (status === 'connected') {
                    connectTime = dataIndex;
                } else {
                    disconnectTime = dataIndex;

                    if (connectTime !== null && disconnectTime !== null) {
                        data[connectTime] += 1;
                        if (disconnectTime !== connectTime) {
                            data[disconnectTime] += 1;
                            for (var j = connectTime + 1; j < disconnectTime; j++) {
                                data[j] += 1;
                            }
                        }
                    }
                }
            }
            const maxYValue = Math.max(...data);
            // console.log(maxYValue);

            attendancearr[540] = maxYValue;
            attendancearr[1080] = maxYValue;

            const labels = Array.from({ length: 1440 }, (_, i) => {
                const hour = Math.floor(i / 60);
                const minute = i % 60;
                return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            });

            if (results != null) {
                const chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Time Check',
                            data: attendancearr,
                            fill: true,
                            borderColor: '#cbcde7',
                        },
                        {
                            label: 'Month Working',
                            data: data,
                            fill: true,
                            backgroundColor: '#ffeba7',
                            borderColor: '#fff787',
                            borderWidth: 1,
                            responsive: false,
                            maintainAspectRatio: false,
                        }
                    ]
                };

                res.json(chartData);
            }
        });
    });
});

//검색창에 근로자 검색 시 리스트 상단에 올리고 클릭하면 날짜 별로 패킷 출력
// app.post('/search', (req, res) => {
//     const { name } = req.body;
//     //packet DB와 employee DB를 조인시켜서 데이터 가져오기
//     const sql = 'SELECT packet.date, packet.MAC, packet.status FROM employee INNER JOIN packet ON employee.macaddr = packet.MAC WHERE employee.macaddr = ? AND DATE(STR_TO_DATE(packet.date, \'%Y-%m-%d\')) = CURDATE()';

//     connection.query(sql, [name], (error, results, fields) => {
//         if (error) {
//             console.error('쿼리 오류: ' + error.stack);
//             res.writeHead(500, { 'Content-Type': 'text/plain' });
//             res.end('Server Error');
//             return;
//         }
//         //가져온 데이터를 클라이언트 측으로 형식에 맞게 보내기
//         const packetItems = results.map((row) => `<div>${row.date} ${row.MAC} ${row.status}</div>`).join('');
//         const packetData = `<div id="employee-packet">${packetItems}</div>`;
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(packetData);
//     });
// });

let adminid = ""; //관리자 아이디 받아오기

//로그인 기능
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    adminid = username;
    var loginSql = "SELECT * FROM admin WHERE id=? AND pw=?";
    connection.query(loginSql, [username, password], (error, results, fields) => {
        if (results.length === 0 || error) {
            res.status(401).send("아이디 또는 비밀번호를 확인해주세요");
        } else {
            res.redirect("/home");
        }
    });
});

//로그인 창에서 회원가입 버튼 누르면 회원가입 창으로 전환
app.post("/login-join", (req, res) => {
    res.redirect("/join");
});

//회원가입 기능
app.post('/insertjoin', (req, res) => {
    const { username, password, repassword } = req.body;

    //id 중복 확인
    const checkSql = "SELECT COUNT(*) AS count FROM admin where id=?";
    connection.query(checkSql, [username], function (error, results, fields) {
        if (error) throw error;

        //admin에 아이디가 이미 있으면
        if (results[0].count > 0) {
            res.status(401).send("이미 사용 중인 아이디입니다.");
        }
        //id, pw, rpw 공백시
        else if (username == "" || password == "" || repassword == "") {
            res.status(401).send("아이디 또는 비밀번호를 입력해주세요.");
        }
        // id 중복x, pw==rpww 회원가입 성공 후 로그인 창으로 이동
        else if (password === repassword) {
            var loginSql = "INSERT INTO admin (id, pw) VALUES (?, ?)";
            connection.query(loginSql, [username, password], (error, results, fields) => {
                res.redirect("/");
            });
        }
        // pw != rpw
        else {
            res.status(401).send("비밀번호가 일치하지 않습니다.");
        }
    });
});

app.use((req, res) => {
    res.status(404).send("Not Found");
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});