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
        dispatch(setLanguage(lang));
    };

    return (
        <div className="flex w-full items-center justify-between bg-black p-1 text-[12px]">
            <div className="font-sans text-white">
                <p>{formattedDate}</p>
            </div>
            <div className="flex gap-2 font-sans text-white">
                <Button
                    onClick={() => handleLanguageChange("en")}
                    className={
                        selectedLanguage === "en"
                            ? "bg-blue-600 text-white"
                            : ""
                    }
                >
                    English
                </Button>
                <Button
                    onClick={() => handleLanguageChange("hi")}
                    className={
                        selectedLanguage === "hi"
                            ? "bg-blue-600 text-white"
                            : ""
                    }
                >
                    हिंदी
                </Button>
                <Button
                    onClick={() => handleLanguageChange("pu")}
                    className={
                        selectedLanguage === "pu"
                            ? "bg-blue-600 text-white"
                            : ""
                    }
                >
                    ਪੰਜਾਬੀ
                </Button>
            </div>
        </div>
    );
}

export default Topbar;
