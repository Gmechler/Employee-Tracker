var mysql = require("mysql");
var inquirer = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Tit2920ans!",
  database: "employees_db"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + con.threadID + "\n");
});

start = () => {
  inquirer
    .prompt({
      // ask if they want to add, view, or update
      name: "action",
      type: "list",
      message: "Would you like to add, update, or view a category?",
      choices: ["Add New", "Update", "View", "Exit"]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "Add New":
          add();
          break;

        case "Update":
          update();
          break;
        case "View":
          view();
          break;
        case "Exit":
          con.end();
          break;
      }
    });
};

add = () => {
  inquirer
    .prompt({
      name: "addWhat",
      type: "list",
      message: "What would you like to add?",
      choices: ["Department", "Role", "Employee", "Restart"]
    })
    .then(function(answer) {
      switch (answer.postOrBid) {
        case "Department":
          department_add();
          break;

        case "Role":
          role_add();
          break;

        case "Employee":
          employee_add();
          break;

        case "Restart":
          start();
          break;
      }
    });
};

update = () => {};
view = () => {};

// function createDepartment(function(err){
//     if(err) throw err;
//     console.log()
// })

// function updateDepartment(function(err){}
// function deleteDepartment(function(err){}
// function readDepartment(function(err){}
