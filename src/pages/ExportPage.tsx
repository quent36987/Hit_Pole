import { useEffect, useState } from "react";
import IPage from "../interfaces/page"
import { ExportCSV } from "../Utils/exportCSV";
import { CSVLink } from "react-csv";
import { DateFormatAbv } from "../Utils/utils";

const ExportPage: React.FunctionComponent<IPage> = props => {

    const [data, setData] = useState([]);

    useEffect(() => {
        loadData();
    }, [props.name])

    const loadData = async () => {
        const data = await ExportCSV();
        setData(data);
    };
    const filename = `export_${DateFormatAbv(new Date()).replaceAll(" ", "_").replaceAll(",", "_")}.csv`;

    return (
        <div>
            <h1>ExportPage</h1>
            {data.length > 0 ?
               <CSVLink data={data}
                        separator=";"
                        filename={filename}
               >Download me</CSVLink>
            : <>wait ..</> }
        </div>
    )
}

export default ExportPage;