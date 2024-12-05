import React, { useState } from "react";

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
} from "antd";
const { Title } = Typography;

import DropdownList from "./processing/DropdownList";
import DateSelector from "./common/dateSelector";

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
  const [codeFile, setCodeFile] = useState(null); // Configuracion para el archivo de codigos
  const [holidays, setHolidays] = useState(null); // Lista de dias festivos
  const [statusFile, setStatusFile] = useState(fileStatus.EMPTY); // Estado que se encuentra la carga del archivo principal

  const basicUploadProps = {
    maxCount: 1,
    multiple: false,
    accept: VALID_EXTENSION,
  };

  const uploadCsvFileProps = {
    beforeUpload: (file) => {
      if (file && file.type.includes(VALID_EXTENSION)) {
        setStatusFile(fileStatus.SUCCESS);
      } else setStatusFile(fileStatus.ERROR);
      return false;
    },
    onRemove: () => setStatusFile(fileStatus.ERROR),
    ...basicUploadProps,
  };

  const uploadCodesFileProps = {
    beforeUpload: (file) => {
      if (file && file.type.includes(VALID_EXTENSION)) setCodeFile(file);
      return false;
    },
    onRemove: () => setCodeFile(null),
    disabled: statusFile !== fileStatus.SUCCESS,
    ...basicUploadProps,
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
            disabled={statusFile !== fileStatus.SUCCESS}>
            Cargar codigos
          </Button>
        </Upload>
        <DateSelector setHolidays={setHolidays} disabledFlag={statusFile !== fileStatus.SUCCESS}/>
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
            {codeFile ? "✅" : "❌"}
          </Descriptions.Item>
          <Descriptions.Item label="Festivos">
            {holidays ? "✅" : "❌"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Button type="primary">Generar resultados</Button>
    </div>
  );
}
