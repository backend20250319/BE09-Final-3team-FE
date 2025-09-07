"use client";

import React from "react";
import Select from "../../../activity/components/ClientOnlySelect";
import { MEDICATION_LABELS, CARE_LABELS, VACCINATION_LABELS } from "../../../constants";

export default function MedicalFilter({
  type,
  options,
  value,
  onChange,
  placeholder,
  className,
  styles,
}) {
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    switch (type) {
      case "medication":
        return "필터 선택";
      case "care":
        return "유형 선택";
      case "vaccination":
        return "유형 선택";
      default:
        return "선택하세요";
    }
  };

  return (
    <div className={className}>
      <Select
        options={options}
        value={options.find((o) => o.value === value)}
        onChange={(option) => onChange(option.value)}
        placeholder={getPlaceholder()}
        className={className}
        styles={styles}
      />
    </div>
  );
}
