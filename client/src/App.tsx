import { useQuery } from "@tanstack/react-query";
import { postsQueryOptions } from "./router/queryClient";

function App() {
  const { data: posts } = useQuery(postsQueryOptions());

  console.log(posts);

  return (
    <main>
      <h1 className="text-3xl text-center font-bold underline">Hello world!</h1>

      <section className="font-inter bg-surface-dim text-on-surface p-8 mt-6 space-y-6">
        <h2 className="text-headline-xl">Practitioner Booking</h2>
        <p className="text-body-lg text-on-surface-variant">
          Your vitals remain within healthy range limits.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-surface-container-low shadow-elevation-1 rounded-xl p-4">
            <p className="text-label-md text-on-surface-variant">Tier 1</p>
            <p className="text-headline-sm">Content well</p>
          </div>
          <div className="bg-surface-container shadow-elevation-2 rounded-xl p-4">
            <p className="text-label-md text-on-surface-variant">Tier 2</p>
            <p className="text-headline-sm">Dr. Vincent Ramirez, MD</p>
          </div>
          <div className="bg-surface-container-high shadow-elevation-3 rounded-xl p-4">
            <p className="text-label-md text-on-surface-variant">Tier 3</p>
            <p className="text-headline-sm">Floating modal</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="bg-primary-container text-on-primary-container text-label-lg rounded-lg px-4 py-2">
            CONFIRM APPOINTMENT
          </button>
          <button className="bg-secondary text-on-secondary text-label-lg rounded-lg px-4 py-2">
            View telemetry
          </button>
          <span className="text-success text-label-md rounded-sm bg-surface-highest px-2 py-1">
            OK
          </span>
          <span className="text-info text-label-md rounded-sm bg-surface-highest px-2 py-1">
            SYS
          </span>
          <span className="text-warning text-label-md rounded-sm bg-surface-highest px-2 py-1">
            WARN
          </span>
          <span className="text-error text-label-md rounded-sm bg-surface-highest px-2 py-1">
            URGENT
          </span>
        </div>

        <p className="font-code text-code-sm text-secondary">
          MRN: #9928-AX-00219 // HL7_V2_ACK
        </p>
      </section>
    </main>
  );
}

export default App;
