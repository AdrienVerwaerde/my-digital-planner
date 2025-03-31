
import { useEffect, useState } from "react"
import dayjs from "dayjs"

export const useFormattedDate = (date: string | Date) => {
    const [formatted, setFormatted] = useState("")

    useEffect(() => {
        const formattedDate = dayjs(date)
            .format("dddd DD/MM")
            .replace(/^\w/, c => c.toUpperCase())
        setFormatted(formattedDate)
    }, [date])

    return formatted
}
