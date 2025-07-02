import React from 'react'
import { Controller } from 'react-hook-form';
import TipTap from './TipTap';

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full mb-4">
      {label && <label className="inline-block mb-1 pl-1 font-semibold text-gray-700">{label}</label>}
      <Controller
        name={name || "content"}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <>
            <TipTap value={value} onChange={onChange} />
          </>
        )}
      />
    </div>
  )
}
