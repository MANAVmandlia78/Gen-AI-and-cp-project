export default function AIReplannerDiffView({ replanDiff, onDismiss }) {
  if (!replanDiff) return null;

  return (
    <div className="ai-diff-container" style={{ animation: 'slideUp 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa fa-exchange" style={{ color: '#10b981' }} />
          Dynamic Re-Planning Comparison (Day {replanDiff.targetDay})
        </h4>
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
          >
            Hide Diff &times;
          </button>
        )}
      </div>

      {replanDiff.explanation && (
        <div className="ai-diff-banner">
          <i className="fa fa-info-circle" style={{ fontSize: '16px', marginTop: '2px' }} />
          <div>
            <strong>AI Adjustment Rationale:</strong>
            <p style={{ margin: '4px 0 0', lineHeight: 1.4 }}>{replanDiff.explanation}</p>
          </div>
        </div>
      )}

      <div className="ai-diff-columns">
        {/* BEFORE COLUMN */}
        <div className="ai-diff-col before">
          <h4>
            <i className="fa fa-history" /> ORIGINAL PLAN (BEFORE)
          </h4>
          {replanDiff.beforeActivities?.map((act, idx) => {
            const isRemoved = replanDiff.removedActivities?.some(r => r.name === act.name);
            return (
              <div key={idx} className={`ai-diff-item ${isRemoved ? 'removed' : ''}`}>
                <span>
                  <strong>{act.startTime}</strong> &mdash; {act.name}
                </span>
                {isRemoved && (
                  <span style={{ fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '700' }}>Replaced</span>
                )}
              </div>
            );
          })}
        </div>

        {/* AFTER COLUMN */}
        <div className="ai-diff-col after">
          <h4>
            <i className="fa fa-check-circle" /> REVISED SCHEDULE (AFTER)
          </h4>
          {replanDiff.afterActivities?.map((act, idx) => {
            const isAdded = replanDiff.addedActivities?.some(a => a.name === act.name);
            return (
              <div key={idx} className={`ai-diff-item ${isAdded ? 'added' : ''}`}>
                <span>
                  <strong>{act.startTime}</strong> &mdash; {act.name}
                </span>
                {isAdded && (
                  <span style={{ fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '700', background: '#16a34a', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>
                    + Added New
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
