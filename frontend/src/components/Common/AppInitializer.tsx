import { useDispatch } from "react-redux"
import { useLazyGetMeQuery } from "../../services/userServices";
import { useEffect } from "react";
import { setCredentials } from "../../slices/authSlice";

const AppInitializer = () => {
    const dispatch = useDispatch();
    const [getMe] = useLazyGetMeQuery();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getMe().unwrap();
                    if (res.success) {
                    dispatch(setCredentials(res.info));
                } else {
                    dispatch(setCredentials(null));
                }
            } catch {
                dispatch(setCredentials(null));
            }
        };
    
        checkAuth();
    }, [dispatch, getMe]);
    
    return null;
};

export default AppInitializer;