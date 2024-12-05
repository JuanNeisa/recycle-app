import React, { useState, useEffect } from "react";
import Papa from "papaparse";

//Utils
import { generateGlobalInformation } from "../utils/ProcessingFile.utils";
import { downloadZipFile } from "../utils/downloadReport.utils";
import { removeBlankPropertiesFromObject } from "../utils/ProcessingFile.utils";

const VALID_EXTENSION = "text/csv";

export default function DownloadReports({ data }) {
  const [date, setDate] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [materialsCode, setMaterialsCode] = useState(null);

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

  useEffect(() => {
    if (data !== null) {
      const materials = Object.keys(data.result[0]).filter(
        (propiedad) => propiedad !== propiedad.toUpperCase()
      );
      setMaterials(Object.keys(materials).length);
    }
  }, [data]);

  const materialCodeCSV = (event) => {
    const file = event.target.files[0];
    if (file.type !== VALID_EXTENSION) {
      setMaterialsCode(null);
      return;
    } else {
      new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: false,
          complete: (result) =>
            resolve(
              result.data
                .filter((row) => row["Material"] !== "")
                .map((obj) => removeBlankPropertiesFromObject(obj))
            ),
          error: (error) => {
            console.error("Error processing CSV file:", error);
            setMaterialsCode(null);
          },
        });
      }).then((result) => {
        setMaterialsCode(Object.fromEntries(result));
      });
    }
  };

  const downloadMatrix = () => {
    const selectedDate = new Date(date.$d);
    const procesingInfo = generateGlobalInformation(data, selectedDate);

    //Download Reports
    downloadZipFile(procesingInfo, selectedDate, materialsCode);
  };

  return (
    <></>
  );
}
