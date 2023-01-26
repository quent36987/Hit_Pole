import { HeaderBar } from './componants/Header';
import { routes } from './config/routes';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';
import React from 'react';

const Application: React.FunctionComponent<{}> = (props) => {
    return (
        <BrowserRouter>
            <div id="app">
                <HeaderBar />

                {routes.map((route, index) => {
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            render={(props: RouteComponentProps<any>) => (
                                <route.component name={route.name} {...props} {...route.props} />
                            )}
                        />
                    );
                })}
            </div>
        </BrowserRouter>
    );
};

export default Application;
