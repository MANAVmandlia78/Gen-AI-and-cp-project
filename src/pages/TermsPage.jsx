import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import PageHeading from '../components/PageHeading';

const termsSections = [
  {
    title: 'Booking & Payment Terms',
    content: 'All bookings require a minimum 30% advance payment to confirm your reservation. The remaining balance must be paid at least 7 days prior to the travel departure date. Payments can be made via bank transfer (NEFT/IMPS), UPI, credit/debit card, or cheque. All quoted prices are per person on a twin-sharing basis unless stated otherwise.\n\nFor peak season travel (October to February for most destinations), we recommend booking at least 30 days in advance to ensure hotel and vehicle availability. A booking confirmation voucher will be issued within 24 hours of receiving your advance payment.',
  },
  {
    title: 'Cancellation & Refund Policy',
    content: 'Cancellations made 30 or more days before the departure date are eligible for a full refund minus a ₹500 processing fee. Cancellations between 15 to 29 days before departure will receive a 75% refund. Cancellations between 7 to 14 days before departure will receive a 50% refund.\n\nNo refund will be issued for cancellations made within 7 days of the departure date, or for no-shows. Refunds are processed within 7–10 business days to the original payment method. In case of cancellations due to natural disasters or government advisories, a full credit note will be issued valid for 12 months.',
  },
  {
    title: 'Travel Insurance & Liability',
    content: 'Maharaja Tours & Travels strongly recommends that all travellers purchase comprehensive travel insurance before departure. While we take every precaution to ensure your safety and comfort, we are not liable for any loss, injury, or damage arising from accidents, natural calamities, flight cancellations, or events beyond our control.\n\nOur partner hotels and transport providers carry their own liability insurance. In case of any medical emergency during the trip, our on-ground coordinator will assist with hospital arrangements and insurance claim documentation.',
  },
  {
    title: 'Itinerary Changes & Force Majeure',
    content: 'While we make every effort to adhere to the planned itinerary, Maharaja Tours & Travels reserves the right to modify the sequence or components of any package due to weather conditions, road closures, local festivals, political unrest, or other unforeseen circumstances.\n\nIn such cases, equivalent alternatives will be provided at no additional cost. If a significant portion of the itinerary cannot be fulfilled, a proportional refund or credit will be offered. Travellers are responsible for carrying valid government-issued photo identification at all times during the trip.',
  },
];

export default function TermsPage() {
  return (
    <>
      <Preloader />
      <Navbar />

      <PageHeading
        bgImage="/assets/images/jaipur-2.jpg"
        subtitle="Please read our policies carefully"
        title="Terms & Conditions"
      />

      <div className="team-members">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-heading">
                <h2>Terms of Service — Maharaja Tours & Travels</h2>
              </div>
              {termsSections.map((section, i) => (
                <div key={i}>
                  <h5>{section.title}</h5>
                  {section.content.split('\n\n').map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                  {i < termsSections.length - 1 && <><br /><br /></>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
