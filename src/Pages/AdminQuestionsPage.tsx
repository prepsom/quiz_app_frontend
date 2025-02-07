


import { API_URL } from '@/App';
import AdminFillInBlankQuestionCard from '@/components/AdminFillInBlankQuestionCard';
import AdminMatchingQuestionCard from '@/components/AdminMatchingQuestionCard';
import AdminMcqQuestionCard from '@/components/AdminMcqQuestionCard';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem,SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AppContext } from '@/Context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useGetLevelById } from '@/hooks/useGetLevelById';
import { useQuestionsByLevel } from '@/hooks/useQuestionsByLevel';
import { AppContextType, QuestionDifficulty, QuestionType, QuestionTypeType } from '@/types';
import axios from 'axios';
import { ArrowLeft, Loader, TrashIcon } from 'lucide-react';
import { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

const QUESTIONS_PER_PAGE=10;
const QUESTION_TYPES = ["MCQ","FILL_IN_BLANK","MATCHING"];
const AVAILABLE_QUESTION_TYPES = ["MCQ"];
const QUESTION_DIFFICULTIES = ["EASY","MEDIUM","HARD"];
const QUESTION_STATUS = ["READY","NOT_READY"];

const AdminQuestionsPage = () => {

    const {toast} = useToast();
    const {levelId} = useParams<{levelId:string}>();
    const [page,setPage] = useState<number>(1);
    const [filterByDifficulty,setFilterByDifficulty] = useState<string>("ALL");
    const [filterByQuestionType,setFilterByQuestionType] = useState<string>("ALL");
    const [filterByStatus,setFilterByStatus] = useState<string>("ALL");
    const [searchByTitle,setSearchByTitle] = useState<string>("");
    const [searchByTitleText,setSearchByTitleText] = useState<string>("");
    const {level,isLoading:isLevelLoading} = useGetLevelById(levelId!);
    const [isAddQuestionModalOpen,setIsAddQuestionModalOpen] = useState<boolean>(false);
    
    const [questionTitle,setQuestionTitle] = useState<string>("");
    const [questionExplanation,setQuestionExplanation] = useState<string>("");
    const [questionDifficulty,setQuestionDifficulty] = useState<string>("EASY");
    const [questionType,setQuestionType] = useState<string>("MCQ");
    const [isAddingQuestion,setIsAddingQuestion] = useState<boolean>(false);
    const [isAddMcqAnswerModalOpenForQuestion,setIsAddMcqAnswerModalOpenForQuestion] = useState<{question:QuestionType | null;isOpen:boolean}>({question:null,isOpen:false});
    const [mcqAnswers,setMcqAnswers] = useState<{value:string;isCorrect:boolean}[]>([]);
    const [mcqAnswerValue,setMcqAnswerValue] = useState<string>("");
    const [mcqAnswerCorrect,setMcqAnswerCorrect] = useState<boolean>(false);
    const [isAddingMcqAnswers,setIsAddingMcqAnswers] = useState<boolean>(false);
    const {questions,setQuestions,isLoading:isQuestionsLoading,totalPages} = useQuestionsByLevel(
        levelId!,
        page,
        QUESTIONS_PER_PAGE,
        filterByDifficulty==="ALL" ? undefined : filterByDifficulty as QuestionDifficulty,
        filterByQuestionType==="ALL" ? undefined : filterByQuestionType as QuestionTypeType,    
        searchByTitle.trim()==="" ? undefined : searchByTitle,
        filterByStatus==="ALL" ? undefined : filterByStatus==="READY" ? true : false,
    );
    const {loggedInUser} = useContext(AppContext) as AppContextType;
    const role = loggedInUser?.role==="ADMIN" ? "admin" : loggedInUser?.role==="TEACHER" ? "teacher" : "student";
    if(role==="student") return <Navigate to="/"/>

    const questionsCount = questions.length;

    const handleQuestionSearch = () => {
        setSearchByTitle(searchByTitleText);
    }

    const handleClearSearch = () => {
        setSearchByTitleText("");
        setSearchByTitle("");
    }

    const isAddQuestionButtonDisabled = () => {

        if(questionTitle.trim()==="" || questionExplanation.trim()==="") {
            return true;
        }
        return false;
    }

    const handleAddQuestion = async () => {
        type BaseQuestionRequestBody = {
            difficulty: QuestionDifficulty;
            levelId: string;  
            questionTitle: string;
            explanation: string;
            questionType: QuestionTypeType;
          };
        try {
            setIsAddingQuestion(true);
            const response = await axios.post<{success:boolean;data:QuestionType}>(`${API_URL}/question` , {
                questionTitle:questionTitle.trim(),
                difficulty:questionDifficulty as QuestionDifficulty,
                explanation:questionExplanation.trim(),
                questionType:questionType as QuestionTypeType,
                levelId:level?.id!,
            } as BaseQuestionRequestBody , {
                withCredentials:true,
            });
            setQuestions((prevQuestions) => [...prevQuestions,response.data.data]);
            setQuestionTitle("");
            setQuestionExplanation("");
            setQuestionDifficulty("EASY");
            setQuestionType("MCQ");
            setIsAddQuestionModalOpen(false);
            toast({
                title:"Question added successfully",
                description:"The question has been added successfully",
                variant:"default",
            });

            // mcq question added , but need to add answers for mcq question
            if(response.data.data.questionType==="MCQ") {
                setIsAddMcqAnswerModalOpenForQuestion({question:response.data.data,isOpen:true});
            }

        } catch (error) {
            toast({
                title:"Error adding question",
                description:"An error occurred while adding the question",
                variant:"destructive",
            });
        } finally {
            setIsAddingQuestion(false);
        }
    }

    const handleAddAnswerOpenChange = () => {
        setIsAddMcqAnswerModalOpenForQuestion({question:null,isOpen:false});
    }

    const handleAddMcqAnswers = async () => {
        type CreateMcqAnswerRequestBody = {
            value: string;
            questionId: string;
            isCorrect: boolean;
        } & {
            type:"MCQ",
        }
        // go through the mcq answers array and add each answer to the question
        try {

            setIsAddingMcqAnswers(true);

            await Promise.all(mcqAnswers.map(async (mcqAnswer) => {

                await axios.post<{success:boolean;answer:{id:string;questionId:string;value:string;isCorrect:boolean}}>(`${API_URL}/answer`,{
                    value:mcqAnswer.value,
                    isCorrect:mcqAnswer.isCorrect,
                    questionId:isAddMcqAnswerModalOpenForQuestion.question?.id!,
                    type:isAddMcqAnswerModalOpenForQuestion.question?.questionType!,
                } as CreateMcqAnswerRequestBody,{
                    withCredentials:true,
                });

            }));

            toast({
                title:"Answers added successfully",
                description:"The answers have been added successfully",
                variant:"default",
            });

            setIsAddMcqAnswerModalOpenForQuestion({question:null,isOpen:false});
            setMcqAnswers([]);
            window.location.reload();
        } catch (error) {
            toast({
                title:"Error adding answers",
                description:"An error occurred while adding the answers",
                variant:"destructive",
            });
        } finally {
            setIsAddingMcqAnswers(false);
        }
    }

    const isMcqAnswersValid = () => {
        // for the mcq options to be valid
        // options.length should be 4
        // there should be only one correct option 
        if(mcqAnswers.length < 4) {
            return false;
        }
        const correctMcqOptions=  mcqAnswers.filter((answer) => answer.isCorrect===true);
        if(correctMcqOptions.length!==1) return false;

        return true;

    }

    const handleMcqCorrectAnswerChange = (index:number) => {

        // as only one answer can be correct
        // check if any answer is alreyady correct if yes then make it false
        // if no answer is correct then make the current answer correct 
        // check for correct answer
        const correctAnswerIndex = mcqAnswers.findIndex((answer) => answer.isCorrect===true);

        if(correctAnswerIndex!==-1) {
            setMcqAnswers((prevMcqAnswers) => {
                const updatedMcqAnswers = prevMcqAnswers.map((mcqAnswer,index) => {
                    if(index===correctAnswerIndex) {
                        return {
                            ...mcqAnswer,
                            isCorrect:false,
                        }
                    } else {
                        return mcqAnswer;
                    }
                });
                
                return updatedMcqAnswers;
            });
            if(index===correctAnswerIndex) {
                return;
            }
        }


        setMcqAnswers((prevMcqAnswers) => {
            const updatedMcqAnswers = prevMcqAnswers.map((answer,i) => {
                if(i===index) {
                    if(answer.isCorrect) {
                        return {
                            ...answer,
                            isCorrect:false,
                        }
                    } else {
                        return {
                            ...answer,
                            isCorrect:true,
                        }
                    }
                } else {
                    return answer;
                }
            });
            return updatedMcqAnswers;
        });
    }

    const handleMcqAnswerDelete = (index:number) => {
        const newMcqAnswers = mcqAnswers.filter((_,i) => i!==index);
        setMcqAnswers(newMcqAnswers);
    }

    const handleAddMcqAnswer = () => {
        
        // if the answer adding is correct then check if any answer is already correct , if yes then make it false
        if(mcqAnswerCorrect) {

            const correctAnswerIndex = mcqAnswers.findIndex((mcqAnswer) => mcqAnswer.isCorrect===true);

            if(correctAnswerIndex!==-1) {
                setMcqAnswers((prevMcqAnswers) => {

                    const updatedMcqAnswers = prevMcqAnswers.map((mcqAnswer,index) => {
                        if(index===correctAnswerIndex) {
                            return {
                                ...mcqAnswer,
                                isCorrect:false,
                            }
                        } else {
                            return mcqAnswer;
                        }
                    });
                    
                    return updatedMcqAnswers;
                });
            }
        }


        setMcqAnswers((prevMcqAnswers) => [...prevMcqAnswers , {
            value:mcqAnswerValue.trim(),
            isCorrect:mcqAnswerCorrect,
        }]);
        setMcqAnswerValue("");
        setMcqAnswerCorrect(false);
    }


    useEffect(() => setPage(1) , [searchByTitle,filterByDifficulty,filterByQuestionType,filterByStatus]);


    if(isQuestionsLoading || isLevelLoading) {
        return (
            <>
                <div className='flex items-center justify-center mt-28'>
                    <Loader/>
                </div>
            </>
        )
    }

    if(!level) {
        return (
            <>
                <div className='flex items-center justify-center mt-28'>
                    Level not found
                </div>
            </>
        )
    }
    // filter by ready or not ready
    // filter by question type
    // filter by difficulty
    // search by title

  return (
    <>
        <div className='flex flex-col items-center w-full bg-[#ecfbff] min-h-screen'>
            <div className='flex items-center justify-start w-full px-8 mt-14'>
                <Link className='flex items-center gap-2 text-blue-500 font-semibold hover:text-blue-600 hover:duration-300' to={`/${role}/levels/${level.subjectId}`}>
                    <ArrowLeft/>
                    Back to levels
                </Link>
            </div>
            <div className='flex flex-col  w-full px-8'>
                <h1 className='text-blue-500 font-semibold text-xl'>Questions for {level.levelName}</h1>
                <p className='text-gray-600 text-md font-semibold'>
                    Create, delete and edit questions for this level
                </p>
            </div>

            <div className='flex items-center justify-start w-full px-8 text-gray-600 text-md my-4'>
                Results {questionsCount}
            </div>
            <div className='flex items-center justify-center w-full px-8'>
                <div className='flex flex-col items-center justify-center gap-2'>
                    <Input type='text' placeholder='search by title' value={searchByTitleText} onChange={(e) => setSearchByTitleText(e.target.value)}/>
                    <div className='flex items-center justify-center gap-2'>
                       <Button onClick={handleQuestionSearch} className='bg-blue-500 text-white hover:bg-blue-600 hover:duration-300'>Search</Button>
                       <Button onClick={handleClearSearch} className='bg-blue-500 text-white hover:bg-blue-600 hover:duration-300'>Clear</Button>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-start w-full px-8 mt-4'>
                <Button onClick={() => setIsAddQuestionModalOpen(true)} className='bg-blue-500 text-white hover:bg-blue-600 hover:duration-300'>Add Question</Button>
            </div>
            <div className='flex items-center w-full py-4 px-8 rounded-lg mx-8 flex-wrap gap-2'>
                <div className='bg-white'>
                    <Select value={filterByDifficulty} onValueChange={setFilterByDifficulty}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by difficulty"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='ALL'>All</SelectItem>
                            {QUESTION_DIFFICULTIES.map((difficulty) => {
                                return <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div className='bg-white'>
                    <Select value={filterByQuestionType} onValueChange={setFilterByQuestionType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by question type"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='ALL'>All</SelectItem>
                            {QUESTION_TYPES.map((questionType) => {
                                return <SelectItem key={questionType} value={questionType}>{questionType}</SelectItem>
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div className='bg-white'>
                    <Select value={filterByStatus} onValueChange={setFilterByStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='ALL'>All</SelectItem>
                            {QUESTION_STATUS.map((status) => {
                                return <SelectItem key={status} value={status}>{status}</SelectItem>
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='flex flex-col items-center w-full px-8 gap-2'>
                {questions.map((question:QuestionType) => {

                    switch(question.questionType) {
                        case "MCQ":
                            return <AdminMcqQuestionCard setMcqAnswers={setMcqAnswers} setIsAddMcqAnswerModalOpenForQuestion={setIsAddMcqAnswerModalOpenForQuestion} key={question.id} question={question} searchByTitle={searchByTitle.trim()==="" ? undefined : searchByTitle} setQuestions={setQuestions}/>
                            break;
                        case "FILL_IN_BLANK":
                            return <AdminFillInBlankQuestionCard key={question.id} question={question}/>
                            break;
                        case "MATCHING":
                            return <AdminMatchingQuestionCard key={question.id} question={question}/>
                            break;
                        default:
                            return <div>error question type</div>
                    }
                })}
                {questions.length===0 && (
                    <>
                        <div className='flex items-center justify-center w-full text-gray-600 font-semibold text-lg'>
                            No Questions found
                        </div>
                    </>
                )}
            </div>
            <div className='flex items-center justify-center w-full px-8 pb-20 my-4'>
                {totalPages && totalPages > 1 && (
                    <>
                        <Pagination currentPage={page} noOfPages={totalPages} setCurrentPage={setPage}/>
                    </>
                )}
            </div>
            <Dialog open={isAddQuestionModalOpen} onOpenChange={setIsAddQuestionModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Question</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col items-center justify-center w-full gap-4'>
                        <div className='flex flex-col items-start w-full justify-center gap-2'>
                            <Label htmlFor='questionTitle'>Question Title</Label>
                            <Input type='text' id='questionTitle' value={questionTitle} onChange={(e) => setQuestionTitle(e.target.value)}/>
                        </div>
                        <div className='flex flex-col items-start w-full justify-center gap-2'>
                            <Label htmlFor='questionDifficulty'>Question Difficulty</Label>
                            <Select value={questionDifficulty} onValueChange={setQuestionDifficulty}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Difficulty'/>
                                </SelectTrigger>
                                <SelectContent>
                                    {QUESTION_DIFFICULTIES.map((difficulty) => {
                                        return <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex flex-col items-start w-full justify-center gap-2'>
                            <Label htmlFor='questionType'>Question Type</Label>
                            <Select value={questionType} onValueChange={setQuestionType}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Question Type'/>
                                </SelectTrigger>
                                <SelectContent>
                                    {QUESTION_TYPES.map((questionType) => {
                                        return <SelectItem disabled={!AVAILABLE_QUESTION_TYPES.includes(questionType)} key={questionType} value={questionType}>{questionType}</SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex flex-col items-start w-full justify-center gap-2'> 
                            <Label htmlFor='questionExplanation'>Question Explanation</Label>
                            <Textarea id='questionExplanation' value={questionExplanation} onChange={(e) => setQuestionExplanation(e.target.value)}/>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={isAddingQuestion} variant={"outline"}>Cancel</Button>
                        </DialogClose>
                        <Button disabled={isAddQuestionButtonDisabled() || isAddingQuestion} onClick={handleAddQuestion}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isAddMcqAnswerModalOpenForQuestion.isOpen} onOpenChange={handleAddAnswerOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Answers for Question</DialogTitle>
                        <DialogDescription asChild >
                            <div className='flex flex-col items-start justify-center w-full gap-2'>
                                <div className='flex flex-wrap'>Question Title: {isAddMcqAnswerModalOpenForQuestion.question?.questionTitle}</div>
                                <div className='flex flex-wrap text-sm text-gray-700'>Explanation:{isAddMcqAnswerModalOpenForQuestion.question?.explanation}</div>
                                <div className='text-gray-700 font-semibold'>Difficulty: {isAddMcqAnswerModalOpenForQuestion.question?.difficulty}</div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>

                    <div className='flex flex-col items-start justify-center w-full gap-2'>
                        {mcqAnswers.map((answer,index) => {
                            return <div key={index} className='flex items-center justify-between w-full gap-2 p-4 border rounded-lg'>
                                <span className='text-gray-700 font-semibold'>{answer.value}</span>                                
                                <div className='flex items-center gap-4'>
                                    <TrashIcon onClick={() => handleMcqAnswerDelete(index)} className='text-red-500 cursor-pointer'/>
                                    <Checkbox checked={answer.isCorrect} onCheckedChange={() => handleMcqCorrectAnswerChange(index)}/>
                                </div>
                            </div>
                        })}
                    </div>
                    {mcqAnswers.length < 4 && <div className='flex flex-col justify-center w-full gap-2'>
                        <Input value={mcqAnswerValue} onChange={(e) => setMcqAnswerValue(e.target.value)} type='text' placeholder='Add Answer'/>
                        <div className='flex items-center justify-start gap-2'>
                            <Checkbox checked={mcqAnswerCorrect} onCheckedChange={() => setMcqAnswerCorrect(!mcqAnswerCorrect)}/>
                            <div>Correct Answer</div>
                        </div>
                        <div className='flex items-center w-full justify-end'>
                            <Button variant={"outline"} onClick={handleAddMcqAnswer}>Add Answer</Button>
                        </div>
                    </div>}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={isAddingMcqAnswers} variant={"outline"}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleAddMcqAnswers} disabled={!isMcqAnswersValid() || isAddingMcqAnswers}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </>
  );
}

export default AdminQuestionsPage;


/*
type BaseQuestionRequestBody = {
  difficulty: Difficulty;
  levelId: string; - 
  questionTitle: string;
  explanation: string;
  questionType: QuestionType;
};
*/