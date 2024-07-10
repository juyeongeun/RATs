app.post('/search', (req, res) => {
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