import { useUrlState } from "@figurl/interface"
import { useCallback, useMemo } from "react"

export type Route = {
    page: 'home'
} | {
    page: 'session'
    nwb_file_name: string
}
const useRoute = () => {
    const {urlState, updateUrlState} = useUrlState()
    const route: Route = useMemo(() => {
        if ((!urlState) || (!urlState.route)) {
            return {
                page: 'home'
            }
        }
        if (urlState.route.page === 'session') {
            return {
                page: 'session',
                nwb_file_name: urlState.route.nwb_file_name
            }
        }
        else {
            return {
                page: 'home'
            }
        }
    }, [urlState])

    const setRoute = useCallback((r: Route) => {
        updateUrlState({route: r})
    }, [updateUrlState])

    return {
        route,
        setRoute
    }    
}

export default useRoute