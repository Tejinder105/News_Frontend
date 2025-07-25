import React from "react";
import { Controller } from "react-hook-form";
import TipTap from "./TipTap";

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="mb-1 inline-block pl-1 font-semibold text-gray-700">
          {label}
        </label>
      )}
      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TipTap value={value} onChange={onChange} />
        )}
      />
    </div>
  );
}
