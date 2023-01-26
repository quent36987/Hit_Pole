import React from 'react';
import { IPage } from '../../../interfaces/page';
import { Route, RouteComponentProps } from 'react-router-dom';
import { routes } from '../route';
import './duplication.css';

const DuplicationPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = (props) => {
    return (
        <div>
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
    );
};

export { DuplicationPage };
