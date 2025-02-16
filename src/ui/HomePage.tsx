import { useState } from 'react';
import InteractionSection from "@/shared/InteractionSection";

const HomePage = () => {
    const [receivedData, setReceivedData] = useState<string | null>(null);

    const parsedData = receivedData ? JSON.parse(receivedData)[0] : null;

    return (
        <main className="h-[100vh] xl:gap-0 gap-20 flex flex-col items-center justify-between xl:py-10 pt-10">
            <section className="font-bold text-lg">VerseCatch</section>
            <section className="xl:w-1/2 space-y-4">
                {parsedData ? (
                    <>
                        <h1 className="text-center font-bold xl:text-3xl text-xl">{`${parsedData.book} ${parsedData.chapter}:${parsedData.verse_number} (${parsedData.version})`}</h1>
                        <p className="text-center xl:text-2xl text-xl px-8 xl:px-0">{parsedData.text}</p>
                    </>
                ) : ""}
            </section>
            <InteractionSection setReceivedData={setReceivedData} />
        </main>
    );
};

export default HomePage;
