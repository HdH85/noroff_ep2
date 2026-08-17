import LoginForm from "@/components/LoginForm";

export default function Login() {
    return (
        <div>
            <h1 className="text-center py-15 text-xl font-semibold text-cyan-900 mb-2">Sign in to your account</h1>
            <div>
                <LoginForm />
            </div>
        </div>
    );
};