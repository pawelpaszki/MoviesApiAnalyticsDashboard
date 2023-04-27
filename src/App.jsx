import { useState, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { getLogsAnalytics } from "./api/analytics";
import { styled } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';

const styles = {
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginLeft: 1,
    marginRight: 1,
    paddingLeft: "1em",
    paddingRight: "1em",
    height: "100px",
    textAlign: "center"
  },
  header: {
    height: "auto",
    marginBottom: "1em"
  }
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function App() {
  const [fetched, setFetched] = useState(false);
  const [fetchedData, setFetchedData] = useState({});
  const [requestCounts, setRequestCounts] = useState([]);
  const [requestsPerUrlData, setRequestsPerUrlData] = useState({});
  const [logs, setLogs] = useState([]);

  async function fetchLogs() {
    const logsAnalytics = await getLogsAnalytics();
    setFetchedData(logsAnalytics);
    processData(logsAnalytics);
    setFetched(true);
  }

  function processRequestsPerUrlCount(logsAnalytics) {
    let barChartData = [["Requests", "number of success hits", "number of failures"]];
    logsAnalytics.requestsCount.forEach(el => {
      if (el.length === 2) { // url and method+count
        if (el[1].stats !== undefined) {
          el[1].stats.forEach(endpoint => {
            if (endpoint.method !== undefined  && endpoint.successCount !== undefined && endpoint.failureCount !== undefined) {
              barChartData.push([`${endpoint.method} ${el[0]}`, parseInt(endpoint.successCount), parseInt(endpoint.failureCount)]);
            }
          });
        }
      }
    });
    setRequestsPerUrlData(barChartData);
  }

  function processData(logsAnalytics) {
    if (logsAnalytics.requestsCount !== undefined && logsAnalytics.requestsCount.length > 0) {
      processRequestsPerUrlCount(logsAnalytics);
    }
    if (logsAnalytics.totalRequests !== undefined &&
      logsAnalytics.successRequestsCount !== undefined &&
      logsAnalytics.errorRequestsCount !== undefined
    ) {
      setRequestCounts(
        [
          { title: "Total requests count", value: logsAnalytics.totalRequests, divStyle: { backgroundColor: 'dodgerblue', } },
          { title: "Success requests count", value: logsAnalytics.successRequestsCount, divStyle: { backgroundColor: 'green', } },
          { title: "Error requests count", value: logsAnalytics.errorRequestsCount, divStyle: { backgroundColor: 'red', } },
        ]
      );
    }
    if (logsAnalytics.logs.length > 0) {
      setLogs(logsAnalytics.logs);
    }
  }

  useEffect(() => {
    setTimeout(() => fetchLogs(), 100);
  }, []);

  const options = {
    title: "Endpoint hits per HTTP method and url",
    chartArea: { width: "70%", top: 100, height: "70%" },
    hAxis: {
      title: "Requests",
      minValue: 0,
    },
    vAxis: {
      title: "Endpoint",
      textStyle: { fontSize: 10 },
    },
    legend: { position: 'top', textStyle: { fontSize: 10 } }
  };
  return (
    <>
      {fetched ? (
        <>
          <Grid container>
            {requestCounts.map((r) => (
              <Grid key={r.title} item xs={12} sm={4} md={4} lg={4} xl={4}>
                <Paper component="div" sx={styles.root} style={r.divStyle}>
                  <Typography variant="h4" component="h3">
                    {r.title}
                  </Typography>

                </Paper>
                <Paper component="div" sx={styles.root} style={r.divStyle}>
                  <Typography variant="h4" component="h3" style={{ display: "block" }}>
                    {r.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Chart
            chartType="BarChart"
            width="100%"
            height="1000px"
            data={requestsPerUrlData}
            options={options}
          />
          <Divider />
          <Paper component="div" sx={styles.header}>
            <Typography variant="h4" component="h3">
              Logs
            </Typography>
          </Paper>
          <div style={{ width: "100%", height: "600px", overflow: "scroll" }}>
            <TableContainer component={Paper}>
              <Table sx={{ width: "100%" }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Url</StyledTableCell>
                    <StyledTableCell align="right">Level&nbsp;</StyledTableCell>
                    <StyledTableCell align="right">Http method</StyledTableCell>
                    <StyledTableCell align="right">Status&nbsp;</StyledTableCell>
                    <StyledTableCell align="right">TimeStamp&nbsp;</StyledTableCell>
                    <StyledTableCell align="right">AccountId&nbsp;</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow
                      key={log.url}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {log.message.url}
                      </StyledTableCell>
                      {log.level === "error" ? (
                        <StyledTableCell style={{ backgroundColor: 'red' }} align="right">{log.level}</StyledTableCell>
                      ) : (
                        <StyledTableCell style={{ backgroundColor: 'green' }} align="right">{log.level}</StyledTableCell>
                      )}
                      <StyledTableCell align="right">{log.message.method}</StyledTableCell>
                      <StyledTableCell align="right">{log.message.status}</StyledTableCell>
                      <StyledTableCell align="right">{log.timestamp}</StyledTableCell>
                      {log.message.accountId ? (
                        <StyledTableCell align="right">{log.message.accountId}</StyledTableCell>
                      ) : (
                        <StyledTableCell align="right"></StyledTableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default App
