const SUPPORTERS = [
  {
    name: "DPIIT India",
    description:
      "Recognized startup under the Department for Promotion of Industry and Internal Trade, Government of India.",
    url: "https://dpiit.gov.in",
  },
  {
    name: "Startup Bihar",
    description:
      "Incubated and supported by the Startup Bihar initiative under the Government of Bihar.",
    url: "https://startupbihar.in",
  },
  {
    name: "IIT Patna",
    description:
      "Incubated at the Indian Institute of Technology Patna — one of India's premier technical institutions.",
    url: "https://iitp.ac.in",
  },
];

export default function IncubationTrust() {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col px-6 py-12 sm:py-14">
      <h2 className="text-center font-semibold text-4xl tracking-tight sm:text-5xl">
        Supported &amp; {" "}
        <span className="text-primary">
          incubated {" "}
        </span>
        by
      </h2>
      <p className="mt-3 text-center text-muted-foreground text-xl sm:text-xl">
        Backed by institutions that shape India's startup ecosystem.
      </p>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPORTERS.map((supporter) => (
          <div
            className="relative flex rounded-lg flex-col items-start overflow-hidden border bg-card"
            key={supporter.name}
          >
            {/* Crosshatch dashed overlay */}
            <div className="absolute inset-x-0 top-7 h-9.5 border-y border-dashed bg-muted/30" />
            <div className="absolute inset-y-0 left-7 w-9.5 border-x border-dashed bg-muted/30" />

            <div className="relative isolate flex items-start justify-between gap-5 p-6">
              {/* Logo via Google favicon */}
              <div className="w-fit shrink-0 rounded-3xl bg-transparent p-1">
                <div className="relative border bg-background">
                  <img
                    alt={supporter.name}
                    className="absolute inset-0 size-9 blur-[36px]"
                    src={supporter.name != "IIT Patna" ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(supporter.url)}&sz=64` : "https://upload.wikimedia.org/wikipedia/en/5/52/Indian_Institute_of_Technology%2C_Patna.svg"}
                  />
                  <img
                    alt={supporter.name}
                    className="size-9"
                    src={supporter.name != "IIT Patna" ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(supporter.url)}&sz=64` : "https://upload.wikimedia.org/wikipedia/en/5/52/Indian_Institute_of_Technology%2C_Patna.svg"}
                  />
                </div>
              </div>

              <div>
                <h3 className="py-2 font-semibold text-xl">{supporter.name}</h3>
                <p className="mt-4 mb-2 text-pretty text-muted-foreground tracking-normal">
                  {supporter.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}