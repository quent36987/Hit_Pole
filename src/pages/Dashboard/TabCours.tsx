import { Item } from '../../data/Item';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { User } from '../../data/User';
import { Button, OverlayTrigger, Popover, Table } from 'react-bootstrap';
import { dateTimeAbv, getUserName } from '../../Utils/utils';

const TabCours = (props): JSX.Element => {
    const history = useHistory();

    const popover = (list): JSX.Element => (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Inscrits :</Popover.Header>
            <Popover.Body>
                {list.map((user, index) => (
                    <div key={index}>
                        <div>{user}</div>
                    </div>
                ))}
            </Popover.Body>
        </Popover>
    );

    async function callBack(item: Item): Promise<void> {
        try {
            props.deleteItem(item);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Table responsive>
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Date</th>
                        <th>Nombre inscription</th>
                        <th>Temps</th>
                        <th>Commentaire</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((item: Item) => (
                        <tr key={item.id}>
                            <td>
                                {item.titre} - {item.niveau}
                            </td>
                            <td>{dateTimeAbv(item.date.toDate())}</td>
                            <td>
                                {item.users.length} / {item.place}
                            </td>
                            <td>{item.temps}</td>
                            <td>{item.desc}</td>
                            <td>
                                <OverlayTrigger
                                    trigger="click"
                                    placement="left"
                                    overlay={popover(
                                        item.users.map((u) => getUserName(props.users, u))
                                    )}>
                                    <Button variant="success-outline">❔</Button>
                                </OverlayTrigger>
                            </td>
                            <td>
                                <Button
                                    variant="outline-warning"
                                    onClick={() => {
                                        history.push(`/modif/${item.id}`);
                                    }}>
                                    ✏️
                                </Button>
                            </td>
                            <td>
                                <Button
                                    variant="outline-success"
                                    onClick={() => {
                                        history.push(`/particip/${item.id}`);
                                    }}>
                                    ✔️
                                </Button>
                            </td>
                            <td>
                                <Button
                                    variant="outline-info"
                                    onClick={() => {
                                        history.push(`/coursinfo/${item.id}`);
                                    }}>
                                    🧑‍🤝‍🧑
                                </Button>
                            </td>
                            <td>
                                <Button
                                    variant="outline-danger"
                                    onClick={async () => await callBack(item)}>
                                    🗑️
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

TabCours.propTypes = {
    data: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
    users: PropTypes.arrayOf(PropTypes.instanceOf(User)),
    deleteItem: PropTypes.func
};

export { TabCours };
