import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../Services/Store/languageSlice.js";
import Button from "../Ui/Button.jsx";

function Topbar() {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    (state) => state.language.selectedLanguage
  );

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = useMemo(() => {
    const date = new Date();
    return date.toLocaleDateString("en-US", options);
  }, []);

  const handleLanguageChange = (lang) => {
    console.log("Language changed to:", lang);
    dispatch(setLanguage(lang));
  };

  return (
    <div className="flex h-7 w-full items-center justify-between bg-black px-3">
      <div className="text-white">
        <span className="text-[11px] leading-none font-medium tracking-wide">
          {formattedDate}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          onClick={() => handleLanguageChange("en")}
          className={`h-6 rounded px-2 py-0 text-[11px] leading-none font-medium transition-all duration-200 ${
            selectedLanguage === "en"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          English
        </Button>
        <Button
          onClick={() => handleLanguageChange("hi")}
          className={`h-6 rounded px-2 py-0 text-[11px] leading-none font-medium transition-all duration-200 ${
            selectedLanguage === "hi"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          हिंदी
        </Button>
        <Button
          onClick={() => handleLanguageChange("pu")}
          className={`h-6 rounded px-2 py-0 text-[11px] leading-none font-medium transition-all duration-200 ${
            selectedLanguage === "pu"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          ਪੰਜਾਬੀ
        </Button>
      </div>
    </div>
  );
}

export default Topbar;
