export default function HeroPanel() {
  return (
    <section className="relative flex-6 overflow-hidden rounded-3xl bg-primary text-background">
      <div
        className="pointer-events-none absolute -top-24 right-15 size-100 rounded-full bg-linear-to-b from-background/30 to-transparent"
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-8 size-75 rounded-full bg-linear-to-t from-background/30 to-transparent"
      />
      <div className="relative z-10 h-full p-12 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-5xl font-black tracking-wide leading-none">
            Kawaii Count
          </h2>
          <p>
            Your cutesy inventory manager!
          </p>
        </div>
        <div className="flex flex-col gap-10">
          <h1 className="text-6xl font-bold">
            The best way to manage your <span className="font-serif font-black"> food business.</span>
          </h1>
          <p className="font-sans font-medium text-2xl">
            From pantry to plate, our application ensures that everything’s kawaii in order!
          </p>
        </div>
      </div>
    </section>  
  );
}