import { useState, useEffect } from 'react';

export default function AIPerformanceMemoryModal({ isOpen, onClose, userPreferences, onSavePreferences }) {
  const [formData, setFormData] = useState({
    budgetTier: 'moderate',
    foodPreferences: ['Vegetarian Friendly'],
    hotelPreference: '3-star boutique or verified partner resort',
    preferredStyle: 'Balanced',
    wakeUpTime: '08:30',
    preferredActivities: ['Sightseeing', 'Local Food', 'Scenic Views'],
    avoidedActivities: ['Activities before 9:00 AM'],
    customNotes: ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (userPreferences) {
      setFormData({
        budgetTier: userPreferences.budgetTier || 'moderate',
        foodPreferences: userPreferences.foodPreferences || ['Vegetarian Friendly'],
        hotelPreference: userPreferences.hotelPreference || '3-star boutique or verified partner resort',
        preferredStyle: userPreferences.preferredStyle || 'Balanced',
        wakeUpTime: userPreferences.wakeUpTime || '08:30',
        preferredActivities: userPreferences.preferredActivities || ['Sightseeing', 'Local Food'],
        avoidedActivities: userPreferences.avoidedActivities || ['Activities before 9:00 AM'],
        customNotes: userPreferences.customNotes || ''
      });
    }
  }, [userPreferences]);

  if (!isOpen) return null;

  const handleFoodToggle = (item) => {
    setFormData(prev => {
      const exists = prev.foodPreferences.includes(item);
      return {
        ...prev,
        foodPreferences: exists
          ? prev.foodPreferences.filter(x => x !== item)
          : [...prev.foodPreferences, item]
      };
    });
  };

  const handleAvoidedToggle = (item) => {
    setFormData(prev => {
      const exists = prev.avoidedActivities.includes(item);
      return {
        ...prev,
        avoidedActivities: exists
          ? prev.avoidedActivities.filter(x => x !== item)
          : [...prev.avoidedActivities, item]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSavePreferences(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="ai-modal-backdrop" onClick={onClose}>
      <div className="ai-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="ai-modal-header">
          <h3>
            <i className="fa fa-sliders" style={{ color: '#8b5cf6' }} />
            AI Travel Memory &amp; Personalization
          </h3>
          <button className="ai-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="ai-modal-body">
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: 0, marginBottom: '20px' }}>
              Your long-term travel memory is automatically remembered across your trips. The AI agents reference these preferences whenever crafting itineraries.
            </p>

            {/* Dietary Preferences */}
            <div className="ai-form-group" style={{ marginBottom: '18px' }}>
              <label className="ai-label">
                <i className="fa fa-cutlery" /> Dietary &amp; Food Preferences
              </label>
              <div className="ai-tags-wrap">
                {['Vegetarian Friendly', 'Pure Vegetarian (Jain)', 'Vegan', 'Fresh Seafood', 'Authentic Local Flavors', 'Halal Friendly'].map(diet => (
                  <button
                    key={diet}
                    type="button"
                    className={`ai-tag-btn ${formData.foodPreferences.includes(diet) ? 'selected' : ''}`}
                    onClick={() => handleFoodToggle(diet)}
                  >
                    {formData.foodPreferences.includes(diet) && <i className="fa fa-check" />} {diet}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Wake Up & Morning Pace */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div className="ai-form-group">
                <label className="ai-label">
                  <i className="fa fa-sun-o" /> Preferred Wake-up Time
                </label>
                <select
                  className="ai-select"
                  value={formData.wakeUpTime}
                  onChange={(e) => setFormData({ ...formData, wakeUpTime: e.target.value })}
                >
                  <option value="07:30">07:30 AM (Early Bird)</option>
                  <option value="08:30">08:30 AM (Moderate Morning)</option>
                  <option value="09:30">09:30 AM (Relaxed &amp; Late Morning)</option>
                </select>
              </div>

              <div className="ai-form-group">
                <label className="ai-label">
                  <i className="fa fa-shield" /> Budget Tier
                </label>
                <select
                  className="ai-select"
                  value={formData.budgetTier}
                  onChange={(e) => setFormData({ ...formData, budgetTier: e.target.value })}
                >
                  <option value="budget">Budget Friendly</option>
                  <option value="moderate">Moderate / Standard</option>
                  <option value="luxury">Luxury / Royal Heritage</option>
                </select>
              </div>
            </div>

            {/* Avoided Activities */}
            <div className="ai-form-group" style={{ marginBottom: '18px' }}>
              <label className="ai-label">
                <i className="fa fa-ban" /> Activities to Avoid / Exclude
              </label>
              <div className="ai-tags-wrap">
                {[
                  'Activities before 9:00 AM',
                  'Overcrowded tourist traps',
                  'Extreme water sports',
                  'Long strenuous mountain treks',
                  'Late night drives'
                ].map(item => (
                  <button
                    key={item}
                    type="button"
                    className={`ai-tag-btn ${formData.avoidedActivities.includes(item) ? 'selected' : ''}`}
                    onClick={() => handleAvoidedToggle(item)}
                  >
                    {formData.avoidedActivities.includes(item) ? <i className="fa fa-ban" /> : '+'} {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes */}
            <div className="ai-form-group">
              <label className="ai-label">
                <i className="fa fa-sticky-note-o" /> Custom Traveler Notes
              </label>
              <textarea
                className="ai-input"
                rows={2}
                placeholder="e.g. Traveling with elderly parents; prefer elevator access and low walking distances."
                value={formData.customNotes}
                onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
              />
            </div>

            {savedSuccess && (
              <div style={{
                marginTop: '16px',
                padding: '10px 14px',
                background: '#dcfce7',
                border: '1px solid #86efac',
                color: '#15803d',
                borderRadius: '8px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fa fa-check-circle" /> Long-term travel memory updated successfully!
              </div>
            )}
          </div>

          <div className="ai-modal-footer">
            <button type="button" className="btn-minimal-outline" style={{ color: '#64748b' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-minimal-primary">
              <i className="fa fa-floppy-o" /> Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
