import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./useAuth";

const RequireAdminAuth = ({ children }) => {
    const auth = useAdminAuth();

    if(!auth.admin) {
        return <Navigate to='/admin-login' />
    }

    return children
}

export default RequireAdminAuth;