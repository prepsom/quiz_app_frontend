import { useEffect, useState } from "react"


export const useDebounce = (value:string,milliseconds:number) => {
    const [debouncedValue,setDebouncedValue] = useState<string>("");

    useEffect(() => {

        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        },milliseconds)

        return () => clearTimeout(timeout);
    },[value,milliseconds]);

    return debouncedValue;
}