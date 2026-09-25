import { useState } from 'react';
import AIReplannerDiffView from './AIReplannerDiffView';

export default function AIItineraryDisplay({
  itinerary,
  replanDiff,
  onOpenReplanModal,
  onOpenAgentTraceModal,
  onBookItinerary,
  onDismissDiff
}) {
  const [activeDay, setActiveDay] = useState(1);
  const [showSources, setShowSources] = useState(false);

  if (!itinerary || !itinerary.days) return null;

  const currentDayData = itinerary.days.find(d => d.day === activeDay) || itinerary.days[0];

  const formatCurrency = (val) => {
    if (!val) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  // Determine hero cover image for destination
  const getHeroImage = () => {
    if (itinerary.heroImage) return itinerary.heroImage;
    const dest = (itinerary.destination || '').toLowerCase();
    if (dest.includes('goa')) return '/assets/images/goa-1.jpg';
    if (dest.includes('manali')) return '/assets/images/manali.jpg';
    if (dest.includes('jaipur') || dest.includes('rajasthan')) return '/assets/images/jaipur.jpg';
    if (dest.includes('kashmir') || dest.includes('srinagar')) return '/assets/images/kashmir.jpg';
    if (dest.includes('shimla')) return '/assets/images/shimla.jpg';
    return '/assets/images/kerala.jpg';
  };

  return (
    <div className="ai-itinerary-container">
      {/* ── DESTINATION PHOTO HERO COVER ── */}
      <div className="ai-dest-hero-card">
        <img src={getHeroImage()} alt={itinerary.destination} loading="lazy" />
        <div className="ai-dest-hero-overlay">
          <div className="ai-dest-hero-details">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#ffffff', background: 'rgba(243,63,63,0.85)', padding: '2px 8px', borderRadius: '4px' }}>
                AI Tailored Journey
              </span>
              {itinerary.planVersion > 1 && (
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#ffffff', background: 'rgba(16, 185, 129, 0.9)', padding: '2px 8px', borderRadius: '4px' }}>
                  v{itinerary.planVersion} (Re-Planned 🔄)
                </span>
              )}
            </div>
            <h3>{itinerary.destination} Holiday Plan</h3>
            <div className="ai-dest-chips">
              <span className="ai-dest-chip">
                <i className="fa fa-clock-o" /> {itinerary.duration} Days
              </span>
              <span className="ai-dest-chip">
                <i className="fa fa-users" /> {itinerary.travelers || 2} Travelers
              </span>
              <span className="ai-dest-chip">
                <i className="fa fa-compass" /> {itinerary.travelStyle || 'Balanced'}
              </span>
            </div>
          </div>

          <div className="ai-dest-budget-glass">
            <div className="label">Estimated Trip Budget</div>
            <div className="amount">{formatCurrency(itinerary.estimatedBudget)}</div>
            <div className="sub">
              {formatCurrency(itinerary.costPerPerson || Math.round(itinerary.estimatedBudget / (itinerary.travelers || 1)))} / person
            </div>
          </div>
        </div>
      </div>

      {/* ── PARTNER HOTEL & WEATHER HIGHLIGHTS ── */}
      <div className="ai-highlights-grid">
        {itinerary.accommodation?.hotel && (
          <div className="ai-hotel-card">
            <div className="ai-hotel-icon">
              <i className="fa fa-building-o" />
            </div>
            <div className="ai-hotel-info">
              <h4>{itinerary.accommodation.hotel.name}</h4>
              <p>
                {itinerary.accommodation.hotel.stars}★ {itinerary.accommodation.hotel.type || 'Boutique Partner Stay'} &bull; {itinerary.accommodation.hotel.area || itinerary.destination} &bull; Breakfast Included
              </p>
            </div>
          </div>
        )}

        {itinerary.weather && (
          <div className="ai-weather-card">
            <div className="ai-weather-icon">
              <i className={itinerary.weather.isRainy ? 'fa fa-tint' : 'fa fa-sun-o'} />
            </div>
            <div className="ai-weather-info">
              <h4>{itinerary.weather.temperature} &bull; {itinerary.weather.condition?.split(' ')[0]}</h4>
              <p>{itinerary.weather.advisory}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── BEFORE VS AFTER DIFF VIEW (IF REPLANNED) ── */}
      {replanDiff && (
        <AIReplannerDiffView replanDiff={replanDiff} onDismiss={onDismissDiff} />
      )}

      {/* ── ACTION BAR & DAY TABS ── */}
      <div className="ai-itin-actionbar">
        <div className="ai-day-tabs">
          {itinerary.days?.map((d) => (
            <button
              key={d.day}
              className={`ai-day-tab ${activeDay === d.day ? 'active' : ''}`}
              onClick={() => setActiveDay(d.day)}
            >
              Day {d.day}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="ai-memory-btn"
            onClick={onOpenAgentTraceModal}
            title="Inspect autonomous multi-agent pipeline and tool calls"
          >
            <i className="fa fa-sitemap" style={{ color: '#0284c7' }} /> Trace ({itinerary.agentTrace?.length || 6})
          </button>

          <button
            type="button"
            className="ai-replan-btn"
            onClick={onOpenReplanModal}
          >
            <i className="fa fa-refresh" /> Re-Plan Trip
          </button>

          {onBookItinerary && (
            <button
              type="button"
              className="btn-minimal-primary"
              style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
              onClick={() => onBookItinerary(itinerary)}
            >
              <i className="fa fa-check" /> Book Trip
            </button>
          )}
        </div>
      </div>

      {/* ── ACTIVE DAY TIMELINE ── */}
      {currentDayData && (
        <div className="ai-timeline-card">
          <div className="ai-day-header">
            <div>
              <h4 className="ai-day-title">{currentDayData.title || `Day ${currentDayData.day}`}</h4>
            </div>
            {currentDayData.theme && (
              <span className="ai-day-theme">
                {currentDayData.theme}
              </span>
            )}
          </div>

          <div className="ai-activities-timeline">
            {currentDayData.activities?.map((act, idx) => (
              <div
                key={idx}
                className={`ai-activity-row ${act.type || ''} ${act.isReplanned ? 'replanned' : ''}`}
              >
                <div className="ai-timeline-dot" />

                <div className={`ai-activity-card ${act.isReplanned ? 'replanned' : ''}`}>
                  <div className="ai-activity-top">
                    <span className="ai-activity-time">
                      <i className="fa fa-clock-o" /> {act.startTime}
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {act.isReplanned && (
                        <span className="ai-replanned-badge">
                          <i className="fa fa-refresh" /> Re-Planned
                        </span>
                      )}
                      <span className="ai-type-badge">{act.type || 'sightseeing'}</span>
                    </div>
                  </div>

                  <h5 className="ai-activity-name">{act.name}</h5>

                  {act.notes && <p className="ai-activity-notes">{act.notes}</p>}

                  <div className="ai-activity-footer">
                    <div>
                      {act.location && (
                        <span style={{ marginRight: '12px' }}>
                          <i className="fa fa-map-marker" style={{ color: '#f33f3f', marginRight: '3px' }} />
                          {act.location}
                        </span>
                      )}
                      {act.transitInfo && (
                        <span className="ai-transit-tag">
                          <i className="fa fa-car" /> {act.transitInfo}
                        </span>
                      )}
                    </div>

                    <div className="ai-cost-tag">
                      {act.estimatedCost > 0 ? (
                        <span>Est: ₹{act.estimatedCost.toLocaleString()}</span>
                      ) : (
                        <span style={{ color: '#16a34a' }}>Included</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RAG GROUNDED SOURCES ACCORDION ── */}
      {itinerary.sources && itinerary.sources.length > 0 && (
        <div className="ai-sources-card">
          <div className="ai-sources-header" onClick={() => setShowSources(prev => !prev)}>
            <div className="ai-sources-title">
              <i className="fa fa-shield" style={{ color: '#10b981' }} />
              <span>Grounded Knowledge Citations ({itinerary.sources.length} Records)</span>
            </div>
            <i className={`fa fa-chevron-${showSources ? 'up' : 'down'}`} style={{ color: '#64748b', fontSize: '12px' }} />
          </div>

          {showSources && (
            <div className="ai-sources-grid">
              {itinerary.sources.map((src, i) => (
                <div key={i} className="ai-source-item">
                  <strong>{src.title}</strong>
                  <span>{src.category} &bull; {src.source}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
