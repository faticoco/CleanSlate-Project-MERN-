import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Link,
  Container,
} from "@mui/material";

import Pagination from "@mui/material/Pagination";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NavBar from "../components/Navbar";
import {
  viewAllStudents,
  deleteStudent,
  viewDegrees,
} from "../services/AdminService";
import theme from "../assets/theme/theme";
const ViewStudents = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterDegree, setFilterDegree] = useState("");
  const [rows, setRows] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    viewDegrees().then((res) => {
      res.json().then((data) => {
        setDegrees(data);
      });
    });

    viewAllStudents().then((res) => {
      const rows = res.map((row) => ({
        studentId: row.rollNumber,
        name: row.name,
        batch: row.batch,
        degree: row.degreeName,
        _id: row._id,
      }));
      setRows(rows);
    });
  }, []);

  const handleDelete = (studentId) => {
    deleteStudent(studentId).then((res) => {
      if (!res.errorMessage) {
        alert("Student deleted successfully");
        window.location.reload();
      } else {
        alert("Student could not be deleted");
      }
    });
  };
  const handleUpdate = (studentId) => {
    navigate(`/admin/updateStudent/${studentId}`);
  };

  const handleaddstudent = () => {
    navigate("/admin/addStudent");
  };
  const filteredRows = rows
    .filter(
      (row) =>
        (filterBatch === "" || row.batch === filterBatch) &&
        (filterDegree === "" || row.degree === filterDegree)
    )
    .filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchKeyword.toLowerCase())
      )
    );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <NavBar>
      <Container>
      <h1 style={{ color: "#22717d", float: "left" }}>Students</h1>

      <Container
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Button
          component={Link}
          onClick={handleaddstudent}
          variant="outlined"
          color="primary"
          startIcon={<PersonAddAltTwoToneIcon />}
          style={{
            zIndex: 2000,
            width: "150px",
            height: "40px",
            margin: "10px",
          }}
        >
          Add Student
        </Button>
        <FormControl variant="outlined" style={{ marginRight: "10px" }}>
          <InputLabel>Batch</InputLabel>
          <Select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            label="Batch"
            style={{ zIndex: 2000, width: "200px", height: "40px" }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="2019">2019</MenuItem>
            <MenuItem value="2020">2020</MenuItem>
            <MenuItem value="2021">2021</MenuItem>
            <MenuItem value="2022">2022</MenuItem>
            <MenuItem value="2023">2023</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel>Degree</InputLabel>
          <Select
            value={filterDegree}
            onChange={(e) => setFilterDegree(e.target.value)}
            label="Degree"
            style={{ zIndex: 2000, width: "200px", height: "40px" }}
          >
            <MenuItem value="">All</MenuItem>
            {degrees.map((degree) => (
              <MenuItem value={degree.name}>{degree.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          style={{
            marginLeft: "10px",
            marginRight: "70px",
            marginTop: "10px",
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">&#128269;</InputAdornment>
              ),
            }}
            style={{ marginBottom: "10px" }}
          />
        </FormControl>
      </Container>

      <TableContainer
        component={Paper}
        style={{ width: "95%", marginRight: "10px" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell style={{ color: "#FFFFFF" }}>Student ID</TableCell>
              <TableCell style={{ color: "#FFFFFF" }}>Name</TableCell>
              <TableCell style={{ color: "#FFFFFF" }}>Batch</TableCell>
              <TableCell style={{ color: "#FFFFFF" }}>Degree</TableCell>
              <TableCell style={{ color: "#FFFFFF" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.studentId}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.batch}</TableCell>
                <TableCell>{row.degree}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleUpdate(row._id)}>
                    <EditIcon color="secondary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row._id)}>
                    <DeleteIcon color="secondary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
        />
      </div>
      </Container>
    </NavBar>
  );
};

export default ViewStudents;
