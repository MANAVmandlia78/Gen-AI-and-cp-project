/**
 * PageHeading - reusable inner-page banner with background image
 * Props: bgImage (string), subtitle (string), title (string)
 */
export default function PageHeading({ bgImage, subtitle, title }) {
  return (
    <div
      className="page-heading about-heading header-text"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="text-content">
              <h4>{subtitle}</h4>
              <h2>{title}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
