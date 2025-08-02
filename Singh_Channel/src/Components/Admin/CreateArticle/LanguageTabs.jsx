import React from 'react'
import { LANGUAGES } from "../../../Constants/Languages";
function LanguageTabs({ activeLanguage, onLanguageChange, completionStatus, languages = LANGUAGES }) {
  return (
   <>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      Preview Language
    </label>
    <div className="flex flex-wrap gap-2">
      {Object.entries(languages).map(([code, lang]) => (
        <button
          key={code}
          type="button"
          onClick={() => onLanguageChange(code)}
          className={`relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
            activeLanguage === code
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {lang.name}
          <span
            className={`ml-2 inline-block h-2 w-2 rounded-full ${
              completionStatus[code] ? "bg-green-500" : "bg-red-500"
            }`}
            title={completionStatus[code] ? "Complete" : "Incomplete"}
          />
        </button>
      ))}
    </div>
  </>
  )
}

export default LanguageTabs