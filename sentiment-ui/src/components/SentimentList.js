import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const columns = [
  { id: 'tweet', label: 'Tweet', minWidth: 300 },
  { id: 'emotion', label: 'Emotion', minWidth: 150 },
];

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#FFFFFF'
    }
  },
  typography: {
    allVariants: {
      color: '#000000'
    }
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    margin: 'auto',
  },
  container: {
    maxHeight: 500,
  },
  tableHeader: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
  }
}));


const SentimentList = ({ sentiments }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Paper elevation={3}>
          <TableContainer className={classes.container}>
            <Table stickyHeader>
              <TableHead className={classes.tableHeader}>
                <TableRow className={classes.tableRow}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '0.95rem'}}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sentiments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sentiment, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = sentiment[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === 'emotion' ? value.join(', ') : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={sentiments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default SentimentList;
