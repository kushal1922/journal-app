import React from "react";
import { useJournal } from "./features/journal/hooks/useJournal";
import { formatInr } from "./features/journal/utils";

function App() {
  const {
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
  } = useJournal();

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Discipline Through Data</p>
          <h1>Trader Journal</h1>
          <p className="subtitle">
            Capture setups, review mistakes, and compound your edge.
          </p>
        </div>
        <div className="hero-actions">
          <button onClick={onExportJournal} className="ghost-btn" type="button">
            Export JSON
          </button>
          <label className="ghost-btn upload-btn">
            Import JSON
            <input type="file" accept="application/json" onChange={onImportJournal} />
          </label>
        </div>
      </header>

      <section className="stats-grid">
        <article>
          <span>Total Entries</span>
          <strong>{stats.totalEntries}</strong>
        </article>
        <article>
          <span>Net P&amp;L</span>
          <strong className={stats.totalPnl >= 0 ? "up" : "down"}>
            {formatInr(stats.totalPnl)}
          </strong>
        </article>
        <article>
          <span>Win Rate</span>
          <strong>{stats.winRate}%</strong>
        </article>
        <article>
          <span>Average P&amp;L</span>
          <strong>{formatInr(stats.avgPnl)}</strong>
        </article>
      </section>

      <main className="layout">
        <section className="panel form-panel">
          <div className="panel-head">
            <h2>{editingId ? "Edit Entry" : "New Entry"}</h2>
            {editingId && (
              <button type="button" onClick={resetDraft} className="mini-btn">
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={upsertEntry} className="journal-form">
            <div className="grid two">
              <label>
                Title
                <input
                  value={draft.title}
                  onChange={(event) => onDraftChange("title", event.target.value)}
                  required
                />
              </label>
              <label>
                Trade Date
                <input
                  type="date"
                  value={draft.date}
                  onChange={(event) => onDraftChange("date", event.target.value)}
                />
              </label>
            </div>

            <div className="grid four">
              <label>
                Symbol
                <input
                  value={draft.symbol}
                  onChange={(event) => onDraftChange("symbol", event.target.value)}
                  required
                />
              </label>
              <label>
                Market
                <select
                  value={draft.market}
                  onChange={(event) => onDraftChange("market", event.target.value)}
                >
                  {marketOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label>
                Direction
                <select
                  value={draft.direction}
                  onChange={(event) => onDraftChange("direction", event.target.value)}
                >
                  <option>Long</option>
                  <option>Short</option>
                </select>
              </label>
              <label>
                Status
                <select
                  value={draft.status}
                  onChange={(event) => onDraftChange("status", event.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid four">
              <label>
                P&amp;L (INR)
                <input
                  type="number"
                  value={draft.pnl}
                  onChange={(event) => onDraftChange("pnl", Number(event.target.value))}
                />
              </label>
              <label>
                Risk %
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={draft.risk}
                  onChange={(event) => onDraftChange("risk", Number(event.target.value))}
                />
              </label>
              <label>
                Confidence (1-10)
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={draft.confidence}
                  onChange={(event) =>
                    onDraftChange("confidence", Number(event.target.value))
                  }
                />
              </label>
              <label>
                Mood
                <select
                  value={draft.mood}
                  onChange={(event) => onDraftChange("mood", event.target.value)}
                >
                  {moodOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Strategy
              <input
                value={draft.strategy}
                onChange={(event) => onDraftChange("strategy", event.target.value)}
              />
            </label>

            <div className="grid three-text">
              <label>
                Setup
                <textarea
                  value={draft.setup}
                  onChange={(event) => onDraftChange("setup", event.target.value)}
                />
              </label>
              <label>
                Execution
                <textarea
                  value={draft.execution}
                  onChange={(event) => onDraftChange("execution", event.target.value)}
                />
              </label>
              <label>
                Mistakes / Lessons
                <textarea
                  value={`${draft.mistakes}\n${draft.lessons}`}
                  onChange={(event) => {
                    const [mistakes = "", ...rest] = event.target.value.split("\n");
                    onDraftChange("mistakes", mistakes);
                    onDraftChange("lessons", rest.join("\n"));
                  }}
                />
              </label>
            </div>

            <label>
              Screenshot Links
              <textarea
                value={draft.screenshots}
                onChange={(event) => onDraftChange("screenshots", event.target.value)}
                placeholder="Paste chart/image links separated by commas"
              />
            </label>

            <div className="tag-row">
              <div className="tag-editor">
                <input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  placeholder="Add tag"
                />
                <button type="button" onClick={addTag}>
                  Add Tag
                </button>
              </div>
              <div className="tag-list">
                {draft.tags.map((tag) => (
                  <span key={tag} className="chip" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </span>
                ))}
              </div>
            </div>

            <div className="checklist">
              <label>
                <input
                  type="checkbox"
                  checked={draft.checklist.plan}
                  onChange={() => onChecklistChange("plan")}
                />{" "}
                Plan Prepared
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={draft.checklist.stopPlaced}
                  onChange={() => onChecklistChange("stopPlaced")}
                />{" "}
                Stop Placed
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={draft.checklist.positionSized}
                  onChange={() => onChecklistChange("positionSized")}
                />{" "}
                Position Sized
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={draft.checklist.journaled}
                  onChange={() => onChecklistChange("journaled")}
                />{" "}
                Journal Updated
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {editingId ? "Update Entry" : "Save Entry"}
              </button>
              <button type="button" className="ghost-btn" onClick={resetDraft}>
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="panel list-panel">
          <div className="panel-head">
            <h2>Journal Entries</h2>
            <span>{filteredEntries.length} results</span>
          </div>

          <div className="filters">
            <input
              placeholder="Search symbol, setup, tags..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option>All</option>
              {statusOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <select
              value={selectedDirection}
              onChange={(event) => setSelectedDirection(event.target.value)}
            >
              <option>All</option>
              <option>Long</option>
              <option>Short</option>
            </select>
            <select value={selectedTag} onChange={(event) => setSelectedTag(event.target.value)}>
              <option>All</option>
              {allTags.map((tag) => (
                <option key={tag}>{tag}</option>
              ))}
            </select>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="entry-list">
            {filteredEntries.map((entry) => (
              <article key={entry.id} className="entry-card">
                <div className="entry-top">
                  <div>
                    <h3>{entry.title}</h3>
                    <p>
                      {entry.symbol} • {entry.market} • {entry.direction}
                    </p>
                  </div>
                  <strong className={Number(entry.pnl) >= 0 ? "up" : "down"}>
                    {formatInr(Number(entry.pnl))}
                  </strong>
                </div>

                <div className="meta-row">
                  <span>{entry.date}</span>
                  <span>{entry.strategy || "No strategy logged"}</span>
                  <span>{entry.mood}</span>
                  <span className="pill">{entry.status}</span>
                </div>

                <p className="snippet">
                  {entry.setup || entry.execution || entry.lessons || "No notes added yet."}
                </p>

                <div className="tag-list">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="chip small">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="entry-actions">
                  <button type="button" onClick={() => editEntry(entry)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => toggleFlag(entry.id, "pinned")}>
                    {entry.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button type="button" onClick={() => toggleFlag(entry.id, "favorite")}>
                    {entry.favorite ? "Unfavorite" : "Favorite"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEntry(entry.id)}
                    className="danger"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
            {!filteredEntries.length && (
              <p className="empty">No entries match your filters yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;