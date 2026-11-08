import { describe, expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import CreditsList from "@/components/CreditsList";
import AboutContent from "@/components/AboutContent";
import { img, makeEvent } from "./helpers";

describe("Credits", () => {
  test("credits lists every published image", () => {
    const events = [
      makeEvent({ id: "a", title: "Battle of Mactan", images: [img(1, "a"), img(2, "a")] }),
      makeEvent({ id: "b", title: "Declaration of Independence", images: [img(1, "b")] }),
      makeEvent({ id: "c", title: "No photos", images: [] }),
    ];
    render(<CreditsList events={events} />);
    const table = screen.getByRole("table", { name: "Photo credits" });
    const rows = within(table).getAllByRole("row").slice(1); // skip header
    expect(rows).toHaveLength(3);
    expect(within(rows[0]).getByRole("link", { name: "Battle of Mactan" })).toHaveAttribute("href", "/events/a");
    expect(within(rows[0]).getByText("Public domain")).toBeInTheDocument();
    expect(within(rows[0]).getByRole("link", { name: /commons\.wikimedia\.org/ })).toHaveAttribute("href", img(1, "a").sourceUrl);
  });

  test("credits the map data, map tiles, fonts and music", () => {
    render(<CreditsList events={[]} />);
    expect(screen.getByText(/Natural Earth/)).toBeInTheDocument();
    expect(screen.getByText(/OpenStreetMap contributors/)).toBeInTheDocument();
    expect(screen.getByText(/IM Fell/)).toBeInTheDocument();
    expect(screen.getByText(/Maria Evangelista Carpena/)).toBeInTheDocument();
    expect(screen.getByText(/Philippine Constabulary Band/)).toBeInTheDocument();
    expect(screen.getByText(/Lumang Balse/)).toBeInTheDocument();
  });
});

describe("About", () => {
  test("about states the six fact-check rules", () => {
    render(<AboutContent />);
    for (const rule of ["Sourced or left out", "Two sources when contested", "Disagreements are shown", "Wikipedia is a starting point", "Free photos only", "Corrections welcome"]) {
      expect(screen.getByRole("heading", { name: rule })).toBeInTheDocument();
    }
  });

  test("about links to GitHub issues", () => {
    render(<AboutContent />);
    expect(screen.getByRole("link", { name: /report a mistake/i })).toHaveAttribute("href", "https://github.com/dewdew-del/kasaysayan/issues");
  });
});
