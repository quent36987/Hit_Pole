import { CSVLink } from 'react-csv';
import { dateFormatAbv } from '../Utils/utils';
import { exportCSV } from '../Utils/exportCSV';
import { IPage } from '../interfaces/page';
import React, { useEffect, useState } from 'react';

const ExportPage: React.FunctionComponent<IPage> = (props) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        loadData().catch(console.error);
    }, [props.name]);

    const loadData = async (): Promise<void> => {
        const data = await exportCSV();
        setData(data);
    };

    const filename = `export_${dateFormatAbv(new Date())
        .replaceAll(' ', '_')
        .replaceAll(',', '_')}.csv`;

    return (
        <div>
            <h1>ExportPage</h1>
            {data.length > 0 ? (
                <CSVLink data={data} separator=";" filename={filename}>
                    Download me
                </CSVLink>
            ) : (
                <>wait ..</>
            )}
        </div>
    );
};

export { ExportPage };
