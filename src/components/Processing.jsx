import React, { useState, useEffect } from "react";

// AntDesign
import { UploadOutlined, DiffOutlined } from "@ant-design/icons";
import {
  Button,
  Upload,
  theme,
  Divider,
  Card,
  Descriptions,
  Typography,
  Space,
  DatePicker,
} from "antd";
const { Title } = Typography;

// Components
import DropdownList from "./processing/DropdownList";
import DateSelector from "./processing/DateSelector";

// Utils
import { readCSVFile } from "../utils/ProcessingFile.utils";
import { generateGlobalInformation } from "../utils/ProcessingFile.utils";
import { downloadZipFile } from "../utils/downloadReport.utils";

const VALID_EXTENSION = "text/csv";
const fileStatus = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  LOADING: "LOADING",
  EMPTY: "EMPTY",
};

export default function Processing() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [config, setConfig] = useState(null); // Configuracion para la generacion de archivos
  const [filesObj, setFilesObj] = useState(null); // Configuracion para el archivo de codigos
  const [holidays, setHolidays] = useState([]); // Lista de dias festivos
  const [statusFile, setStatusFile] = useState(fileStatus.EMPTY); // Estado que se encuentra la carga del archivo principal

  const basicUploadProps = {
    maxCount: 1,
    multiple: false,
    accept: VALID_EXTENSION,
  };

  const uploadCsvFileProps = {
    beforeUpload: () => false,
    onChange: (changeObj) => {
      const file = changeObj.fileList.length > 0 ? changeObj.file : null;
      if (file !== null) {
        if (file && file.type.includes(VALID_EXTENSION)) {
          setStatusFile(fileStatus.SUCCESS);
          setFilesObj({ ...filesObj, csvFile: file });
        } else setStatusFile(fileStatus.ERROR);
      }
    },
    onRemove: () => setStatusFile(fileStatus.EMPTY),
    ...basicUploadProps,
  };

  const uploadCodesFileProps = {
    beforeUpload: (file) => {
      if (file && file.type.includes(VALID_EXTENSION))
        setFilesObj({ ...filesObj, codeFile: file });
      return false;
    },
    onRemove: () => setFilesObj({ ...filesObj, codeFile: null }),
    disabled: statusFile !== fileStatus.SUCCESS,
    ...basicUploadProps,
  };

  const generateResults = async () => {
    try {
      const resultRecycler = await readCSVFile(filesObj.csvFile, 'RECICLADOR');
      const resultMaterialCode = await readCSVFile(filesObj.codeFile, 'MATERIAL')
      const selectedDate = new Date(config.selectedMonth.$d);
      const procesingInfo = generateGlobalInformation(
        {
          result: resultRecycler,
          numberOfParts: config.numberOfParts,
          percentage: config.percentage,
          rejected: config.rejected,
          holidays
        },
        selectedDate
      );

      //Download Reports
      downloadZipFile(procesingInfo, selectedDate, holidays, resultMaterialCode.reduce((acc, item) => {
        acc[item.MATERIAL] = item.Codigo;
        return acc;
      }, {}));
    } catch (error) { 
      console.error("Failed to read the CSV file:", error);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        minHeight: "calc(100vh - 32px)",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Upload {...uploadCsvFileProps}>
        <Button icon={<UploadOutlined />}>Cargar Archivo</Button>
      </Upload>
      <Divider />
      {/* Configuracion para la generacion e resultados */}
      <Space direction="vertical">
        <Title level={4} style={{ marginTop: "0" }}>
          Configuracion
        </Title>
        <DropdownList
          setConfig={setConfig}
          disabledFlag={statusFile !== fileStatus.SUCCESS}
        />
        <Upload {...uploadCodesFileProps}>
          <Button
            icon={<DiffOutlined />}
            disabled={statusFile !== fileStatus.SUCCESS}
          >
            Cargar codigos
          </Button>
        </Upload>
        <DatePicker
          onChange={(date) => setConfig({ ...config, selectedMonth: date })}
          disabled={statusFile !== fileStatus.SUCCESS}
          picker="month"
        />
        <DateSelector
          setHolidays={(holidaysArray) =>
            setHolidays(holidaysArray.map((holiday) => holiday.$D))
          }
          disabledFlag={!config?.selectedMonth}
          selectedMonth={config?.selectedMonth}
        />
      </Space>
      {/* Resumen */}
      <Card size="small" style={{ margin: "20px 0 " }}>
        <Descriptions
          title="Resumen"
          bordered
          column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        >
          <Descriptions.Item label="Numero de partes">
            {config?.numberOfParts || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Diferencia entre unidades">
            {config?.percentage * 100 + "%" || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Porcentaje material rechazado">
            {config?.rejected * 100 + "%" || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Archivo de codigos">
            {filesObj?.codeFile ? "✅" : "❌"}
          </Descriptions.Item>
          <Descriptions.Item label="Seleccion de mes">
            {config?.selectedMonth ? "✅" : "❌"}
          </Descriptions.Item>
          <Descriptions.Item label="Festivos">
            {holidays ? "✅" : "❌"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Button
        type="primary"
        disabled={statusFile !== fileStatus.SUCCESS}
        onClick={generateResults}
      >
        Generar resultados
      </Button>
    </div>
  );
}
