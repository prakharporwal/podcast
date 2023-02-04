import { Outlet } from "react-router-dom";

const JoinPodCastPage = (props: any) => {
    return (
        <div className="grid place-items-center h-screen">
            <video></video>
            <></>
            <Outlet />
        </div>
    );
};

export default JoinPodCastPage;
