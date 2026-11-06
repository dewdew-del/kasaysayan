export const ISSUES_URL = "https://github.com/dewdew-del/kasaysayan/issues";

const RULES: [string, string][] = [
  ["Sourced or left out", "Every event cites sources that were actually opened and read. An event that can't be verified is not published."],
  ["Two sources when contested", "Martial Law, EDSA, the wars and other debated events need at least two independent sources."],
  ["Disagreements are shown", "When sources differ on a date, place or number, the page says so and names who says what."],
  ["Wikipedia is a starting point", "It can point to sources, but it is never cited as one."],
  ["Free photos only", "Public domain or Creative Commons photos, credited under every picture and on the Credits page."],
  ["Corrections welcome", "Spotted a mistake? Report it and it gets checked against the sources. Fixes are recorded in the project's history."],
];

export default function AboutContent() {
  return (
    <>
      <p className="lead">
        Kasaysayan tells the history of the Philippines event by event, from the first people in the Tabon Caves to the present. Each event is placed
        on an old-style map of the islands, told as a short story and backed by sources. These rules apply to every event before it goes on the site.
      </p>
      <div className="rules">
        {RULES.map(([h, p]) => (
          <div className="rule" key={h}>
            <h2>{h}</h2>
            <p>{p}</p>
          </div>
        ))}
      </div>
      <h2>How events are chosen</h2>
      <p>
        Events were picked to cover every era from pre-colonial times to today, with a mix of politics, war, culture and science, and with special
        attention to Bohol and the Visayas. Choosing what to include is itself a judgment; if you think something important is missing, say so.
      </p>
      <p>
        <a className="read-btn" href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
          Report a mistake <span aria-hidden="true">→</span>
        </a>
      </p>
    </>
  );
}
