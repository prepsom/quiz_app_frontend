import React, { SetStateAction } from "react";

export type AppContextType = {
  loggedInUser: UserType | null;
  setLoggedInUser: React.Dispatch<SetStateAction<UserType | null>>;
  usersTotalPoints: number;
  setUsersTotalPoints: React.Dispatch<SetStateAction<number>>;
};

export type UserType = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: "TEACHER" | "STUDENT" | "ADMIN";
  createdAt: string;
  avatar: "MALE" | "FEMALE";
  gradeId: string;
  _count?: {
    UserLevelComplete: number;
  };
  phoneNumber?: string;
};

export type LoginResponse = {
  success: boolean;
  user: UserType;
};

export type RegisterResponse = {
  success: boolean;
  user: UserType;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SubjectType = {
  id: string;
  subjectName: string;
  gradeId: string;
};

export type LevelType = {
  id: string;
  levelName: string;
  levelDescription: string | null;
  subject?: SubjectType;
  position: number;
  subjectId: string;
  passingQuestions: number;
};

export type LevelWithMetaData = LevelType & {
  subject: SubjectType;
  totalPoints: number;
  noOfCorrectQuestions: number;
  strengths: string[];
  recommendations: string[];
  weaknesses: string[];
};

export type QuestionType = {
  id: string;
  questionType: "MCQ" | "MATCHING" | "FILL_IN_BLANK";
  questionTitle: string;
  questionHint: string | null;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  levelId: string;
  explanation: string;
  ready: boolean;
  MCQAnswers?: AnswerType[];
  MatchingPairs?: MatchingPairType[];
  BlankSegments?: BlankSegmentType[];
};

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionTypeType = "MCQ" | "MATCHING" | "FILL_IN_BLANK";

export type AnswerType = {
  id: string;
  value: string;
  questionId: string;
  isCorrect: boolean;
};

export type MatchingPairType = {
  id: string;
  leftItem: string;
  rightItem: string;
};

export type BlankSegmentType = {
  id: string;
  text: string;
  isBlank: boolean;
};

export type QuestionResponseType = {
  id: string;
  isCorrect: boolean;
  pointsEarned: number;
  responseTime: number;
  chosenAnswerId: string | null;
  responseData: any | null;
  questionId: string;
  responderId: string;
  createdAt: string;
};

export type LeaderBoardUsersType = {
  user: UserType;
  totalPoints: number;
};

export type LevelCompletionResponse = {
  success: boolean;
  message: string;
  noOfCorrectQuestions?: number;
  totalQuestions?: number;
  percentage?: number;
  isComplete?: boolean;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  remarks?: string;
  totalPointsEarnedInLevel?: number;
};

// New types for question response request body

export type BaseQuestionResponse = {
  questionId: string;
  timeTaken: number;
};

export type MCQResponse = BaseQuestionResponse & {
  type: "MCQ";
  selectedAnswerId: string;
};

export type FillInBlankResponse = BaseQuestionResponse & {
  type: "FILL_IN_BLANK";
  answers: { blankIndex: number; value: string }[];
};

export type MatchingResponse = BaseQuestionResponse & {
  type: "MATCHING";
  pairs: { leftItem: string; rightItem: string }[];
};

export type QuestionResponseRequestBody =
  | MCQResponse
  | FillInBlankResponse
  | MatchingResponse;

export type QuestionResponseData = {
  success: boolean;
  message: string;
  questionResponse: QuestionResponseType;
  correctData: {
    correctAnswerId?: string;
    correctAnswers?: Record<number, string[]>;
    correctPairs?: { leftItem: string; rightItem: string }[];
  };
};

export type School = {
  id: string;
  schoolName: string;
};

export type Grade = {
  id: string;
  grade: number;
  schoolId: string;
  _count?: {
    students: number;
  };
};

export type UserCompleteLevelType = {
  id: string;
  userId: string;
  levelId: string;
  level?: LevelType;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  totalPoints: number;
  noOfCorrectQuestions: number;
};

export type Notification = {
  id: string;
  message: string;
  gradeId: string;
  createdAt: string;
};

export type Chat = {
  id: string;
  title: string;
  userId: string;
  botId: string;
};

export type ChatMessage = {
  messageText: string;
  chatId: string;
  id: string;
  messageSenderId: string;
  messageReceiverId: string;
  messageCreatedAt: Date;
};
