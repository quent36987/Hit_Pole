import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import './allPage.css';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import { RouteComponentProps } from 'react-router-dom';


const AuthPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
    const [titre,setTitre] = useState("");

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props.name])

      function PageRender() {
        let type = props.match.params.type;
        if (type === "login") {
            setTitre("Sign in !");
            return <div className="AuthPage-content-form-login">
                    <Login />
                </div>
        } else if (type === "signup") {
            setTitre("Signup !");
           return  <div className="AuthPage-content-form-signup">
                    <Signup />
                </div>
        }
        else
        {
            return <div>
                <h1>404</h1>
            </div>
        }
      } 

    return (
        <div className='AuthPage'>
            <h1 className='Titre2' >{titre}</h1>
            <div className="AuthPage-content">
              <PageRender/>
            </div>
        </div>
    )
}

export default AuthPage;
