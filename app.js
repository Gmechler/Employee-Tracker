var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Tit2920ans!",
  database: "employees_db"
});
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
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
          connection.end();
          break;
      }
    });
};

add = () => {
  // ask what they want to add
  inquirer
    .prompt({
      name: "addWhat",
      type: "list",
      message: "What would you like to add?",
      choices: ["Department", "Role", "Employee", "Restart"]
    })
    .then(function(answer) {
      switch (answer.addWhat) {
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
// adds a new department
department_add = () => {
  inquirer
    .prompt({
      name: "departmentName",
      type: "input",
      message: "Enter the name of the new department",
      // checks to see if the sting value is not empty
      validate: function(value) {
        if (value !== "") {
          console.log("Department name cannot be blank");
        }
        return true;
      }
    })
    .then(function(answer) {
      connection.query(
        "INSERT INTO departments SET ?",
        {
          name: answer.departmentName
        },
        function(err) {
          if (err) throw err;
          console.log("New Department successfully added to the database.");
        }
      );
    });
};

role_add = () => {};
employee_add = () => {};

update = () => {
  inquirer
    .prompt({
      name: "updateWhat",
      type: "list",
      message: "What would you like to add?",
      choices: ["Department", "Role", "Employee", "Restart"]
    })
    .then(function(answer) {
      switch (answer.updateWhat) {
        case "Department":
          department_update();
          break;

        case "Role":
          role_update();
          break;

        case "Employee":
          employee_update();
          break;

        case "Restart":
          start();
          break;
      }
    });

  department_update = () => {};
  role_update = () => {};
  employee_update = () => {};
};
view = () => {
  inquirer
    .prompt({
      name: "viewWhat",
      type: "list",
      message: "What would you like to add?",
      choices: ["Department", "Role", "Employee", "Restart"]
    })
    .then(function(answer) {
      switch (answer.viewWhat) {
        case "Department":
          department_view();
          break;

        case "Role":
          role_view();
          break;

        case "Employee":
          employee_view();
          break;

        case "Restart":
          start();
          break;
      }
    });

  department_view = () => {};
  role_view = () => {};
  employee_view = () => {};
};

// function createDepartment(function(err){
//     if(err) throw err;
//     console.log()
// })

// function updateDepartment(function(err){}
// function deleteDepartment(function(err){}
// function readDepartment(function(err){}
