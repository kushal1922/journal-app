import { STORAGE_KEY, createSeedEntries } from "./constants";

export function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedEntries();

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return createSeedEntries();

    return parsed;
  } catch {
    return createSeedEntries();
  }
}

export function formatInr(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getStats(entries) {
  const closed = entries.filter((entry) => entry.status === "Closed");
  const totalPnl = closed.reduce((sum, entry) => sum + Number(entry.pnl || 0), 0);
  const wins = closed.filter((entry) => Number(entry.pnl) > 0).length;
  const losses = closed.filter((entry) => Number(entry.pnl) < 0).length;
  const winRate = closed.length ? Math.round((wins / closed.length) * 100) : 0;
  const avgPnl = closed.length ? Math.round(totalPnl / closed.length) : 0;

  return {
    totalEntries: entries.length,
    totalPnl,
    winRate,
    wins,
    losses,
    avgPnl,
  };
}

export function getAllTags(entries) {
  const tagSet = new Set();
  entries.forEach((entry) => entry.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

export function filterAndSortEntries(entries, filters) {
  const { query, selectedStatus, selectedDirection, selectedTag, sortBy } = filters;
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = entries.filter((entry) => {
    const searchable = [
      entry.title,
      entry.symbol,
      entry.strategy,
      entry.setup,
      entry.lessons,
      ...entry.tags,
    ]
      .join(" ")
      .toLowerCase();

    const queryMatch = !normalizedQuery || searchable.includes(normalizedQuery);
    const statusMatch = selectedStatus === "All" || entry.status === selectedStatus;
    const directionMatch = selectedDirection === "All" || entry.direction === selectedDirection;
    const tagMatch = selectedTag === "All" || entry.tags.includes(selectedTag);

    return queryMatch && statusMatch && directionMatch && tagMatch;
  });

  return filtered.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (sortBy === "pnl" || sortBy === "confidence" || sortBy === "risk") {
      return Number(b[sortBy]) - Number(a[sortBy]);
    }
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return Number(b.updatedAt) - Number(a.updatedAt);
  });
}

export function exportJournal(entries) {
  const data = JSON.stringify(entries, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `trader-journal-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();

  URL.revokeObjectURL(url);
}

export function importJournalFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) {
          reject(new Error("Invalid JSON file."));
          return;
        }
        resolve(parsed);
      } catch {
        reject(new Error("Invalid JSON file."));
      }
    };

    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsText(file);
  });
}