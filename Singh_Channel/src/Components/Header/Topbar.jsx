import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../Services/Store/languageSlice";
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
          variant={selectedLanguage === "en" ? "language-active" : "language"}
          size="xs"
          onClick={() => handleLanguageChange("en")}
        >
          English
        </Button>
        <Button
          variant={selectedLanguage === "hi" ? "language-active" : "language"}
          size="xs"
          onClick={() => handleLanguageChange("hi")}
        >
          हिंदी
        </Button>
        <Button
          variant={selectedLanguage === "pu" ? "language-active" : "language"}
          size="xs"
          onClick={() => handleLanguageChange("pu")}
        >
          ਪੰਜਾਬੀ
        </Button>
      </div>
    </div>
  );
}

export default Topbar;
