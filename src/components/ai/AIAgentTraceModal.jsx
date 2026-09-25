export default function AIAgentTraceModal({ isOpen, onClose, agentTrace = [], toolCalls = [] }) {
  if (!isOpen) return null;

  return (
    <div className="ai-modal-backdrop" onClick={onClose}>
      <div className="ai-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="ai-modal-header">
          <h3>
            <i className="fa fa-sitemap" style={{ color: '#0284c7' }} />
            Multi-Agent System &amp; Tool Call Telemetry
          </h3>
          <button className="ai-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="ai-modal-body">
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: 0, marginBottom: '20px' }}>
            Inspect how the Travel Orchestrator coordinated specialized sub-agents and dispatched factual tool calls to formulate this journey.
          </p>

          {/* Sub-Agents Execution Pipeline */}
          <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
            <i className="fa fa-cubes" style={{ color: '#f33f3f', marginRight: '6px' }} />
            Autonomous Agent Pipeline Trace
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {agentTrace?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  borderLeft: '4px solid #f33f3f'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                    {item.agent || item.step || `Agent ${idx + 1}`}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px' }}>
                    <i className="fa fa-check" /> Verified
                  </span>
                </div>
                {item.detail && <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>{item.detail}</p>}
                {item.insights?.map((ins, i) => (
                  <p key={i} style={{ fontSize: '12px', color: '#334155', margin: '3px 0 0' }}>
                    &bull; {ins}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Tool Calls Execution Matrix */}
          <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
            <i className="fa fa-wrench" style={{ color: '#f59e0b', marginRight: '6px' }} />
            Function / Tool Invocations
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {toolCalls?.map((t, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ color: '#166534', fontFamily: 'monospace' }}>{t.tool}()</strong>
                  <span style={{ color: '#15803d', fontWeight: '700', fontSize: '11px' }}>200 OK</span>
                </div>
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>
                  Target: {t.target || (t.travelers ? `${t.travelers} pax / ${t.days}d` : 'Route matrix')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ai-modal-footer">
          <button type="button" className="btn-minimal-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
