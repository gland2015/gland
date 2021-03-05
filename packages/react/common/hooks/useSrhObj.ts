import React from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";

export function useSrhObj() {
    const location = useLocation();

    const srchObj = React.useMemo(() => {
        let s = (location.search + "").replace(/^\?/, "");
        return qs.parse(s);
    }, [location.search]);

    return srchObj;
}
