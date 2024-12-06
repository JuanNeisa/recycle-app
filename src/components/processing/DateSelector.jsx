import React from "react";
import dayjs from "dayjs";

import { DatePicker } from "antd";

export default function DateSelector({
  setHolidays,
  disabledFlag,
  selectedMonth,
}) {

  return (
    <>
      <DatePicker
        multiple
        minDate={dayjs(selectedMonth).startOf("month")}
        maxDate={dayjs(selectedMonth).endOf("month")}
        onChange={setHolidays}
        disabled={disabledFlag}
        maxTagCount="responsive"
        placeholder="Selecciona los dias festivos"
        defaultValue={[]}
      />
    </>
  );
}
