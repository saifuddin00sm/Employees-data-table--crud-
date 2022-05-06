import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import * as XLSX from 'xlsx';

const TableComponent = () => {
    const [employelist, setEmployeList] = useState([]);
    const [inputValue, setInputValue] = useState({
      fname: "",
      lname: "",
      sal: "",
      date: "",
      id: "",
    });
    const [mode, setMode] = useState("Create");

// creates and update employees informations
const handleSubmit = (e) => {
    e.preventDefault();
    const { id, fname, lname, sal, date } = inputValue;

    if (fname === "" || lname === "" || sal === "" || date === "") return;

    if (mode === "Update") {
      // updating a single employe detials
    } else {
      // Creating a new employe
      const newEmploye = {
        firstName: fname,
        lastName: lname,
        salary: sal,
        date: date,
        id: employelist.length+1
      }
      setEmployeList([...employelist, newEmploye]);
      setInputValue({ fname: "", lname: "", sal: "", date: "", id: "" });
    }
  };

  return (
    <div>
    <div>
      <div className="d-flex justify-content-between">
        <Button>Export</Button>
        <h4>Employee list</h4>
      </div>
      <div>
        <form
        onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            gap: "9px",
            margin: "10px 0px",
          }}
        >
          <input
            value={inputValue.fname}
            onChange={(e) =>
              setInputValue({ ...inputValue, fname: e.target.value })
            }
            type="text"
            placeholder="First name"
          />
          <input
            value={inputValue.lname}
            onChange={(e) =>
              setInputValue({ ...inputValue, lname: e.target.value })
            }
            type="text"
            placeholder="Last name"
          />
          <input
            value={inputValue.sal}
            onChange={(e) =>
              setInputValue({ ...inputValue, sal: e.target.value })
            }
            type="text"
            placeholder="Salary"
          />
          <input
            value={inputValue.date}
            onChange={(e) =>
              setInputValue({ ...inputValue, date: e.target.value })
            }
            type="text"
            placeholder="Date"
          />
          <input
            type="submit"
            className="btn btn-sm btn-primary"
            value={mode}
          />
        </form>
      </div>
    </div>
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Salary</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employelist.length === 0 ? (
          <tr>
            <td>no data found</td>
          </tr>
        ) : (
          employelist.map(({ firstName, lastName, salary, date, id }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{firstName}</td>
              <td>{lastName}</td>
              <td>${salary}</td>
              <td>{date}</td>
              <td>
                <Button
                  className="btn-sm btn-danger"
                >
                  Delete
                </Button>
                <Button
                  className="btn-secondary btn-sm ms-2"
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  </div>
  )
}

export default TableComponent;