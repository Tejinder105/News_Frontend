import React from "react";
import { Globe, Bot, Sparkle, Tag } from "lucide-react";
import Spinner from "../../Ui/Spinner";
import Button from "../../Ui/Button";

function ActionButtons({
  onTranslate,
  onAnalyze,
  onHeadlines,
  onTags,
  isAnalyzing,
  translating,
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Button
        variant="primary"
        onClick={onTranslate}
        disabled={translating}
        loading={translating}
        iconLeft={!translating && <Globe size={16} />}
      >
        {translating ? "Translating..." : "Translate all"}
      </Button>

      <Button
        variant="secondary"
        onClick={onAnalyze}
        disabled={isAnalyzing}
        loading={isAnalyzing}
        iconLeft={!isAnalyzing && <Bot size={16} />}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze"}
      </Button>

      <Button
        variant="success"
        onClick={onHeadlines}
        disabled={isAnalyzing}
        loading={isAnalyzing}
        iconLeft={!isAnalyzing && <Sparkle size={16} />}
      >
        Headline
      </Button>

      <Button
        variant="primary"
        onClick={onTags}
        disabled={isAnalyzing}
        loading={isAnalyzing}
        iconLeft={!isAnalyzing && <Tag size={16} />}
      >
        Tags
      </Button>
    </div>
  );
}

export default ActionButtons;
