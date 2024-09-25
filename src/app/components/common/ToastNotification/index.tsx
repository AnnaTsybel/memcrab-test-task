import { ToastContainer } from 'react-toastify';

import { NOTFICATION_DELAY, PositionsOnPage } from '../../../utils/notifications';

import './index.scss';

/** Custom notification wrapper component around toast notifications. */
export const ToastNotification: React.FC = () => {

    /** Indicates if newest notifications shown in top of queue. */
    const IS_NEWEST_ON_TOP: boolean = false;

    return <ToastContainer
        position={PositionsOnPage.TOP_RIGHT}
        autoClose={NOTFICATION_DELAY}
        newestOnTop={IS_NEWEST_ON_TOP}
        pauseOnFocusLoss
        pauseOnHover
    />;
};
