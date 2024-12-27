import { SentimentAnalysisGetDto } from "./sentiment-analysis-get-dto";

  
  export interface ChatMessageGetDto {
    id: string;
    user: string;
    message: string;
    sentimentAnalysis: SentimentAnalysisGetDto;
    timestamp: string;
  }