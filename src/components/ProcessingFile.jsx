//Libraries
import React, { useState } from "react";
import Papa from "papaparse";

//Utils
import { removeBlankPropertiesFromObject } from "../utils/ProcessingFile.utils";

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
  const [numberOfParts, setNumberOfParts] = useState(8);
  const [percentage, setPercentage] = useState(0.15);
  const [rejected, setRejected] = useState(0.03);

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
    setCsvFile(file);
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
            percentage,
            rejected
          });
          setStatusFile(status.SUCCESS);
        })
        .catch(() => setStatusFile(status.ERROR));
    }
  };

  return (
    <></>
  );
}
