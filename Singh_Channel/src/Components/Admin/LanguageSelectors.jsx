import React from "react";
import { ChevronDown } from "lucide-react";

export default function LanguageSelectors({
  sourceLanguage,
  handleSourceLanguageChange,
  LANGUAGES,
  previewLanguage,
  handlePreviewLanguageChange,
  completionStatus,
}) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Source Language
        </label>
        <div className="relative max-w-[200px]">
          <select
            value={sourceLanguage}
            onChange={handleSourceLanguageChange}
            className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {Object.entries(LANGUAGES).map(([code, lang]) => (
              <option key={code} value={code}>
                {lang.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Preview Language
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(LANGUAGES).map(([code, lang]) => (
            <button
              key={code}
              type="button"
              onClick={() => handlePreviewLanguageChange(code)}
              className={`relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                previewLanguage === code
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
              ></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
