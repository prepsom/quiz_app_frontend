import React, { SetStateAction } from "react";



export type AppContextType = {
    loggedInUser:UserType | null;
    setLoggedInUser:React.Dispatch<SetStateAction<UserType | null>>;
    usersTotalPoints:number;
}


export type UserType = {
    id:string;
    emai:string;
    name:string;
    password:string;
    role:"TEACHER" | "STUDENT" | "ADMIN",
    createdAt:string;
    avatar:"MALE" | "FEMALE",
    gradeId:string;
}

export type LoginResponse = {
    success: boolean;
    user: UserType;
}

export type LoginRequest = {
    email: string;
    password: string;
}


export type SubjectType = {
    id:string;
    subjectName:string;
    gradeId:string;
}


export type LevelType = {
    id:string;
    levelName:string;
    levelDescription:string | null;
    position:number;
    subjectId:string;
}


export type QuestionType = {
    id:string;
    questionTitle:string;
    questionHint:string | null;
    difficulty:"EASY" | "MEDIUM" | "HARD",
    levelId:string;
    Answers?:AnswerType[];
}

export type AnswerType = {
    id:string;
    value:string;
    questionId:string;
    isCorrect:boolean;
}



export type QuestionResponseType = {
    id:string;
    questionId:string;
    responderId:string;
    chosenAnswerId:string;
    pointsEarned:number;
    isCorrect:boolean;
    responseTime:number;
    createdAt:string;
}

export type LeaderBoardUsersType = {
    user:UserType,
    totalPoints:number;
}