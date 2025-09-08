import PageTitle from "../components/PageTitle";

const Fallback = ({ error }: { error: Error }) => {
    if (import.meta.env.MODE === 'production') {
        console.error(error);
    }
    return (
        <>
            <PageTitle title="Connection lost" />
            <main className="container pb-20 pt-[calc(80px-72px)] md:pt-0 text-center min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4">
                <img 
                    alt="image of saitama"
                    src="/images/saitama.png"
                    className="max-w-[300px]" 
                />
                <h2 className="text-2xl font-semibold">Something went wrong</h2>
                <p>CConnection lost, likely from an update. Refresh to continue.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-primary text-main rounded hover:text-secondary-accent focus:text-secondary-accent active:text-secondary-accent underline outline-secondary-accent"
                >
                    Refresh page
                </button>
            </main>
        </>
    )
}

export default Fallback