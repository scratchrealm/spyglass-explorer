import { serviceQuery } from "@figurl/interface";
import { FunctionComponent, useEffect, useState } from "react";
import TabWidget from "../../TabWidget/TabWidget";
import { SGSession } from "../../types";
import ElectrodeGroupsTable from "./ElectrodeGroupsTable";
import IntervalListsTable from "./IntervalListsTable";
import "./SessionPage.css"

type Props = {
    width: number
    height: number
    nwb_file_name: string
}

const tabs = [
    {id: 'main', label: 'Main', closeable: false},
    {id: 'electrode_groups', label: 'Electrode groups', closeable: false},
    {id: 'interval_lists', label: 'Interval lists', closeable: false}
]

const SessionPage: FunctionComponent<Props> = ({ width, height, nwb_file_name }) => {
    const [session, setSession] = useState<SGSession | undefined>(undefined)

    useEffect(() => {
        let canceled = false
        setSession(undefined)
        ;(async () => {
            const resp = await serviceQuery('spyglass-explorer', {
                type: 'get_sessions',
                limit: 1,
                nwb_file_name
            })
            if (canceled) return
            const sessions = resp.result.sessions as SGSession[]
            if (sessions.length === 0) {
                throw Error(`No session found with nwb_file_name=${nwb_file_name}`)
            }
            setSession(sessions[0])
        })()
        return () => {canceled = true}
    }, [nwb_file_name])

    const [currentTabId, setCurrentTabId] = useState<string>('main')

    const headingHeight = 80

    if (!session) return <div>Loading session...</div>
    return (
        <div style={{position: 'absolute', width, height}}>
            <div style={{position: 'absolute', left: 20, top: 20, width: width - 40, height: headingHeight}}>
                <h1>Session: {nwb_file_name}</h1>
            </div>
            <div style={{position: 'absolute', left: 20, width: width - 40, height: height - headingHeight - 40, top: 20 + headingHeight}}>
                <TabWidget
                    tabs={tabs}
                    width={width - 40}
                    height={height - headingHeight - 40}
                    currentTabId={currentTabId}
                    setCurrentTabId={setCurrentTabId}
                    onCloseTab={() => {}}
                >
                    <MainTab width={0} height={0} session={session} />
                    <ElectrodeGroupsTable nwb_file_name={nwb_file_name} width={0} height={0} />
                    <IntervalListsTable nwb_file_name={nwb_file_name} width={0} height={0} />
                </TabWidget>
            </div>
        </div>
    )
}

type MainTabProps = {
    width: number
    height: number
    session: SGSession
}

const MainTab: FunctionComponent<MainTabProps> = ({width, height, session}) => {
    return (
        <div style={{position: 'absolute', width, height, backgroundColor: 'white', overflowY: 'auto'}}>
            <div className="SessionTable">
                <table>
                    <tbody>
                        <tr>
                            <td>Session ID</td>
                            <td>{session.session_id}</td>
                        </tr>
                        <tr>
                            <td>NWB file name</td>
                            <td>{session.nwb_file_name}</td>
                        </tr>
                        <tr>
                            <td>Subject ID</td>
                            <td>{session.subject_id}</td>
                        </tr>
                        <tr>
                            <td>Institution</td>
                            <td>{session.institution_name}</td>
                        </tr>
                        <tr>
                            <td>Lab</td>
                            <td>{session.lab_name}</td>
                        </tr>
                        <tr>
                            <td>Start time</td>
                            <td>{session.session_start_time}</td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td>{session.session_description}</td>
                        </tr>
                        <tr>
                            <td>Experiment description</td>
                            <td>{session.experiment_description}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SessionPage