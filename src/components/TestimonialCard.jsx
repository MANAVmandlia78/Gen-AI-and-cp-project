/**
 * TestimonialCard - individual testimonial
 * Props: name, quote
 */
export default function TestimonialCard({ name, quote }) {
  return (
    <div className="service-item">
      <div className="icon">
        <i className="fa fa-user"></i>
      </div>
      <div className="down-content">
        <h4>{name}</h4>
        <p className="n-m"><em>&ldquo;{quote}&rdquo;</em></p>
      </div>
    </div>
  );
}
