import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import PageHeading from '../components/PageHeading';

export default function AboutPage() {
  return (
    <>
      <Preloader />
      <Navbar />

      <PageHeading
        bgImage="/assets/images/kashmir-2.jpg"
        subtitle="about us"
        title="Our Story"
      />

      {/* About Content */}
      <div className="best-features about-features">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-heading">
                <h2>Crafting Memorable Journeys Across Incredible India</h2>
              </div>
            </div>
            <div className="col-md-6">
              <div className="right-image">
                <img src="/assets/images/goa-2.jpg" alt="About Maharaja Tours & Travels" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="left-content">
                <h4>Maharaja Tours & Travels — Your Trusted Travel Partner Since 2010</h4>
                <p>
                  Founded in the historic city of Junagadh, Gujarat, Maharaja Tours & Travels has been curating
                  unforgettable travel experiences across India for over a decade. What started as a small family-run
                  business has grown into one of Gujarat's most trusted travel agencies, serving thousands of happy
                  travellers every year.
                  <br /><br />
                  Our team of experienced travel planners specialises in creating personalised itineraries for families,
                  couples, corporate groups, and solo travellers. From the snow-capped peaks of Kashmir to the tropical
                  backwaters of Kerala, from the royal palaces of Rajasthan to the serene beaches of Goa — we handle
                  every detail so you can focus on making memories.
                </p>
                <ul className="social-icons">
                  <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                  <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                  <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                  <li><a href="#"><i className="fa fa-whatsapp"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="team-members">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-heading">
                <h2>What Sets Us Apart</h2>
              </div>
              <h5>Personalised Service, Transparent Pricing, and Unwavering Commitment</h5>
              <p>
                At Maharaja Tours & Travels, we believe that every journey should be as unique as the traveller.
                Unlike mass-market tour operators, we take the time to understand your preferences — whether you need
                pure vegetarian or Jain meal arrangements, prefer heritage properties over modern hotels, or want
                off-the-beaten-path experiences that most tourists miss.
                <br /><br />
                Every package comes with a dedicated trip coordinator who is available round the clock during your
                travel. Our network of verified partner hotels, experienced chauffeurs, and trusted local guides
                ensures that you receive consistent quality at every touchpoint of your journey.
              </p>
              <p>
                We are proud to maintain a 95% customer satisfaction rate and most of our business comes through
                word-of-mouth referrals from our happy clients. Our pricing is completely transparent with no hidden
                costs — what we quote is what you pay.
                <br /><br />
                Whether it's a weekend getaway to Goa, a honeymoon in Kashmir, a family vacation to Kerala, or a
                pilgrimage circuit through Rajasthan — Maharaja Tours & Travels is your one-stop solution for
                seamless, memorable, and affordable travel experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
