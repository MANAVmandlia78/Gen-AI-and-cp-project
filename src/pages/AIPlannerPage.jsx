import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import PageHeading from '../components/PageHeading';
import AITravelIntelligenceSection from '../components/ai/AITravelIntelligenceSection';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function AIPlannerPage() {
  const { user, token } = useAuth();
  const [pastTrips, setPastTrips] = useState([]);
  const [selectedPastTrip, setSelectedPastTrip] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPastTrips = async () => {
      try {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE_URL}/ai/trips`, { headers });
        const data = await res.json();
        if (data.success && Array.isArray(data.trips)) {
          setPastTrips(data.trips);
        }
      } catch (err) {
        console.warn('Trips history fetch note:', err);
      }
    };
    fetchPastTrips();
  }, [token]);

  return (
    <>
      <Preloader />
      <Navbar />

      <PageHeading
        title="AI Travel Intelligence Suite"
        subtitle="Generative AI &bull; Multi-Agent Planning &bull; Factual RAG &bull; Tool Calling &bull; Dynamic Re-Planning"
        bgImage="/assets/images/kashmir.jpg"
      />

      <AITravelIntelligenceSection standalone={true} />

      {/* Past Itineraries History Section */}
      {pastTrips.length > 0 && (
        <section className="hp-section-minimal hp-section-minimal--white" style={{ paddingTop: '40px' }}>
          <div className="container">
            <div className="hp-section-header">
              <div>
                <h2>Your Saved AI Journeys ({pastTrips.length})</h2>
                <p>Access and re-open previous custom itineraries generated for your account.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {pastTrips.map((trip, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#f33f3f', background: 'rgba(243,63,63,0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                        {trip.destination}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {new Date(trip.createdAt || trip.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>
                      {trip.title || `${trip.duration}-Day Tour`}
                    </h4>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 14px' }}>
                      {trip.duration} Days &bull; {trip.travelers || 2} Travelers &bull; Approx ₹{Number(trip.estimatedBudget || trip.estimated_budget).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <button
                    className="btn-minimal-outline"
                    style={{ color: '#0f172a', borderColor: '#cbd5e1', fontSize: '13px', padding: '8px 14px', textAlign: 'center', justifyContent: 'center' }}
                    onClick={() => {
                      const element = document.getElementById('ai-travel-intelligence');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    View &amp; Modify Plan <i className="fa fa-arrow-right" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
