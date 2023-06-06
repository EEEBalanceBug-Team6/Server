const hiddenkey = {
    host : " 35.179.94.98", // Public IPV4 address of EC2 instance
    user : "arnavxkohli",
    password : "Whytodothis_2003",
    database : "Y2DB"
};

module.exports = hiddenkey;

// [
//     RowDataPacket {
//       PersonID: 1,
//       LastName: 'Woo',
//       FirstName: 'John',
//       Address: 'Imperial College\nLondon',
//       City: 'London'
//     }
//   ]

// connectDB.query('SELECT * FROM Persons', function(err, result, fields){
//     if(err) throw err;
//     console.log(result[0].PersonID);
// });