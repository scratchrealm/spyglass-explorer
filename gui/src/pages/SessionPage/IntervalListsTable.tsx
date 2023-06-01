import { serviceQuery } from "@figurl/interface";
import { FunctionComponent, useEffect, useState } from "react";
import { SGIntervalList } from "../../types";

type Props = {
    nwb_file_name: string
    width: number
    height: number
}

const IntervalListsTable: FunctionComponent<Props> = ({nwb_file_name, width, height}) => {
    const [intervalLists, setIntervalLists] = useState<SGIntervalList[] | undefined>([])

    const [limit, setLimit] = useState<number>(5)
    const [hasMore, setHasMore] = useState<boolean>(false)
    useEffect(() => {
        setLimit(5)
    }, [nwb_file_name])

    useEffect(() => {
        let canceled = false
        setIntervalLists(undefined)
        ;(async () => {
            const q: {[k: string]: any} = {
                type: 'get_interval_lists',
                limit,
                nwb_file_name
            }
            const resp = await serviceQuery('spyglass-explorer', q)
            if (canceled) return
            const intervalLists = resp.result.interval_lists as SGIntervalList[]
            setIntervalLists(intervalLists)
            setHasMore(resp.result.has_more)
        })()
        return () => {canceled = true}
    }, [limit])
    return (
        <div style={{position: 'absolute', width, height, backgroundColor: 'white', overflowY: 'auto'}}>
            <table className="scientific-table">
                <thead>
                    <tr>
                        <th>Interval list</th>
                        <th>NWB</th>
                        <th>Valid times</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (intervalLists || []).map(il => (
                            // Sometimes session ID is not unique for some reason
                            <tr key={il.interval_list_name}>
                                <td>{il.interval_list_name}</td>
                                <td>{il.nwb_file_name}</td>
                                <td><ValidTimesComponent valid_times={il.valid_times} /></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {
                    hasMore && intervalLists && (
                        <button
                            onClick={() => {
                                setLimit(limit + 15)
                            }}
                        >
                            View more
                        </button>
                    )
                }
            {
                !intervalLists && (
                    <div>Loading interval lists...</div>
                )
            }
        </div>
    )
}

type ValidTimesComponentProps = {
    valid_times: ([number, number])[]
}

const ValidTimesComponent: FunctionComponent<ValidTimesComponentProps> = ({valid_times}) => {
    const exceedsLimit = valid_times.length > 10
    const valid_times_truncated = exceedsLimit ? valid_times.slice(0, 10) : valid_times
    return (
        <span>
            {
                valid_times_truncated.map((vt, ii) => (
                    <span key={ii}>
                        {vt[0]} - {vt[1]}
                        {
                            (ii < valid_times.length - 1) && (
                                <span>, </span>
                            )
                        }
                    </span>
                ))
            }
            {
                exceedsLimit && (
                    <span>... ({valid_times.length} total)</span>
                )
            }
        </span>
    )
}

export default IntervalListsTable