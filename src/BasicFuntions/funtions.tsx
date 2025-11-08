import { useNavigate } from "react-router-dom";

export default function useRedirect() {
    const navigate = useNavigate();

    const goToRegister = () => {
        navigate('/register');
    };

    const goToLogin = () => {
        navigate('/login');
    };

    const goToHome = () => {
        navigate('/');
    };

    return { goToRegister, goToLogin, goToHome };
}
