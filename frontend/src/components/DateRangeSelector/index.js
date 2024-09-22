import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './DateRangeSelector.css';

const DateRangeSelector = ({ dateRange, onChange, options }) => {
  return (
    <FormControl variant="outlined" className="date-range-selector">
      <InputLabel id="date-range-label">Select Season</InputLabel>
      <Select
        labelId="date-range-label"
        id="date-range-select"
        value={dateRange}
        onChange={(e) => onChange(e.target.value)}
        label="Select Season"
      >
        {options.map((range) => (
          <MenuItem key={range} value={range}>
            {range}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DateRangeSelector;
