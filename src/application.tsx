import { Alert } from './componants/Alert';
import { HeaderBar } from './componants/Header';
import logging from './config/logging';
import { routes } from './config/routes';
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';
import React, { useEffect } from 'react';

const Application: React.FunctionComponent<{}> = (props) => {
    useEffect(() => {
        logging.info('Loading application.');
    }, []);

    return (
        <div>
            <BrowserRouter>
                <HeaderBar />
                <Switch>
                    {routes.map((route, index) => {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                render={(props: RouteComponentProps<any>) => (
                                    <route.component
                                        name={route.name}
                                        {...props}
                                        {...route.props}
                                    />
                                )}
                            />
                        );
                    })}
                </Switch>
                <Alert />
            </BrowserRouter>
        </div>
    );
};

export default Application;
