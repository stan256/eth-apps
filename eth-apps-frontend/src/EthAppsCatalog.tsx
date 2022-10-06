import React, {FC} from "react";
import {Link} from "react-router-dom";



const EthAppsCatalog: FC = (props) => {
    return <div>
        <h2>All projects:</h2>
        <Link to='/voting-app'>Voting app</Link>
    </div>
}

export default EthAppsCatalog
