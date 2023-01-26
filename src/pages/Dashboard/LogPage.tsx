import '../allPage.css';
import './dashboard.css';
import { dateTimeAbv } from '../../Utils/utils';
import { AppState } from '../../Context';
import { IPage } from '../../interfaces/page';
import { User } from '../../data/User';
import { Button, Table } from 'react-bootstrap';
import { ELogAction, Log } from '../../data/Log';
import { getAllUsersFirebase, getLogsFirebase } from '../../Utils/firebase/firebaseGet';
import React, { useEffect, useState } from 'react';
import { restoreLog } from '../../Utils/log';
import { useToast } from '../../toast';

const LogPage: React.FunctionComponent<IPage> = (props) => {
    const { user } = AppState();
    const toast = useToast();
    const [logs, setLogs] = useState<Log[]>([]);
    const [users, setusers] = useState<User[]>([]);

    useEffect(() => {
        loadData().catch(console.error);
    }, [props.name]);

    useEffect(() => {
        void getAllUsersFirebase().then((data) => {
            setusers(data);
        });
    }, [props]);

    async function loadData(): Promise<void> {
        const logs = await getLogsFirebase();
        setLogs(logs);
    }

    async function cancelLog(log: Log): Promise<void> {
        let message = '';
        let hasChoix = false;

        switch (log.action) {
            case ELogAction.Supression:
                hasChoix = true;

                message =
                    'Annuler la supresion du cours ? (il sera remis avec les mêmes informations, participant compris)';

                break;
            default:
                message = "l'annulation de cette action n'est pas encore disponible ";
                break;
        }

        if (hasChoix && window.confirm(message)) {
            await restoreLog(log, user.uid).then((log) => {
                toast.openSuccess('Action effectué');

                const oldLogs = logs;
                oldLogs.unshift(log);
                setLogs(oldLogs);
            });
        } else if (!hasChoix) {
            toast.openError('Erreur');
        }
    }

    return (
        <div className="logss">
            <h1> Historique </h1>
            <div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Date</th>
                            <th>Action</th>
                            <th>Infos suplémentaires</th>
                            <th>Annuler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => (
                            <tr key={`log-${i}`}>
                                <td>{log.getUserName(users)}</td>
                                <td>{dateTimeAbv(log.date.toDate())}</td>
                                <td>{log.actionName}</td>
                                <td>{log.infos}</td>
                                <td>
                                    <Button
                                        variant="outline-danger"
                                        style={{
                                            fontSize: '10px'
                                        }}
                                        onClick={async () => await cancelLog(log)}>
                                        ↪️
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export { LogPage };
