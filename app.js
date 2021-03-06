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
          return true;
        } else {
          console.log("Department name cannot be blank");
          return;
        }
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
          start();
        }
      );
    });
};

role_add = () => {
  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "What is the title of the new role?"
        },
        {
          name: "roleSalary",
          type: "input",
          message: "What is the salary of the new role?"
        },
        {
          name: "roleDep",
          type: "list",
          Mesage: "What Department does this role work in?",
          choices: function() {
            var choicesArray = [];
            for (var i = 0; i < res.length; i++)
              choicesArray.push(res[i].id + "." + res[i].name);
            return choicesArray;
          }
        }
      ])
      .then(function(answer) {
        var roleDepId = answer.roleDep.split(".")[0];
        console.log(roleDepId);
        var newRole = {
          title: answer.roleTitle,
          salary: answer.roleSalary,
          department_id: roleDepId
        };
        connection.query("INSERT INTO roles SET ?", newRole, function(err) {
          if (err) throw err;
          console.log(answer.roleTitle + " successfully added");
          start();
        });
      });
  });
};

employee_add = () => {
  connection.query("SELECT * FROM roles", function(err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "empFirstName",
          type: "input",
          message: "What is the employees first name?"
        },
        {
          name: "empLastName",
          type: "input",
          message: "What is the employees last name?"
        },
        {
          name: "empRole",
          type: "list",
          Mesage: "What role does this employee work in?",
          choices: function() {
            var choicesArray = [];
            for (var i = 0; i < res.length; i++)
              choicesArray.push(res[i].id + "." + res[i].title);
            return choicesArray;
          }
        }
      ])
      .then(function(answer) {
        var empRoleId = answer.empRole.split(".")[0];
        var newEmp = {
          first_name: answer.empFirstName,
          last_name: answer.empLastName,
          role_id: empRoleId
        };
        connection.query("INSERT INTO employees SET ?", newEmp, function(err) {
          if (err) throw err;
          console.log("New employee successfully added");
          start();
        });
      });
  });
};

update = () => {
  inquirer
    .prompt({
      name: "updateWhat",
      type: "list",
      message: "What would you like to Update?",
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
};
department_update = () => {
  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "dep_ToUpdate",
          type: "list",
          Mesage: "What Department do you want to update?",
          choices: function() {
            var choicesArray = [];
            for (var i = 0; i < res.length; i++)
              choicesArray.push(res[i].id + "." + res[i].name);
            return choicesArray;
          }
        },
        {
          name: "dep_New",
          type: "input",
          message: "What do you want to change the department to?"
        }
      ])
      .then(function(answer) {
        var dep_ToUpdate = answer.dep_ToUpdate.split(".")[1];
        var input = answer.dep_New;
        connection.query(
          "UPDATE employees_db.departments SET name = ? WHERE name = ?",
          [input, dep_ToUpdate],
          function(err) {
            if (err) throw err;
            console.log(
              answer.dep_ToUpdate + " successfully changed to " + answer.dep_New
            );
            start();
          }
        );
      });
  });
};

role_update = () => {
  connection.query("SELECT * FROM roles", function(err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "role_ToUpdate",
          type: "list",
          Mesage: "What role do you want to update?",
          choices: function() {
            var choicesArray = [];
            for (var i = 0; i < res.length; i++)
              choicesArray.push(res[i].id + "." + res[i].title);
            return choicesArray;
          }
        },
        {
          name: "role_New",
          type: "input",
          message: "What do you want to change the role to?"
        }
      ])
      .then(function(answer) {
        var role_ToUpdate = answer.role_ToUpdate.split(".")[1];
        var input = answer.role_New;
        connection.query(
          "UPDATE employees_db.roles SET title = ? WHERE title = ?",
          [input, role_ToUpdate],
          function(err) {
            if (err) throw err;
            console.log(
              answer.role_ToUpdate +
                " successfully changed to " +
                answer.role_New
            );
            start();
          }
        );
      });
  });
};
employee_update = () => {
  connection.query("SELECT * FROM employees", function(err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employee_ToUpdate",
          type: "list",
          Mesage: "What employees name that you wan to update?",
          choices: function() {
            var choicesArray = [];
            for (var i = 0; i < res.length; i++)
              choicesArray.push(
                res[i].id + "." + res[i].first_name + "." + res[i].last_name
              );
            return choicesArray;
          }
        },
        {
          name: "emp_New",
          type: "input",
          message: "What do you want to change the role to?"
        }
      ])
      .then(function(answer) {
        var id = answer.employee_ToUpdate.split(".")[0];
        var first_name = answer.emp_New.split(" ")[0];
        var last_name = answer.emp_New.split(" ")[1];

        connection.query(
          "UPDATE employees_db.employees SET first_name = ?, last_name = ? WHERE id = ?",
          [first_name, last_name, id],
          function(err) {
            if (err) throw err;
            console.log(
              answer.employee_ToUpdate +
                " successfully changed to " +
                first_name +
                last_name
            );
            start();
          }
        );
      });
  });
};

view = () => {
  inquirer
    .prompt({
      name: "viewWhat",
      type: "list",
      message: "What would you like to view?",
      choices: ["Departments", "Roles", "Employees", "Restart"]
    })
    .then(function(answer) {
      switch (answer.viewWhat) {
        case "Departments":
          department_view();
          break;

        case "Roles":
          role_view();
          break;

        case "Employees":
          employee_view();
          break;

        case "Restart":
          start();
          break;
      }
    });

  department_view = () => {
    connection.query("SELECT * FROM departments", function(err, res) {
      if (err) throw err;
      console.table(res);
    });
    start();
  };
  role_view = () => {
    connection.query("SELECT * FROM roles", function(err, res) {
      if (err) throw err;
      console.table(res);
      start();
    });
  };
  employee_view = () => {
    connection.query("SELECT * FROM employees", function(err, res) {
      if (err) throw err;
      console.table(res);
      start();
    });
  };
};
