import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="sf-top">
        <div className="container">
          <div className="row">
            {/* Brand */}
            <div className="col-lg-4 col-md-6">
              <div className="sf-brand">
                <h3>Maharaja Tours <em>&amp; Travels</em></h3>
                <p>We craft unforgettable travel experiences — from tropical escapes to mountain adventures. Your dream holiday is just a click away.</p>
                <ul className="sf-socials">
                  <li><a href="#" aria-label="Facebook"><i className="fa fa-facebook"></i></a></li>
                  <li><a href="#" aria-label="Twitter"><i className="fa fa-twitter"></i></a></li>
                  <li><a href="#" aria-label="Instagram"><i className="fa fa-instagram"></i></a></li>
                  <li><a href="#" aria-label="LinkedIn"><i className="fa fa-linkedin"></i></a></li>
                </ul>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6">
              <div className="sf-col">
                <h5>Quick Links</h5>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/packages">Packages</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>
            </div>

            {/* More Links */}
            <div className="col-lg-2 col-md-6">
              <div className="sf-col">
                <h5>More</h5>
                <ul>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/terms">Terms &amp; Conditions</Link></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">FAQs</a></li>
                  <li><a href="#">Careers</a></li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="col-lg-4 col-md-6">
              <div className="sf-col">
                <h5>Get In Touch</h5>
                <ul className="sf-contact-list">
                  <li><i className="fa fa-map-marker"></i> Talav Gate, Zanzarda Road, Junagadh, Gujarat</li>
                  <li><i className="fa fa-phone"></i> <a href="tel:9157355055">+91 91573 55055</a></li>
                  <li><i className="fa fa-envelope"></i> <a href="mailto:info@maharajatours.com">info@maharajatours.com</a></li>
                  <li><i className="fa fa-clock-o"></i> Mon–Fri: 9:00 AM – 6:00 PM</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="sf-bottom">
        <div className="container">
          <div className="sf-bottom__inner">
            <p>&copy; 2024 Maharaja Tours &amp; Travels. All rights reserved.</p>
            <div className="sf-bottom__payments">
              <span title="Visa"><i className="fa fa-cc-visa"></i></span>
              <span title="Mastercard"><i className="fa fa-cc-mastercard"></i></span>
              <span title="PayPal"><i className="fa fa-cc-paypal"></i></span>
              <span title="Amex"><i className="fa fa-cc-amex"></i></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
