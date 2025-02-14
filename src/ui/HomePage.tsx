import InteractionSection from "@/shared/InteractionSection";
const HomePage = () => {
    return (
        <main className="h-[100vh] xl:gap-0 gap-20 flex flex-col items-center justify-between xl:py-10 pt-10">
            <section  className=" font-bold text-lg">VerseCatch</section>
            <section className="xl:w-1/2 space-y-4">
                <h1 className="text-center font-bold xl:text-3xl text-xl">Romans 8:28 (NIV)</h1>
                <p className="text-center xl:text-2xl text-xl px-8 xl:px-0">Consider it wholly joyful, my brethren, whenever you are enveloped in or encounter trials of any sort or fall into various temptations. Be assured and understand that the trial and proving of your faith bring out endurance and steadfastness and patience.</p>
            </section>
            <InteractionSection />
      </main>
  );
};

export default HomePage;
