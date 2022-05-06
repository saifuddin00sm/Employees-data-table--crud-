import React, { useState, createRef } from "react";
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
    const fileInput = createRef();

      // deleting a single employe
  const handleDelete = (id) => {
    const fill = employelist.filter((f) => f.id !== id);
    setEmployeList(fill);
    setInputValue({ fname: "", lname: "", sal: "", date: "", id: "" });
  };

  // editing the single employe
    const handleEdit = (id) => {
        const obj = employelist.filter((i) => i.id === id && i)[0];
        setInputValue({
          fname: obj.firstName,
          lname: obj.lastName,
          sal: obj.salary,
          date: obj.date,
          id: id,
        });
        setMode("Update");
      };
// creates and update employees informations
const handleSubmit = (e) => {
    e.preventDefault();
    const { id, fname, lname, sal, date } = inputValue;

    if (fname === "" || lname === "" || sal === "" || date === "") return;

    if (mode === "Update") {
      // updating a single employe detials
      const fill = employelist.filter((f) => f.id === id)[0];
      fill.firstName = fname;
      fill.lastName = lname;
      fill.salary = sal;
      fill.date = date;
      const updated = employelist.map((i) => {
        let val;
        if (i.id === id) {
          val = { ...i, fill };
        } else {
          val = i;
        }
        return val;
      });
      setEmployeList(updated);
      setInputValue({ fname: "", lname: "", sal: "", date: "", id: "" });
      setMode("Create");
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

  // download excel sheet
  const downloadExcel = ()=> {
    if(employelist.length>0){
     const workSheet = XLSX.utils.json_to_sheet(employelist);
     const workBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workBook, workSheet, 'employees');
     // Buffer
     XLSX.write(workBook,{bookType:'xlsx', type: 'buffer'});
     // binary string
     XLSX.write(workBook,{ bookType: 'xlsx', type: 'binary'});
     // download
     XLSX.writeFile(workBook,'employees.xlsx');
    }
   }

   const handleFile = (file)=> {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = ({ target: { result } }) => {
      const wb = XLSX.read(result, { type: rABS ? "binary" : "array" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setEmployeList(data);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
   }

// import csv
   const importCsv = (e)=> {
    const files = e.target.files;
    if(employelist.length===0){
        if (files && files[0]) handleFile(files[0]);
    }else{
        alert('Please clear current data')
    }
   }


  return (
<div>
    <div>
      <div className="d-flex justify-content-between">
        <Button onClick={downloadExcel}>Export</Button>
        <h4>Employee list</h4>
        <form>
            <input ref={fileInput} onChange={importCsv} type="file" accept={SheetJSFT} hidden />
            <Button onClick={() => fileInput.current.click()} className="btn btn-warning">Import</Button>
        </form>
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
            <td>No table data, Create some!</td>
          </tr>
        ) : (
          employelist.map(({ firstName, lastName, salary, date, id }) => (
            <tr key={id}>
              <td>{id}</td>
              <td style={{textTransform: 'capitalize'}}>{firstName}</td>
              <td style={{textTransform: 'capitalize'}}>{lastName}</td>
              <td>${salary}</td>
              <td>{date}</td>
              <td>
                <Button
                  onClick={() => handleDelete(id)}
                  className="btn-sm btn-danger"
                >
                  Delete
                </Button>
                <Button
                    onClick={() => handleEdit(id)}
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


const SheetJSFT = [
    "xlsx",
    "csv"
  ]
    .map(function(x) {
      return "." + x;
    })
    .join(",");
export default TableComponent;