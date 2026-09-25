import { Link } from 'react-router-dom';

/**
 * ServiceItem - reusable blog/service card
 * Props: image, title, author, date, views, link
 */
export default function ServiceItem({ image, title, author, date, views, link = '/blog/1' }) {
  return (
    <div className="service-item">
      <Link to={link} className="services-item-image">
        <img src={image} className="img-fluid" alt={title} />
      </Link>
      <div className="down-content">
        <h4><Link to={link}>{title}</Link></h4>
        <p style={{ margin: 0 }}>
          {author}&nbsp;&nbsp;|&nbsp;&nbsp;{date}&nbsp;&nbsp;|&nbsp;&nbsp;{views}
        </p>
      </div>
    </div>
  );
}
