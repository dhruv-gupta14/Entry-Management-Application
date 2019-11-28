//Load the Required component or modules
import React from 'react';
import { BrowserRouter , Route, Link } from 'react-router-dom';
import Layout from './components/containers/Layout';

import './App.css';

function App() {

  return (
      <BrowserRouter>
          {/*Load the Layout*/}
        <Layout>
            {/*Load Initial Route*/}
            <Route path="/"  />
        </Layout>
      </BrowserRouter>
  );
}
 
export default App;
