import { Link } from 'react-router-dom';

/**
 * ProductCard - Modern minimal vacation package card
 * Props: image, title, price, description, season, nights, location, link
 */
export default function ProductCard({
  image,
  title,
  price,
  description,
  season,
  nights,
  location,
  link = '/packages/1'
}) {
  return (
    <article className="hp-pkg-card-minimal">
      <div className="hp-pkg-card-minimal__image">
        <Link to={link} tabIndex={-1}>
          <img
            src={image || '/assets/images/kerala.jpg'}
            alt={title}
            loading="lazy"
            onError={(e) => { e.target.src = '/assets/images/kerala.jpg'; }}
          />
        </Link>
        {nights && (
          <span className="hp-pkg-card-minimal__duration">
            <i className="fa fa-clock-o" style={{ marginRight: '4px' }} />
            {nights}
          </span>
        )}
        {season && (
          <span className="hp-pkg-card-minimal__season">
            {season}
          </span>
        )}
      </div>
      <div className="hp-pkg-card-minimal__body">
        {location && (
          <div className="hp-pkg-card-minimal__location">
            <i className="fa fa-map-marker" /> {location}
          </div>
        )}
        <h3 className="hp-pkg-card-minimal__title">
          <Link to={link}>{title}</Link>
        </h3>
        {description && (
          <p className="hp-pkg-card-minimal__desc">
            {description.length > 115 ? `${description.substring(0, 115)}...` : description}
          </p>
        )}
        <div className="hp-pkg-card-minimal__footer">
          <div className="hp-pkg-card-minimal__price">
            <span>Starting from</span>
            <strong>{price}</strong>
          </div>
          <Link to={link} className="hp-pkg-card-minimal__btn">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
