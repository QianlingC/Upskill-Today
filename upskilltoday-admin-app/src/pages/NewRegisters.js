import React, { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import { TableContainer, Paper, Container, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../components/Title";
import Pagination from "@mui/material/Pagination";
import { saveAs } from "file-saver";
//import Stack from '@mui/material/Stack';
//import PaginationItem from "@mui/material/PaginationItem";

const excel = require("xlsx");

function preventDefault(event) {
  event.preventDefault();
}

const NewRegisters = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/register");
      const jsonData = await response.json();
      //  console.log("Register Data: ", jsonData);
      setData(jsonData);
      //    setData(response.data);
    } catch (error) {
      console.error("Error retrieving data: ", error);
    }
  };

  /*
  const saveToFile = () => {
    const dataString = JSON.stringify(data, null, 2);
    const blob = new Blob([dataString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };
*/
  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the indexes for the items to be displayed on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const exportExcel = () => {
    const worksheet = excel.utils.json_to_sheet(data);
    const workbook = excel.utils.book_new();
    excel.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelData = excel.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "data.xlsx");
  };

  return (
    <React.Fragment>
      <Container sx={{ mt: 3, ml: 30, width: "1200px" }}>
        <Title>Registrants</Title>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "black", color: "white" }}>
                <TableCell sx={{ color: "white", fontSize: "1rem" }}>
                  Date
                </TableCell>
                <TableCell sx={{ color: "white", fontSize: "1rem" }}>
                  Frist Name
                </TableCell>
                <TableCell sx={{ color: "white", fontSize: "1rem" }}>
                  Last Name
                </TableCell>
                <TableCell sx={{ color: "white", fontSize: "1rem" }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "white", fontSize: "1rem" }}>
                  Contact
                </TableCell>
                <TableCell sx={{ color: "white", fontSize: "1rem" }}>
                  Program
                </TableCell>
                <TableCell sx={{ color: "white", fontSize: "1rem" }}>
                  Country
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.updatedAt.slice(0, 10)}</TableCell>
                  <TableCell>{row.firstname}</TableCell>
                  <TableCell>{row.lastname}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.contact}</TableCell>
                  <TableCell>{row.program}</TableCell>
                  <TableCell>{row.country}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            count={Math.ceil(data.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, page) => handlePageChange(page)}
            className="pagination"
            color="primary"
            sx={{ mt: 3, mb: 3, display: "flex", justifyContent: "center" }}
          ></Pagination>
        </TableContainer>

        <div>
          <h3>Data Exporter</h3>
          <Button onClick={exportExcel} color="primary" variant="contained">
            Save to File
          </Button>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default NewRegisters;
