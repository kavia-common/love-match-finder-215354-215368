import React, { useEffect, useMemo, useState } from "react";

/**
 * PRESENTATIONAL COMPONENT
 * Displays the computed match percentage and provides share/copy actions.
 */
export default function MatchResult({
  yourName,
  crushName,
  percentage,
  shareUrl,
  onCopyLink,
  onShare,
}) {
  const [animateTo, setAnimateTo] = useState(0);

  useEffect(() => {
    // Small delay so CSS transitions visibly animate on mount/update.
    const t = window.setTimeout(() => setAnimateTo(percentage), 50);
    return () => window.clearTimeout(t);
  }, [percentage]);

  const caption = useMemo(() => {
    if (percentage >= 90) return "Cosmic soulmates";
    if (percentage >= 75) return "Heart-eye certified";
    if (percentage >= 55) return "Cute potential";
    if (percentage >= 35) return "It’s complicated (but spicy)";
    return "Plot twist romance";
  }, [percentage]);

  return (
    <div className="result">
      <div className="result-headline" aria-live="polite">
        <span className="result-names">
          {yourName} <span className="result-heart">♥</span> {crushName}
        </span>
      </div>

      <div className="meter" role="img" aria-label={`Match meter: ${percentage}%`}>
        <div className="meter-track">
          <div
            className="meter-fill"
            style={{ width: `${Math.max(0, Math.min(100, animateTo))}%` }}
          />
        </div>
        <div className="meter-percent">
          <span className="meter-number">{percentage}</span>
          <span className="meter-symbol">%</span>
        </div>
      </div>

      <div className="result-caption">{caption}</div>

      <div className="share">
        <div className="share-row">
          <button className="btn btn-primary" type="button" onClick={onShare}>
            Share
          </button>
          <button className="btn btn-secondary" type="button" onClick={onCopyLink}>
            Copy link
          </button>
        </div>

        <div className="share-link" aria-label="Shareable link">
          <span className="share-link-label">Link</span>
          <a className="share-link-url" href={shareUrl}>
            {shareUrl}
          </a>
        </div>

        <div className="share-hint">
          Tip: take a screenshot and post to Instagram/TikTok/WhatsApp.
        </div>
      </div>
    </div>
  );
}
