import React, { Suspense , useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {Link} from 'react-router-dom';
import routes from '../../routes';
const Navigation = () => {

    return (
        <div className={"text-center"}>
            {/*<nav className="navbar sticky-top navbar-light bg-light">*/}
            {/*    */}
            {/*    <Link to={"/check-in"} className="navbar-brand">Check In</Link>*/}
            {/*    <Link to={"/check-out"} className="navbar-brand">Check Out</Link>*/}
            {/*</nav>*/}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top">
                <div className="container">
                    <Link to={"/check-in"} className="navbar-brand">Entry Level App</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active">
                                <Link to={"/check-in"} className="nav-link">Check In <span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link to={"/check-out"} className="nav-link">Check Out <span className="sr-only">(current)</span></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Suspense fallback={'loading()'}>
                <Switch>
                    {routes.map((route, idx) => {
                        return route.component ? (
                            <Route
                                key={idx}
                                path={route.path}
                                exact={route.exact}
                                name={route.name}
                                render={props => (
                                    <route.component {...props} />
                                )} />
                        ) : (null);
                    })}
                    <Redirect from="/" to="/check-in" />
                </Switch>
            </Suspense>
        </div>
    )
}

export default Navigation;