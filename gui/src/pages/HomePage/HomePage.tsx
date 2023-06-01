import { serviceQuery } from "@figurl/interface"
import { FunctionComponent, useEffect, useState } from "react"
import { SGSubject } from "../../types"
import SessionsTable from "./SessionsTable"

type Props = {
    width: number
    height: number
}

const HomePage: FunctionComponent<Props> = ({ width, height }) => {
    const [subjects, setSubjects] = useState<SGSubject[] | undefined>(undefined)
    useEffect(() => {
        let canceled = false
        setSubjects(undefined)
        ;(async () => {
            const resp = await serviceQuery('spyglass-explorer', {
                type: 'get_subjects',
                limit: 9999
            })
            if (canceled) return
            const subjects = resp.result.subjects as SGSubject[]
            setSubjects(subjects)
        })()
    }, [])
    return (
        <div>
            <SessionsTable
                subjects={subjects}
            />
        </div>
    )
}

export default HomePage