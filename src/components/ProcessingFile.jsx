//Libraries
import React, { useState } from "react";
import Papa from "papaparse";

//Utils
import { removeBlankPropertiesFromObject } from "../utils/ProcessingFile.utils";

//Material
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";

const VALID_EXTENSION = "text/csv";

const status = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  LOADING: "LOADING",
  EMPTY: "EMPTY",
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ProcessingFile({ setData }) {
  const [csvFile, setCsvFile] = useState(null);
  const [statusFile, setStatusFile] = useState(status.EMPTY);
  const [numberOfParts, setNumberOfParts] = useState("");

  const readCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          const cleanedData = result.data
            .filter((row) => row["RECICLADOR"] !== "")
            .map((obj) => removeBlankPropertiesFromObject(obj));
          resolve(cleanedData);
        },
        error: (error) => {
          console.error("Error processing CSV file:", error);
        },
      });
    });
  };

  const handleChange = (event, newValue) => {
    const file = event.target.files[0];
    setStatusFile(status.LOADING);
    setCsvFile(file)
    if (file.type !== VALID_EXTENSION) {
      setStatusFile(status.ERROR);
      setData(null);
      return;
    } else {
      readCSVFile(file)
        .then((result) => {
          setData({
            result,
            numberOfParts: numberOfParts === "" ? 8 : numberOfParts,
          });
          setStatusFile(status.SUCCESS);
        })
        .catch(() => setStatusFile(status.ERROR));
    }
  };

  return (
    <>
      <div style={{ padding: "0 30px" }}>
        <Stack
          spacing={2}
          direction="row"
          alignItems={"center"}
          display={"flex"}
          justifyContent={"space-between"}
        >
          <div
            style={{
              height: "30px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              onChange={handleChange}
            >
              Upload file
              <VisuallyHiddenInput type="file" />
            </Button>
            <h4 style={{marginLeft: '6px'}}>
              {csvFile?.name}
            </h4>
          </div>
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Numero de partes
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={numberOfParts}
                label="Numero de partes"
                onChange={(event) => setNumberOfParts(event.target.value)}
              >
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={12}>12</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
        <div style={{ paddingTop: "10px" }}>
          {statusFile === status.SUCCESS && (
            <span>🟢 Archivo cargado correctamente.</span>
          )}
          {statusFile === status.ERROR && (
            <span>🔴 Error al cargar archivo CSV.</span>
          )}
          {statusFile === status.LOADING && <span>🟡 Cargando...</span>}
          {statusFile === status.EMPTY && (
            <span>🔵 Listo para cargar archivo CSV.</span>
          )}
        </div>
      </div>
    </>
  );
}
