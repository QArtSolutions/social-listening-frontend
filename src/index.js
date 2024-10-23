import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Auth0Provider
    domain="dev-rf1ez2mo7tjh8ka5.us.auth0.com"
    clientId="UgK0bjtGXyNoqNWJWjKrrYmWbfKytrmf"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>
);
