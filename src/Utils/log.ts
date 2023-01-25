import { Log } from '../data/Log';
import { getItem } from '../data/Item';
import { addItem } from './firebase/firebasePut';

async function restoreLog(log: Log, userId: string): Promise<Log> {
    const item = getItem(JSON.parse(log.data));

    return await addItem(item, userId);
}

export { restoreLog };
