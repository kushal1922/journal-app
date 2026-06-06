import React from "react";
import {
  STORAGE_KEY,
  createEmptyEntry,
  sortOptions,
  statusOptions,
  marketOptions,
  moodOptions,
} from "../constants";
import {
  loadEntries,
  getAllTags,
  filterAndSortEntries,
  getStats,
  exportJournal,
  importJournalFile,
} from "../utils";

export function useJournal() {
  const [entries, setEntries] = React.useState(loadEntries);
  const [draft, setDraft] = React.useState(createEmptyEntry);
  const [editingId, setEditingId] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("All");
  const [selectedDirection, setSelectedDirection] = React.useState("All");
  const [selectedTag, setSelectedTag] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("updatedAt");
  const [tagInput, setTagInput] = React.useState("");

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const allTags = React.useMemo(() => getAllTags(entries), [entries]);

  const filteredEntries = React.useMemo(
    () =>
      filterAndSortEntries(entries, {
        query,
        selectedStatus,
        selectedDirection,
        selectedTag,
        sortBy,
      }),
    [entries, query, selectedStatus, selectedDirection, selectedTag, sortBy],
  );

  const stats = React.useMemo(() => getStats(entries), [entries]);

  function resetDraft() {
    setDraft(createEmptyEntry());
    setEditingId(null);
    setTagInput("");
  }

  function onDraftChange(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function onChecklistChange(field) {
    setDraft((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [field]: !prev.checklist[field],
      },
    }));
  }

  function upsertEntry(event) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.symbol.trim()) return;

    const now = Date.now();
    if (editingId) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingId
            ? {
                ...entry,
                ...draft,
                symbol: draft.symbol.toUpperCase(),
                updatedAt: now,
              }
            : entry,
        ),
      );
    } else {
      setEntries((prev) => [
        {
          id: crypto.randomUUID(),
          ...draft,
          symbol: draft.symbol.toUpperCase(),
          createdAt: now,
          updatedAt: now,
        },
        ...prev,
      ]);
    }
    resetDraft();
  }

  function editEntry(entry) {
    setDraft({ ...entry });
    setEditingId(entry.id);
  }

  function deleteEntry(id) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    if (editingId === id) resetDraft();
  }

  function toggleFlag(id, key) {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, [key]: !entry[key], updatedAt: Date.now() }
          : entry,
      ),
    );
  }

  function addTag() {
    const nextTag = tagInput.trim().toLowerCase();
    if (!nextTag || draft.tags.includes(nextTag)) return;

    onDraftChange("tags", [...draft.tags, nextTag]);
    setTagInput("");
  }

  function removeTag(tag) {
    onDraftChange(
      "tags",
      draft.tags.filter((currentTag) => currentTag !== tag),
    );
  }

  function onExportJournal() {
    exportJournal(entries);
  }

  async function onImportJournal(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await importJournalFile(file);
      setEntries(parsed);
    } catch (error) {
      window.alert(error.message);
    } finally {
      event.target.value = "";
    }
  }

  return {
    draft,
    editingId,
    query,
    selectedStatus,
    selectedDirection,
    selectedTag,
    sortBy,
    tagInput,
    allTags,
    filteredEntries,
    stats,
    sortOptions,
    statusOptions,
    marketOptions,
    moodOptions,
    setQuery,
    setSelectedStatus,
    setSelectedDirection,
    setSelectedTag,
    setSortBy,
    setTagInput,
    resetDraft,
    onDraftChange,
    onChecklistChange,
    upsertEntry,
    editEntry,
    deleteEntry,
    toggleFlag,
    addTag,
    removeTag,
    onExportJournal,
    onImportJournal,
  };
}