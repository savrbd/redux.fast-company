import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getIsLoggedIn,
    getUsersLoadingStatus,
    loadUsersList
} from "../../../store/user";
import PropTypes from "prop-types";
import { loadQualitiesList } from "../../../store/qualities";
import { loadProfessionList } from "../../../store/profession";

const AppLoader = ({ children }) => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(getIsLoggedIn());
    const usersStatusLoading = useSelector(getUsersLoadingStatus());
    useEffect(() => {
        dispatch(loadQualitiesList());
        dispatch(loadProfessionList());
        if (isLoggedIn) {
            dispatch(loadUsersList());
        }
    }, [isLoggedIn]);
    if (usersStatusLoading) return "loading";
    return children;
};
AppLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default AppLoader;
