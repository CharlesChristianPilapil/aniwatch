import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <main className="container pb-20 pt-[calc(80px-72px)] md:pt-0 text-center min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4">
            <img 
                alt="image of saitama"
                src="/images/saitama.png"
                className="max-w-[300px]" 
            />
            <h2 className="text-2xl font-semibold">404 Error</h2>
            <p>Oh. Nothing here. Guess I’ll go home...</p>
            <Link
                to="/"
                className="bg-primary text-main rounded hover:text-secondary-accent focus:text-secondary-accent active:text-secondary-accent underline outline-secondary-accent"
            >
                Back to homepage
            </Link>
        </main>
    );
}
export default ErrorPage