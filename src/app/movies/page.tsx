export const metadata = {
    title: "Trakmymedia • Movies",
};

export default function Page() {
    // Placeholder
    return (
        <main className="mx-auto max-w-6xl px-4 py-10">
            <h1 className="text-2xl font-semibold">Movies</h1>
            <p className="mt-2 text-sm opacity-80">
                This is the Movies page. Your navbar link should no longer 404.
            </p>
            <div className="mt-6 rounded-xl border border-white/10 p-6">
                <p className="opacity-80">
                    Coming soon: search, filters, cards, and API results.
                </p>
            </div>
        </main>
    );
}
