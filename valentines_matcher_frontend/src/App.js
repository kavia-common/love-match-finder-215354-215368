import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import NameInput from "./components/NameInput";
import RetroCard from "./components/RetroCard";
import MatchResult from "./components/MatchResult";
import {
  buildShareUrl,
  computeMatchPercentage,
  copyToClipboard,
  shareText,
} from "./utils/match";

// PUBLIC_INTERFACE
function App() {
  /** Main app entry for the Valentine's Day name matcher UI. */
  const [yourName, setYourName] = useState("");
  const [crushName, setCrushName] = useState("");
  const [percentage, setPercentage] = useState(null);

  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load shared state from URL query params (a, b, p).
  useEffect(() => {
    const url = new URL(window.location.href);
    const a = url.searchParams.get("a") || "";
    const b = url.searchParams.get("b") || "";
    const pRaw = url.searchParams.get("p");

    if (a) setYourName(a);
    if (b) setCrushName(b);

    if (pRaw) {
      const n = Number(pRaw);
      if (Number.isFinite(n) && n >= 1 && n <= 100) setPercentage(Math.round(n));
    }
  }, []);

  const computed = useMemo(() => {
    if (percentage !== null) return percentage;
    return computeMatchPercentage(yourName, crushName);
  }, [percentage, yourName, crushName]);

  const canCompute = yourName.trim().length > 0 && crushName.trim().length > 0;

  const shareUrl = useMemo(() => {
    const origin = window.location.origin + window.location.pathname;
    const p = computed ?? 0;
    return buildShareUrl({
      origin,
      yourName: yourName.trim(),
      crushName: crushName.trim(),
      percentage: p,
    });
  }, [computed, yourName, crushName]);

  // PUBLIC_INTERFACE
  const onCalculate = (e) => {
    /** Handle calculation submit and lock in a percentage to show an "instant result". */
    e.preventDefault();
    setErrorMsg("");
    setStatusMsg("");

    if (!canCompute) {
      setErrorMsg("Please enter both names.");
      return;
    }

    const p = computeMatchPercentage(yourName, crushName);
    setPercentage(p);

    // Update URL for shareability without navigation.
    const url = new URL(window.location.href);
    url.searchParams.set("a", yourName.trim());
    url.searchParams.set("b", crushName.trim());
    url.searchParams.set("p", String(p));
    window.history.replaceState({}, "", url.toString());
  };

  // PUBLIC_INTERFACE
  const onReset = () => {
    /** Reset to a clean state and remove query params. */
    setYourName("");
    setCrushName("");
    setPercentage(null);
    setStatusMsg("");
    setErrorMsg("");

    const url = new URL(window.location.origin + window.location.pathname);
    window.history.replaceState({}, "", url.toString());
  };

  // PUBLIC_INTERFACE
  const handleCopyLink = async () => {
    /** Copy share link to clipboard. */
    setErrorMsg("");
    setStatusMsg("");

    try {
      await copyToClipboard(shareUrl);
      setStatusMsg("Link copied!");
      window.setTimeout(() => setStatusMsg(""), 2500);
    } catch (err) {
      setErrorMsg("Could not copy link. Please copy it manually.");
    }
  };

  // PUBLIC_INTERFACE
  const handleShare = async () => {
    /** Trigger share using Web Share API or fallback to opening a new tab. */
    setErrorMsg("");
    setStatusMsg("");

    try {
      const title = "Valentine Match";
      const text = `${yourName.trim()} ♥ ${crushName.trim()} = ${computed}%`;
      await shareText({ title, text, url: shareUrl });
      setStatusMsg("Ready to share!");
      window.setTimeout(() => setStatusMsg(""), 2500);
    } catch (err) {
      setErrorMsg("Sharing was cancelled or not available.");
    }
  };

  return (
    <div className="App">
      <div className="bg-hearts" aria-hidden="true" />

      <main className="page">
        <header className="hero">
          <div className="badge">Valentine’s Day</div>
          <h1 className="title">Love Match Finder</h1>
          <p className="subtitle">
            Type your name and your crush’s name. We’ll reveal your retro love score.
          </p>
        </header>

        <RetroCard className="card">
          <form className="form" onSubmit={onCalculate}>
            <div className="grid">
              <NameInput
                id="yourName"
                label="Your name"
                value={yourName}
                onChange={(v) => {
                  setYourName(v);
                  setPercentage(null);
                }}
                placeholder="e.g. Alex"
                autoComplete="name"
              />
              <NameInput
                id="crushName"
                label="Your crush"
                value={crushName}
                onChange={(v) => {
                  setCrushName(v);
                  setPercentage(null);
                }}
                placeholder="e.g. Jamie"
                autoComplete="off"
              />
            </div>

            <div className="actions">
              <button className="btn btn-primary btn-large" type="submit" disabled={!canCompute}>
                Calculate match
              </button>
              <button className="btn btn-ghost" type="button" onClick={onReset}>
                Reset
              </button>
            </div>

            {errorMsg ? (
              <div className="notice notice-error" role="alert">
                {errorMsg}
              </div>
            ) : null}
            {statusMsg ? (
              <div className="notice notice-success" role="status">
                {statusMsg}
              </div>
            ) : null}
          </form>

          {computed !== null && canCompute ? (
            <MatchResult
              yourName={yourName.trim()}
              crushName={crushName.trim()}
              percentage={computed}
              shareUrl={shareUrl}
              onCopyLink={handleCopyLink}
              onShare={handleShare}
            />
          ) : (
            <div className="result-placeholder" aria-live="polite">
              <div className="placeholder-heart">♥</div>
              <div className="placeholder-text">
                Your match result will appear here (perfect for screenshots).
              </div>
            </div>
          )}
        </RetroCard>

        <footer className="footer">
          <div className="footer-tip">
            Works best on mobile. For socials: calculate → screenshot → post.
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
