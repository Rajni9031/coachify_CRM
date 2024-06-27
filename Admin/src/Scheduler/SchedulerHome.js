import React, {useContext} from "react";
import Nav from "../SchedulerComponents/Nav"
import Scroll from "../SchedulerComponents/Scroll"
import Calender from "../SchedulerComponents/Calender"
import { DateContext } from '../SchedulerComponents/DateContext';

function SchedulerHome() {
    const { clickedDate } = useContext(DateContext);
    
    return (
        <div>
            <Nav />
            <div style={{ display: "flex" ,flexWrap: "wrap" }}>
            <Scroll style={{ display: "inline" }} showbar={true} showDemoClasses={true}/>
                <Calender style={{ marginTop: "-65vh", position: "absolute" }} />
                </div>
        </div>
    )
};

export default SchedulerHome;