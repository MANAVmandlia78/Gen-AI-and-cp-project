import { useState } from 'react';

export default function AIReplannerModal({ isOpen, onClose, itinerary, onReplanSubmit, isReplanning }) {
  const [targetDay, setTargetDay] = useState(itinerary?.days?.[0]?.day || 1);
  const [selectedScenario, setSelectedScenario] = useState('weather');
  const [customPrompt, setCustomPrompt] = useState('');

  if (!isOpen || !itinerary) return null;

  const scenarios = [
    {
      id: 'weather',
      icon: 'fa-cloud',
      title: '🌧️ Weather Disruption',
      desc: 'Heavy rain, storm, or extreme heat expected. Replaces outdoor beaches/treks with sheltered cultural galleries and indoor workshops.',
      prompt: 'Heavy rain expected tomorrow. Please re-plan with sheltered indoor activities.'
    },
    {
      id: 'running_late',
      icon: 'fa-clock-o',
      title: '⏰ Running Late / Delayed Start',
      desc: 'Shift the day timeline forward by 2 hours and optimize visits without rushing.',
      prompt: 'We woke up late and are running 2 hours behind schedule. Please adjust Day timeline.'
    },
    {
      id: 'more_food',
      icon: 'fa-cutlery',
      title: '🍽️ More Food & Culinary Stops',
      desc: 'Swap standard sightseeing with artisanal local dining, bakery trails, or cooking workshops.',
      prompt: 'We want more authentic local food experiences and culinary workshops.'
    },
    {
      id: 'relaxed_pace',
      icon: 'fa-coffee',
      title: '🧘 Relaxed Pace & Less Transit',
      desc: 'Reduce driving distances, remove stressful stops, and add afternoon leisure breaks.',
      prompt: 'Make this day much more relaxed with fewer transit stops and more free time.'
    }
  ];

  const handleScenarioClick = (scenario) => {
    setSelectedScenario(scenario.id);
    setCustomPrompt(scenario.prompt);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onReplanSubmit({
      originalItinerary: itinerary,
      targetDay: parseInt(targetDay, 10),
      modificationType: selectedScenario,
      changeReason: customPrompt || scenarios.find(s => s.id === selectedScenario)?.prompt || 'Dynamic traveler re-planning request',
      customPrompt
    });
  };

  return (
    <div className="ai-modal-backdrop" onClick={onClose}>
      <div className="ai-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="ai-modal-header">
          <h3>
            <i className="fa fa-refresh" style={{ color: '#f59e0b' }} />
            Dynamic Itinerary Re-Planning
          </h3>
          <button className="ai-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="ai-modal-body">
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: 0, marginBottom: '20px' }}>
              Select what changed or type a custom adjustment. The AI will recalculate transit, check RAG alternatives, and provide an instant BEFORE vs AFTER plan diff.
            </p>

            {/* Select Target Day */}
            <div className="ai-form-group" style={{ marginBottom: '18px' }}>
              <label className="ai-label">
                <i className="fa fa-calendar-check-o" /> Which Day needs Re-Planning?
              </label>
              <select
                className="ai-select"
                value={targetDay}
                onChange={(e) => setTargetDay(e.target.value)}
              >
                {itinerary.days?.map(d => (
                  <option key={d.day} value={d.day}>
                    Day {d.day} — {d.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Scenarios Grid */}
            <div className="ai-form-group" style={{ marginBottom: '18px' }}>
              <label className="ai-label">
                <i className="fa fa-bolt" /> Quick Disruption Scenario
              </label>
              <div className="ai-replan-scenarios">
                {scenarios.map(s => (
                  <div
                    key={s.id}
                    className={`ai-scenario-card ${selectedScenario === s.id ? 'active' : ''}`}
                    onClick={() => handleScenarioClick(s)}
                  >
                    <strong>{s.title}</strong>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Prompt Box */}
            <div className="ai-form-group">
              <label className="ai-label">
                <i className="fa fa-pencil-square-o" /> Modification Instructions / Notes
              </label>
              <textarea
                className="ai-input"
                rows={3}
                placeholder="e.g. Heavy rain is expected tomorrow morning. Replace beach activities with indoor museums and local food experiences."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>
          </div>

          <div className="ai-modal-footer">
            <button type="button" className="btn-minimal-outline" style={{ color: '#64748b' }} onClick={onClose} disabled={isReplanning}>
              Cancel
            </button>
            <button type="submit" className="ai-replan-btn" disabled={isReplanning}>
              {isReplanning ? (
                <>
                  <i className="fa fa-spinner fa-spin" /> Re-Planning Itinerary...
                </>
              ) : (
                <>
                  <i className="fa fa-magic" /> Re-Plan Day {targetDay} Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
