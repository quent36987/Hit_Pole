import PropTypes from 'prop-types';
import React from 'react';
import { User } from '../../data/User';
import { UserForm } from '../../componants/UserForm';
import { Button, OverlayTrigger, Popover, Table } from 'react-bootstrap';

const TabUsers = (props): JSX.Element => {
    const PopoverUser = (user: User): JSX.Element => (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Modification {user.getFullName}</Popover.Header>
            <Popover.Body>
                <UserForm user={user} cb={props.getAllUser} />
            </Popover.Body>
        </Popover>
    );

    return (
        <>
            <Table responsive>
                <thead>
                    <tr>
                        <th>Prenom</th>
                        <th>Nom</th>
                        <th>Tel</th>
                        <th>Commentaire</th>
                        <th>Modifier</th>
                    </tr>
                </thead>
                <tbody>
                    {props.users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.prenom}</td>
                            <td>{user.nom}</td>
                            <td>{user.tel}</td>
                            <td>{user.commentaire} </td>
                            <td>
                                <OverlayTrigger
                                    trigger="click"
                                    placement="left"
                                    overlay={PopoverUser(user)}>
                                    <Button variant="success-outline"> ✏️</Button>
                                </OverlayTrigger>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

TabUsers.propTypes = {
    users: PropTypes.arrayOf(PropTypes.instanceOf(User)),
    getAllUser: PropTypes.func
};

export { TabUsers };
