import React, { useRef } from 'react';
import { IPage } from '../../../interfaces/page';
import { RouteComponentProps } from 'react-router-dom';

const Validation: React.FunctionComponent<IPage & RouteComponentProps<any>> = (props) => {
    const inputRef = useRef(null);
    // const history = useHistory();

    const onSubmit = (e): void => {
        e.preventDefault();
        console.log('value', inputRef.current.value);
        console.log(props);

        // history.push('/duplica/semaine');
    };

    return (
        <div>
            <h1>Insert a new value</h1>
            <form action="?" onSubmit={onSubmit}>
                <input ref={inputRef} type="text" />
                <button>Save new value</button>
            </form>
        </div>
    );
};

export { Validation };
