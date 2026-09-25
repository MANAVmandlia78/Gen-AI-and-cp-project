import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestimonialsPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/about', { replace: true });
  }, [navigate]);

  return null;
}
