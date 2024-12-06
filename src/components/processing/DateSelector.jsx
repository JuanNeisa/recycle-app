import React from "react";
import dayjs from 'dayjs';

import { DatePicker } from "antd";

export default function DateSelector({ setHolidays, disabledFlag }) {
  const dateFormat = 'YYYY-MM-DD';

  return (
    <>
      <DatePicker
        multiple
        minDate={dayjs('2024-08-01', dateFormat)}
        maxDate={dayjs('2024-08-31', dateFormat)}
        onChange={setHolidays}
        disabled={disabledFlag}
        maxTagCount="responsive"
        placeholder="Selecciona los dias festivos"
        defaultValue={[]}
      />
    </>
  );
}
