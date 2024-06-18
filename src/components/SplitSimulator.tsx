import React, { useState } from "react";
import "../styles/SplitSimulator.css"

//Material-ui
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function SplitSimulator() {
  let sum = 0;
  const [selectedValue, setSelectedValue] = useState<number>();
  const [amountOfParts, setAmountOfParts] = useState(8);
  const [percentage, setPercentage] = useState<number>(0.15);
  const [data, setData] = useState<number[]>([]);

  const generateData = (value: number) => {
    const avergeValue = value / amountOfParts;
    const max = avergeValue + avergeValue * (percentage);
    const min = avergeValue + avergeValue * ((percentage) * -1);
    const randomParts: number[] = [];
    for (var i = 1; i <= amountOfParts - 1; i++) {
      const randomPart = parseFloat(
        (Math.random() * (max - min) + min).toFixed(2)
      );
      randomParts.push(randomPart);
      value = value - randomPart;
    }
    randomParts.push(parseFloat(value.toFixed(2)));
    setData(randomParts);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, padding: "30px" }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <h3 style={{ margin: "0" }}>Parametros</h3>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Valor"
              variant="outlined"
              margin="normal"
              type="number"
              onChange={(event) => setSelectedValue(+event.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-simple-select-label">
                Numero de partes
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={amountOfParts}
                label="Numero de partes"
                onChange={(event) => setAmountOfParts(+event.target.value)}
              >
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={14}>14</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-simple-select-label">Porcentaje</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={percentage}
                label="Numero de partes"
                onChange={(event) => setPercentage(+event.target.value)}
              >
                <MenuItem value={0.1}>10%</MenuItem>
                <MenuItem value={0.15}>15%</MenuItem>
                <MenuItem value={0.2}>20%</MenuItem>
                <MenuItem value={0.3}>30%</MenuItem>
                <MenuItem value={0.4}>40%</MenuItem>
                <MenuItem value={0.5}>50%</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() => generateData(selectedValue!)}
            >
              Generar
            </Button>
          </Grid>
          <Grid item xs={6} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <table>
              <thead>
                <tr>
                  <th>Índice</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {data.map((value, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{value}</td>
                  </tr>
                ))}
                <tr>
                  <td><strong>Total</strong></td>
                  <td>{data.length > 1 && data.reduce((a, b) => a + b).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
