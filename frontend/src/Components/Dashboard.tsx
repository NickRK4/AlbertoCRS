import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {styled as style} from "styled-components";
import { useState, useEffect, use } from 'react';

const TableContainer = style.div`
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#44296F',
    fontWeight: 'bold',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  borderRadius: '8px',
  '&:nth-of-type(odd)': {
    // backgroundColor: theme.palette.action.hover,
  },

  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,

  },
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: theme.palette.action.hover,
  },
}));


function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}



export default function Dashboard() {
    useEffect(() => {
        const res = fetch('http://localhost:8000/api/courses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    })


    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];
    


  return (
    <TableContainer>
      <Table sx={{ minWidth: 700, maxWidth: 1900,width: '80%'}} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Course ID</StyledTableCell>
            <StyledTableCell align="left">Course Name</StyledTableCell>
            <StyledTableCell align="left">Class Size</StyledTableCell>
            <StyledTableCell align="left">Capacity</StyledTableCell>
            <StyledTableCell align="left">Professor</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="left">{row.calories}</StyledTableCell>
              <StyledTableCell align="left">{row.fat}</StyledTableCell>
              <StyledTableCell align="left">{row.carbs}</StyledTableCell>
              <StyledTableCell align="left">{row.protein}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}