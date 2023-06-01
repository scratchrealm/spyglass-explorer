import { serviceQuery } from "@figurl/interface";
import { FunctionComponent, useEffect, useState } from "react";
import { SGElectrodeGroup } from "../../types";

type Props = {
    nwb_file_name: string
    width: number
    height: number
}

const ElectrodeGroupsTable: FunctionComponent<Props> = ({nwb_file_name, width, height}) => {
    const [electrodeGroups, setElectrodeGroups] = useState<SGElectrodeGroup[] | undefined>([])

    const [limit, setLimit] = useState<number>(5)
    const [hasMore, setHasMore] = useState<boolean>(false)
    useEffect(() => {
        setLimit(5)
    }, [nwb_file_name])

    useEffect(() => {
        let canceled = false
        setElectrodeGroups(undefined)
        ;(async () => {
            const q: {[k: string]: any} = {
                type: 'get_electrode_groups',
                limit,
                nwb_file_name
            }
            const resp = await serviceQuery('spyglass-explorer', q)
            if (canceled) return
            const electrodeGroups = resp.result.electrode_groups as SGElectrodeGroup[]
            setElectrodeGroups(electrodeGroups)
            setHasMore(resp.result.has_more)
        })()
        return () => {canceled = true}
    }, [limit])
    return (
        <div style={{position: 'absolute', width, height, backgroundColor: 'white', overflowY: 'auto'}}>
            <table className="scientific-table">
                <thead>
                    <tr>
                        <th>Electrode Group</th>
                        <th>Description</th>
                        <th>NWB</th>
                        <th>Probe</th>
                        <th>Region</th>
                        <th>Hemisphere</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (electrodeGroups || []).map(eg => (
                            // Sometimes session ID is not unique for some reason
                            <tr key={eg.electrode_group_name}>
                                <td>{eg.electrode_group_name}</td>
                                <td>{eg.description}</td>
                                <td>{eg.nwb_file_name}</td>
                                <td>{eg.probe_id}</td>
                                <td>{eg.region_id}</td>
                                <td>{eg.target_hemisphere}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {
                    hasMore && electrodeGroups && (
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
                !electrodeGroups && (
                    <div>Loading electrode groups...</div>
                )
            }
        </div>
    )
}

export default ElectrodeGroupsTable