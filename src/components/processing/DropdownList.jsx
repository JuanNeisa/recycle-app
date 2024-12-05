import React, { useState, useEffect } from "react";

import {
  NumberOfPartsDropdown,
  percentageDifference,
  percentageRejected,
} from "../../utils/DropdownItems";

// AntDesign
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Badge } from "antd";

export default function DropdownList({ setConfig, disabledFlag }) {
  const [numberOfParts, setNumberOfParts] = useState(3); // Numero de partes a dividir el material
  const [percentage, setPercentage] = useState(3); // Porcentaje de variacion en la division de unidades
  const [rejected, setRejected] = useState(3); // Porcentaje de material rechazado

  useEffect(() => {
    setConfig({
        numberOfParts: NumberOfPartsDropdown[numberOfParts].label,
        percentage: percentageDifference[percentage].label / 100,
        rejected: percentageRejected[rejected].label / 100,
    })
  }, [numberOfParts, percentage, rejected]);

  return (
    <Space size={'middle'}>
      <Dropdown
        menu={{
          items: NumberOfPartsDropdown,
          selectable: true,
          disabled: disabledFlag,
          defaultSelectedKeys: NumberOfPartsDropdown[numberOfParts],
          onClick: (e) => {
            setNumberOfParts(Number(e.key));
          },
        }}
      >
        <Button disabled={disabledFlag}>
          <Space>
            Numero de partes
            <Badge
              count={NumberOfPartsDropdown[numberOfParts].label}
              color="#faad14"
            />
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <Dropdown
        menu={{
          items: percentageDifference,
          selectable: true,
          disabled: disabledFlag,
          defaultSelectedKeys: percentageDifference[percentage],
          onClick: (e) => {
            setPercentage(Number(e.key));
          },
        }}
      >
        <Button disabled={disabledFlag}>
          <Space>
            Porcentaje por unidad
            <Badge
              count={percentageDifference[percentage].label + '%'}
              color="#faad14"
            />
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <Dropdown
        menu={{
          items: percentageRejected,
          selectable: true,
          disabled: disabledFlag,
          defaultSelectedKeys: percentageRejected[rejected],
          onClick: (e) => {
            setRejected(Number(e.key));
          },
        }}
      >
        <Button disabled={disabledFlag}>
          <Space>
            Rechazo
            <Badge count={percentageRejected[rejected].label + '%'} color="#faad14" />
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      </Space>
  );
}
