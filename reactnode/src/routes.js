import React from 'react';

const Home = React.lazy(() => import('./views/Home'));
const Checkout = React.lazy(() => import('./views/Checkout'));
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/check-in', exact: true, name: 'Home', component: Home},
  { path: '/check-out', exact: true, name: 'checkout', component: Checkout}
];

export default routes;
