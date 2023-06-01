import { serviceQuery } from "@figurl/interface";
import { FunctionComponent, useEffect, useState } from "react";
import Hyperlink from "../../components/Hyperlink";
import useRoute from "../../route";
import { SGSession, SGSubject } from "../../types";

type Props = {
    subjects?: SGSubject[]
}

type SessionsFilter = {
    session_id?: string
    subject_id?: string
}

const SessionsTable: FunctionComponent<Props> = ({subjects}) => {
    const [filter, setFilter] = useState<SessionsFilter>({})
    const [sessions, setSessions] = useState<SGSession[] | undefined>([])
    const [limit, setLimit] = useState<number>(5)
    const [hasMore, setHasMore] = useState<boolean>(false)
    useEffect(() => {
        setLimit(5)
    }, [filter])
    useEffect(() => {
        let canceled = false
        setSessions(undefined)
        ;(async () => {
            const q: {[k: string]: any} = {
                type: 'get_sessions',
                limit
            }
            if (filter.session_id) q.session_id = filter.session_id
            if (filter.subject_id) q.subject_id = filter.subject_id
            const resp = await serviceQuery('spyglass-explorer', q)
            if (canceled) return
            const sessions = resp.result.sessions as SGSession[]
            setSessions(sessions)
            setHasMore(resp.result.has_more)
        })()
        return () => {canceled = true}
    }, [filter, limit])
    const {setRoute} = useRoute()
    return (
        <div>
            <SessionFilterSelector filter={filter} setFilter={setFilter} subjects={subjects} />
            <div>
                <table className="scientific-table">
                    <thead>
                        <tr>
                            <th>Session</th>
                            <th>NWB</th>
                            <th>Subject</th>
                            <th>Institution</th>
                            <th>Lab</th>
                            <th>Start</th>
                            <th>Description</th>
                            <th>Experiment description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (sessions || []).map(s => (
                                // Sometimes session ID is not unique for some reason
                                <tr key={s.nwb_file_name}> 
                                    <td>{s.session_id}</td>
                                    <td>
                                        <Hyperlink onClick={() => setRoute({page: 'session', nwb_file_name: s.nwb_file_name})}>
                                            {s.nwb_file_name}
                                        </Hyperlink>
                                    </td>
                                    <td>{s.subject_id}</td>
                                    <td>{s.institution_name}</td>
                                    <td>{s.lab_name}</td>
                                    <td>{formatDate(s.session_start_time)}</td>
                                    <td>{s.session_description}</td>
                                    <td>{s.experiment_description}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    hasMore && sessions && (
                        <button
                            onClick={() => {
                                setLimit(limit + 15)
                            }}
                        >
                            View more
                        </button>
                    )
                }
            </div>
            {
                !sessions && (
                    <div>Loading sessions...</div>
                )
            }
        </div>
    )
}

type SessionFilterSelectorProps = {
    filter: SessionsFilter
    setFilter: (filter: SessionsFilter) => void
    subjects?: SGSubject[]
}

const SessionFilterSelector: FunctionComponent<SessionFilterSelectorProps> = ({ filter, setFilter, subjects }) => {
    const [internalFilter, setInternalFilter] = useState<SessionsFilter>({})
    useEffect(() => {
        setInternalFilter(filter)
    }, [filter])
    return (
        <div>
            <input
                type="text"
                value={internalFilter.session_id || ''}
                onChange={evt => {
                    setInternalFilter({
                        ...internalFilter,
                        session_id: evt.target.value
                    })
                }}
                placeholder="Session ID"
            />
            {/* Subject */}
            <select
                value={internalFilter.subject_id || ''}
                onChange={evt => {
                    setInternalFilter({
                        ...internalFilter,
                        subject_id: evt.target.value
                    })
                }}
            >
                <option key="_all_" value="">All subjects</option>
                {
                    subjects?.map(s => (
                        <option key={s.subject_id} value={s.subject_id}>{s.subject_id}</option>
                    ))
                }
            </select>
            {/* Submit button */}
            <button
                onClick={() => {
                    setFilter(internalFilter)
                }}
            >
                Filter
            </button>
        </div>
    )
}

const formatDate = (timestampSec: number) => {
    const d = new Date(timestampSec * 1000)
    return d.toLocaleString()
}

export default SessionsTable