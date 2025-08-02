import React from 'react'
import { BUTTON_CLASS } from '../../../Constants/Languages'
import { Globe ,Bot,Sparkle,Tag} from 'lucide-react'
import Spinner from '../../Ui/Spinner'

function ActionButtons({ 
  onTranslate, 
  onAnalyze, 
  onHeadlines, 
  onTags, 
  isAnalyzing, 
  translating 
}) {
  return (
  <div className="mb-6 flex flex-wrap gap-2">
    <Button
      variant="primary"
      onClick={onTranslate}
      disabled={translating}
      icon={translating ? <Spinner /> : <Globe size={16} />}
    >
      {translating ? "Translating..." : "Translate all"}
    </Button>
    
    <Button
      variant="secondary"
      onClick={onAnalyze}
      disabled={isAnalyzing}
      icon={isAnalyzing ? <Spinner /> : <Bot size={16} />}
    >
      {isAnalyzing ? "Analyzing..." : "Analyze"}
    </Button>
    
    <Button
      variant="accent"
      onClick={onHeadlines}
      disabled={isAnalyzing}
      icon={isAnalyzing ? <Spinner /> : <Sparkle size={16} />}
    >
      Headline
    </Button>
    
    <Button
      variant="success"
      onClick={onTags}
      disabled={isAnalyzing}
      icon={isAnalyzing ? <Spinner /> : <Tag size={16} />}
    >
      Tags
    </Button>
  </div>
)


}

export default ActionButtons