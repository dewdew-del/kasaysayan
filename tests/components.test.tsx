import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import StoryMap from "@/components/StoryMap";
import StoryStep from "@/components/StoryStep";
import Engraving from "@/components/Engraving";
import { img, makeEvent } from "./helpers";

const three = [
  makeEvent({ id: "a", title: "Battle of Mactan", place: { name: "Mactan, Cebu", lat: 10.31, lng: 123.98 } }),
  makeEvent({ id: "b", title: "Declaration of Independence", place: { name: "Kawit, Cavite", lat: 14.44, lng: 120.9 } }),
  makeEvent({ id: "c", title: "Typhoon Yolanda", place: { name: "Tacloban, Leyte", lat: 11.24, lng: 125.0 } }),
];

describe("StoryMap", () => {
  test("marks markers past/current/future", () => {
    render(<StoryMap events={three} current={1} onMarkerClick={() => {}} />);
    expect(screen.getByRole("button", { name: "Battle of Mactan, Mactan, Cebu" })).toHaveAttribute("data-state", "past");
    expect(screen.getByRole("button", { name: "Declaration of Independence, Kawit, Cavite" })).toHaveAttribute("data-state", "current");
    expect(screen.getByRole("button", { name: "Typhoon Yolanda, Tacloban, Leyte" })).toHaveAttribute("data-state", "future");
    // the current event gets a ring and its place label
    expect(screen.getByTestId("current-ring")).toBeInTheDocument();
    expect(screen.getByText("Kawit, Cavite")).toBeInTheDocument();
  });

  test("nationwide current event sets map tint", () => {
    const events = [...three, makeEvent({ id: "n", title: "Proclamation No. 1081", place: undefined })];
    const { container } = render(<StoryMap events={events} current={3} onMarkerClick={() => {}} />);
    expect(container.querySelector("svg")).toHaveAttribute("data-nationwide", "true");
    expect(screen.queryByRole("button", { name: /Proclamation/ })).toBeNull();
    expect(screen.getByText("The whole archipelago")).toBeInTheDocument();
  });

  test("marker click calls onMarkerClick with id", () => {
    const onClick = vi.fn();
    render(<StoryMap events={three} current={0} onMarkerClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: /Typhoon Yolanda/ }));
    expect(onClick).toHaveBeenCalledWith("c");
  });

  test("marker opens with the keyboard too", () => {
    const onClick = vi.fn();
    render(<StoryMap events={three} current={0} onMarkerClick={onClick} />);
    fireEvent.keyDown(screen.getByRole("button", { name: /Battle of Mactan/ }), { key: "Enter" });
    expect(onClick).toHaveBeenCalledWith("a");
  });

  test("draws the coast and the map decorations", () => {
    const { container } = render(<StoryMap events={three} current={0} onMarkerClick={() => {}} />);
    expect(container.querySelectorAll("path.land").length).toBeGreaterThan(50);
    expect(container.querySelector(".rose")).not.toBeNull();
    expect(container.querySelector(".cart")).not.toBeNull();
    expect(container.querySelectorAll(".ship").length).toBeGreaterThan(0);
  });
});

describe("StoryStep", () => {
  test("StoryStep falls back to Engraving without image", () => {
    const { container } = render(<StoryStep event={makeEvent({ id: "a", images: [] })} index={0} active={false} />);
    expect(container.querySelector("svg.engraving")).not.toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });

  test("StoryStep shows the cover photo and one clear Read the story link", () => {
    const e = makeEvent({ id: "a", images: [1, 2, 3, 4, 5, 6].map((n) => img(n, "a")) });
    const { container } = render(<StoryStep event={e} index={0} active />);
    // one photo only: the cover (no thumbnail strip, per Dewdew's 2026-11-06 feedback)
    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(container.querySelector("img")).toHaveAttribute("src", "/images/events/a-1.webp");
    const links = screen.getAllByRole("link", { name: /Read the story/ });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/events/a");
    expect(screen.queryByText(/photos/)).toBeNull();
  });

  test("StoryStep shows era, date, title, summary and place", () => {
    render(<StoryStep event={makeEvent({ id: "a" })} index={0} active={false} />);
    expect(screen.getByText("Revolution")).toBeInTheDocument();
    expect(screen.getByText("12 June 1898")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Title a" })).toBeInTheDocument();
    expect(screen.getByText("Summary of a.")).toBeInTheDocument();
    expect(screen.getByText("Kawit, Cavite")).toBeInTheDocument();
  });

  test("StoryStep says The whole archipelago for nationwide events", () => {
    render(<StoryStep event={makeEvent({ id: "n", place: undefined })} index={0} active={false} />);
    expect(screen.getByText("The whole archipelago")).toBeInTheDocument();
  });

  test("StoryStep shows Sources differ when contested", () => {
    const e = makeEvent({ id: "a", contested: true, contestedNote: "Dates differ." });
    render(<StoryStep event={e} index={0} active={false} />);
    expect(screen.getByText(/Sources differ/)).toBeInTheDocument();
  });
});

describe("Engraving", () => {
  test("draws an illustration for every era", () => {
    for (const era of ["precolonial", "spanish", "revolution", "american", "japanese", "third", "martial", "edsa", "modern"] as const) {
      const { container, unmount } = render(<Engraving era={era} />);
      expect(container.querySelector("svg.engraving")?.innerHTML.length, era).toBeGreaterThan(50);
      unmount();
    }
  });
});
