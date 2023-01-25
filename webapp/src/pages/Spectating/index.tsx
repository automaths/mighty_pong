import { useLocation } from "react-router-dom";
import { Fragment } from "react";
import SpectatePong from "./components/SpectatePong";

const Spectating = () => {

    const location = useLocation();



    return (
        <Fragment>
            <SpectatePong my_id={location?.state?.id_one} opp_id={location?.state?.id_two} nickname={location?.state?.player_one} player={2} opp_nickname={location?.state?.player_two}/>
        </Fragment>
    );
};

export default Spectating;