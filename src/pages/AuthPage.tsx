import './allPage.css';
import { IPage } from '../interfaces/page';
import { Login } from '../auth/Login';
import { RouteComponentProps } from 'react-router-dom';
import { Signup } from '../auth/Signup';
import React, { useState } from 'react';

const AuthPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = (props) => {
    const [titre, setTitre] = useState('');

    function PageRender(): JSX.Element {
        // eslint-disable-next-line react/prop-types
        const type = props.match.params.type;

        if (type === 'login') {
            setTitre("S'identifier !");

            return (
                <div className="AuthPage-content-form-login">
                    <Login />
                </div>
            );
        } else if (type === 'signup') {
            setTitre("S'inscrire !");

            return (
                <div className="AuthPage-content-form-signup">
                    <Signup />
                </div>
            );
        } else {
            return (
                <div>
                    <h1>404</h1>
                </div>
            );
        }
    }

    return (
        <div className="AuthPage">
            <h1 className="Titre2">{titre}</h1>
            <div className="AuthPage-content">
                <PageRender />
            </div>
        </div>
    );
};

export { AuthPage };
