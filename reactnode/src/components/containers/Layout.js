//Load the Required component or modules
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = (props) => {

    return (
        <div className={"container-fluid"}>
            {/*Load Header*/}
            <Header />
            {/*Load children components like check in form and check out form according the route url, check-in or check-out*/}
            {props.children}
            <Footer />
        </div>
    )
}

export default Layout;