// The app reads a few browser globals when its modules load. This is the
// smallest `window` that lets the graph code run under Node.
(globalThis as any).window = { console, location: { search: "" } };
