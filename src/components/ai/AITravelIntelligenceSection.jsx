import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AIItineraryDisplay from './AIItineraryDisplay';
import AIReplannerModal from './AIReplannerModal';
import AIAgentTraceModal from './AIAgentTraceModal';
import AIPerformanceMemoryModal from './AIPerformanceMemoryModal';
import BookingModal from '../BookingModal';
import './aiTravel.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const QUICK_PRESETS = [
  {
    label: 'Goa',
    tag: 'Coastal Holiday',
    image: '/assets/images/goa-1.jpg',
    destination: 'Goa',
    duration: 5,
    travelers: 3,
    budget: 30000,
    style: 'Balanced',
    interests: ['Beaches', 'Local Food', 'Nightlife']
  },
  {
    label: 'Manali',
    tag: 'Snow & Valleys',
    image: '/assets/images/manali.jpg',
    destination: 'Manali',
    duration: 5,
    travelers: 2,
    budget: 28000,
    style: 'Adventure',
    interests: ['Mountains', 'Nature', 'Local Food']
  },
  {
    label: 'Rajasthan',
    tag: 'Royal Heritage',
    image: '/assets/images/jaipur.jpg',
    destination: 'Jaipur, Rajasthan',
    duration: 6,
    travelers: 2,
    budget: 45000,
    style: 'Cultural Heritage',
    interests: ['Heritage', 'Local Food', 'Scenic Views']
  },
  {
    label: 'Kerala',
    tag: 'Backwaters & Hills',
    image: '/assets/images/kerala.jpg',
    destination: 'Kerala',
    duration: 6,
    travelers: 4,
    budget: 65000,
    style: 'Relaxed & Luxury',
    interests: ['Nature', 'Relaxation', 'Local Food']
  },
  {
    label: 'Kashmir',
    tag: 'Paradise on Earth',
    image: '/assets/images/kashmir.jpg',
    destination: 'Kashmir',
    duration: 7,
    travelers: 2,
    budget: 52000,
    style: 'Relaxed & Luxury',
    interests: ['Scenic Views', 'Nature', 'Heritage']
  }
];

const AVAILABLE_INTERESTS = [
  'Beaches',
  'Local Food',
  'Nightlife',
  'Mountains',
  'Heritage',
  'Nature',
  'Relaxation',
  'Scenic Views'
];

