import React, { useEffect } from 'react';
import { Route, useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ render: RenderComponent, ...rest }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isCorouselRoute = location.pathname === '/login/corousel';

    if (!token && isCorouselRoute) {
      navigate('/login');
    }
  }, [navigate, location]);

  return <Route {...rest} render={() => (token ? <RenderComponent /> : null)} />;
};

export default ProtectedRoute;
