import { startListeningToParent } from "@figurl/interface";
import { FunctionComponent } from "react";
import HomePage from "./pages/HomePage/HomePage";
import SessionPage from "./pages/SessionPage/SessionPage";
import useRoute from "./route";
import useWindowDimensions from "./useWindowDimensions";

const urlSearchParams = new URLSearchParams(window.location.search)
const queryParams = Object.fromEntries(urlSearchParams.entries())

const MainWindow: FunctionComponent = () => {
    const { width, height } = useWindowDimensions()
    const {route} = useRoute()
    return (
        route.page === 'home' ? (
            <HomePage
                width={width}
                height={height}
            />
        ) : route.page === 'session' ? (
            <SessionPage
                width={width}
                height={height}
                nwb_file_name={route.nwb_file_name}
            />
        ) : (
            <div>Unknown page: {JSON.stringify(route)}</div>
        )
    )
}

if (queryParams.figureId) {
    startListeningToParent()
}

export default MainWindow