export default function AITravelIntelligenceSection({ defaultPreset = null, standalone = false }) {
  const { user, token } = useAuth();

  // Form State
  const [destination, setDestination] = useState('Goa');
  const [duration, setDuration] = useState(5);
  const [travelers, setTravelers] = useState(3);
  const [budget, setBudget] = useState(30000);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [selectedInterests, setSelectedInterests] = useState(['Beaches', 'Local Food', 'Nightlife']);
  const [foodPref, setFoodPref] = useState('Vegetarian Friendly');
  const [hotelPref, setHotelPref] = useState('3-star boutique or verified partner resort');

  // Generated State
  const [itinerary, setItinerary] = useState(null);
  const [replanDiff, setReplanDiff] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);

  // Status & Modals
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReplanning, setIsReplanning] = useState(false);
  const [activeAgentStep, setActiveAgentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  const [showReplanModal, setShowReplanModal] = useState(false);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [bookingPackageData, setBookingPackageData] = useState(null);

  // Load User Long-term Memory
  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE_URL}/ai/preferences`, { headers });
        const data = await res.json();
        if (data.success && data.preferences) {
          setUserPreferences(data.preferences);
          if (data.preferences.foodPreferences?.length > 0) {
            setFoodPref(data.preferences.foodPreferences[0]);
          }
          if (data.preferences.hotelPreference) {
            setHotelPref(data.preferences.hotelPreference);
          }
        }
      } catch (err) {
        console.warn('Preferences load note:', err);
      }
    };
    fetchMemory();
  }, [token]);

  // Apply default preset if provided
  useEffect(() => {
    if (defaultPreset) {
      applyPreset(defaultPreset);
    }
  }, [defaultPreset]);

  const applyPreset = (preset) => {
    setDestination(preset.destination);
    setDuration(preset.duration);
    setTravelers(preset.travelers);
    setBudget(preset.budget);
    setTravelStyle(preset.style);
    setSelectedInterests(preset.interests);
  };

  const handleInterestToggle = (item) => {
    setSelectedInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  // Generate Itinerary API call
  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setErrorMsg(null);
    setReplanDiff(null);
    setActiveAgentStep(1);

    // Agent animation ticker
    const timer1 = setTimeout(() => setActiveAgentStep(2), 400);
    const timer2 = setTimeout(() => setActiveAgentStep(3), 900);
    const timer3 = setTimeout(() => setActiveAgentStep(4), 1400);
    const timer4 = setTimeout(() => setActiveAgentStep(5), 1900);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const payload = {
        destination,
        duration: parseInt(duration, 10),
        travelers: parseInt(travelers, 10),
        targetBudget: parseFloat(budget) || null,
        travelDates: { start: startDate },
        interests: selectedInterests,
        foodPreferences: [foodPref],
        hotelPreference: hotelPref,
        travelStyle,
        avoidedActivities: userPreferences?.avoidedActivities || ['Activities before 9:00 AM']
      };

      const res = await fetch(`${API_BASE_URL}/ai/plan`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.itinerary) {
        throw new Error(data.message || 'Failed to generate itinerary. Please try again.');
      }

      setActiveAgentStep(6);
      setItinerary(data.itinerary);
    } catch (err) {
      console.error('AI Planning error:', err);
      setErrorMsg(err.message || 'Error communicating with AI engine.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setIsGenerating(false);
    }
  };

  // Dynamic Re-planning API call
  const handleReplanSubmit = async (replanPayload) => {
    setIsReplanning(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/ai/replan`, {
        method: 'POST',
        headers,
        body: JSON.stringify(replanPayload)
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.itinerary) {
        throw new Error(data.message || 'Re-planning request failed.');
      }

      setItinerary(data.itinerary);
      setReplanDiff(data.replanDiff);
      setShowReplanModal(false);
    } catch (err) {
      alert(`Re-planning notice: ${err.message}`);
    } finally {
      setIsReplanning(false);
    }
  };

  // Save Long-term preferences
  const handleSavePreferences = async (newPrefs) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/ai/preferences`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ preferences: newPrefs })
      });
      const data = await res.json();
      if (data.success) {
        setUserPreferences(data.preferences);
      }
    } catch (err) {
      console.warn('Could not save preferences:', err);
    }
  };

  // Open booking modal
  const handleBookItinerary = (itin) => {
    setBookingPackageData({
      id: 999,
      title: `${itin.duration}-Day ${itin.destination} AI Bespoke Journey`,
      price_range: `₹${Number(itin.estimatedBudget).toLocaleString('en-IN')}`,
      nights: `${itin.duration - 1} Nights / ${itin.duration} Days`,
      location: itin.destination
    });
  };

  return (
    <section className={`ai-section ${standalone ? 'standalone-view' : ''}`} id="ai-travel-intelligence">
      <div className="container">
        {/* ── SECTION HEADER ── */}
        <div className="ai-header">
          <div className="ai-badge">
            <i className="fa fa-sparkles" /> Generative AI Travel Suite
          </div>
          <h2>
            AI Travel <span>Intelligence</span>
          </h2>
          <p className="ai-subtitle">
            &ldquo;Plan smarter. Travel better. Let AI build a journey around you.&rdquo;
          </p>

          {/* 5 Capabilities Strip */}
          <div className="ai-capabilities-strip">
            <span className="ai-cap-pill">
              <i className="fa fa-database" /> RAG Knowledge
            </span>
            <span className="ai-cap-pill">
              <i className="fa fa-sitemap" /> Multi-Agent System
            </span>
            <span className="ai-cap-pill">
              <i className="fa fa-wrench" /> Tool Calling
            </span>
            <span className="ai-cap-pill">
              <i className="fa fa-user-circle" /> Memory &amp; Personalization
            </span>
            <span className="ai-cap-pill">
              <i className="fa fa-refresh" /> Dynamic Re-Planning
            </span>
          </div>
        </div>

        {/* ── VISUAL PHOTO PRESETS TILES ── */}
        <div className="ai-preset-grid">
          {QUICK_PRESETS.map((p, idx) => {
            const isSelected = destination.toLowerCase().includes(p.label.toLowerCase());
            return (
              <div
                key={idx}
                className={`ai-preset-card ${isSelected ? 'active' : ''}`}
                onClick={() => applyPreset(p)}
              >
                <img src={p.image} alt={p.label} loading="lazy" />
                <div className="ai-preset-card__overlay">
                  <span className="ai-preset-card__title">{p.label}</span>
                  <div className="ai-preset-card__meta">
                    <span>{p.tag}</span>
                    <span>₹{p.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MINIMAL PLANNER FORM ── */}
        <div className="ai-planner-card">
          <form onSubmit={handleGenerate}>
            <div className="ai-planner-grid">
              {/* Destination */}
              <div className="ai-form-group span-2">
                <label className="ai-label">
                  <i className="fa fa-map-marker" /> Destination
                </label>
                <input
                  type="text"
                  className="ai-input"
                  placeholder="e.g. Goa, Manali, Jaipur, Kerala, Kashmir"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              {/* Start Date */}
              <div className="ai-form-group">
                <label className="ai-label">
                  <i className="fa fa-calendar" /> Travel Date
                </label>
                <input
                  type="date"
                  className="ai-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              {/* Duration */}
              <div className="ai-form-group">
                <label className="ai-label">
                  <i className="fa fa-clock-o" /> Duration
                </label>
                <select
                  className="ai-select"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value={3}>3 Days (Weekend)</option>
                  <option value={4}>4 Days</option>
                  <option value={5}>5 Days (Recommended)</option>
                  <option value={6}>6 Days</option>
                  <option value={7}>7 Days (Full Week)</option>
                  <option value={9}>9 Days (Circuit)</option>
                </select>
              </div>

              {/* Travelers */}
              <div className="ai-form-group">
                <label className="ai-label">
                  <i className="fa fa-users" /> Travelers
                </label>
                <div className="ai-segmented">
                  {[1, 2, 3, 4, 6].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={`ai-segmented-btn ${travelers === num ? 'active' : ''}`}
                      onClick={() => setTravelers(num)}
                    >
                      {num === 6 ? '6+' : num} {num === 1 ? 'Solo' : num === 2 ? 'Couple' : 'Pax'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Budget */}
              <div className="ai-form-group">
                <label className="ai-label">
                  <i className="fa fa-inr" /> Budget Limit (₹)
                </label>
                <input
                  type="number"
                  className="ai-input"
                  placeholder="e.g. 30000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  step={1000}
                />
              </div>

              {/* Travel Style */}
              <div className="ai-form-group">
                <label className="ai-label">
                  <i className="fa fa-compass" /> Travel Style
                </label>
                <select
                  className="ai-select"
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                >
                  <option value="Balanced">Balanced Sightseeing</option>
                  <option value="Adventure">Adventure &amp; Outdoors</option>
                  <option value="Relaxed & Luxury">Relaxed &amp; Luxury Resort</option>
                  <option value="Cultural Heritage">Cultural &amp; Heritage</option>
                  <option value="Budget Backpacker">Budget Friendly</option>
                </select>
              </div>

              {/* Food Preference */}
              <div className="ai-form-group">
                <label className="ai-label">
                  <i className="fa fa-cutlery" /> Food Style
                </label>
                <select
                  className="ai-select"
                  value={foodPref}
                  onChange={(e) => setFoodPref(e.target.value)}
                >
                  <option value="Vegetarian Friendly">Vegetarian Friendly</option>
                  <option value="Pure Vegetarian (Jain)">Pure Vegetarian (Jain)</option>
                  <option value="Fresh Local Seafood">Fresh Local Seafood</option>
                  <option value="Authentic Regional Flavors">Authentic Regional Flavors</option>
                  <option value="Multi-Cuisine">Multi-Cuisine</option>
                </select>
              </div>

              {/* Interests Tags Selection */}
              <div className="ai-form-group span-4">
                <label className="ai-label">
                  <i className="fa fa-heart" /> Trip Vibes &amp; Interests
                </label>
                <div className="ai-tags-wrap">
                  {AVAILABLE_INTERESTS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`ai-tag-btn ${selectedInterests.includes(tag) ? 'selected' : ''}`}
                      onClick={() => handleInterestToggle(tag)}
                    >
                      {selectedInterests.includes(tag) ? <i className="fa fa-check" /> : '+'} {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div style={{
                marginTop: '16px',
                padding: '10px 14px',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                borderRadius: '8px',
                fontSize: '13px'
              }}>
                <i className="fa fa-exclamation-triangle" /> {errorMsg}
              </div>
            )}

            {/* Planner Actions Toolbar */}
            <div className="ai-planner-actions">
              <button
                type="button"
                className="ai-memory-btn"
                onClick={() => setShowMemoryModal(true)}
              >
                <i className="fa fa-sliders" />
                <span>Memory &amp; Preferences {userPreferences ? '✓' : ''}</span>
              </button>

              <button
                type="submit"
                className="ai-generate-btn"
                disabled={isGenerating || !destination}
              >
                {isGenerating ? (
                  <>
                    <i className="fa fa-spinner fa-spin" /> Synthesizing Plan...
                  </>
                ) : (
                  <>
                    <i className="fa fa-magic" /> ✨ Generate Journey
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ── LIVE AGENT EXECUTION HUD ── */}
          {isGenerating && (
            <div className="ai-agent-hud">
              <div className="ai-hud-header">
                <div className="ai-hud-title">
                  <div className="ai-hud-spinner" />
                  <span>Autonomous Multi-Agent Orchestration in Progress...</span>
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Grounded RAG &amp; Tools</span>
              </div>

              <div className="ai-hud-agents-grid">
                <div className={`ai-agent-chip ${activeAgentStep === 1 ? 'active' : activeAgentStep > 1 ? 'done' : ''}`}>
                  <i className="fa fa-sitemap" />
                  <span>Orchestrator</span>
                </div>
                <div className={`ai-agent-chip ${activeAgentStep === 2 ? 'active' : activeAgentStep > 2 ? 'done' : ''}`}>
                  <i className="fa fa-search" />
                  <span>Research Agent</span>
                </div>
                <div className={`ai-agent-chip ${activeAgentStep === 3 ? 'active' : activeAgentStep > 3 ? 'done' : ''}`}>
                  <i className="fa fa-calculator" />
                  <span>Budget Agent</span>
                </div>
                <div className={`ai-agent-chip ${activeAgentStep === 4 ? 'active' : activeAgentStep > 4 ? 'done' : ''}`}>
                  <i className="fa fa-bed" />
                  <span>Lodging Agent</span>
                </div>
                <div className={`ai-agent-chip ${activeAgentStep === 5 ? 'active' : activeAgentStep > 5 ? 'done' : ''}`}>
                  <i className="fa fa-compass" />
                  <span>Activity Agent</span>
                </div>
                <div className={`ai-agent-chip ${activeAgentStep === 6 ? 'active' : activeAgentStep > 6 ? 'done' : ''}`}>
                  <i className="fa fa-calendar-check-o" />
                  <span>Itinerary Agent</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── GENERATED ITINERARY VIEW ── */}
        {itinerary && (
          <AIItineraryDisplay
            itinerary={itinerary}
            replanDiff={replanDiff}
            onOpenReplanModal={() => setShowReplanModal(true)}
            onOpenAgentTraceModal={() => setShowTraceModal(true)}
            onBookItinerary={handleBookItinerary}
            onDismissDiff={() => setReplanDiff(null)}
          />
        )}
      </div>

      {/* ── MODALS ── */}
      <AIPerformanceMemoryModal
        isOpen={showMemoryModal}
        onClose={() => setShowMemoryModal(false)}
        userPreferences={userPreferences}
        onSavePreferences={handleSavePreferences}
      />

      <AIReplannerModal
        isOpen={showReplanModal}
        onClose={() => setShowReplanModal(false)}
        itinerary={itinerary}
        onReplanSubmit={handleReplanSubmit}
        isReplanning={isReplanning}
      />

      <AIAgentTraceModal
        isOpen={showTraceModal}
        onClose={() => setShowTraceModal(false)}
        agentTrace={itinerary?.agentTrace}
        toolCalls={itinerary?.toolCalls}
      />

      {bookingPackageData && (
        <BookingModal
          packageData={bookingPackageData}
          onClose={() => setBookingPackageData(null)}
        />
      )}
    </section>
  );
}
