import { useAuthUser } from "@/hooks/useAuthUser";
import { useUsersTotalPoints } from "@/hooks/useUsersTotalPoints";
import { AppContextType } from "@/types";
import { createContext } from "react"

export const AppContext = createContext< AppContextType | null>(null);


const AppContextProvider = ({children}:{children:React.ReactNode}) => {

    const {totalPoints,isLoading:isPointsLoading,setTotalPoints} = useUsersTotalPoints();
    const {loggedInUser,setLoggedInUser,isLoading} = useAuthUser();
    
    if(isLoading || isPointsLoading) {
        return (
            <>
                Loading...
            </>
        )
    }

    return (
        <>
            <AppContext.Provider value={{
                setUsersTotalPoints:setTotalPoints,
                usersTotalPoints:totalPoints,
                loggedInUser:loggedInUser,
                setLoggedInUser:setLoggedInUser,
            }}>
                {children}
            </AppContext.Provider>
        </>
    )
}

export {
    AppContextProvider,
}