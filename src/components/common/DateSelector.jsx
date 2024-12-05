import React from "react";

import { DatePicker } from "antd";

export default function DateSelector({ setHolidays, disabledFlag }) {
  return (
    <>
      <DatePicker
        multiple
        onChange={setHolidays}
        disabled={disabledFlag}
        maxTagCount="responsive"
        placeholder="Selecciona los dias festivos"
        defaultValue={[]}
      />
    </>
  );
}
