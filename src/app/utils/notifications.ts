import { toast } from 'react-toastify';

export const NOTFICATION_DELAY = 5000;

/** Notifications types. I.e, error, info, success, warning. */
export enum DesignTypes {
    error = 'error',
    info = 'info',
    success = 'success',
};

/** Notifications position on page. */
export enum PositionsOnPage {
    BOTTOM_CENTER = 'bottom-center',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_RIGHT = 'bottom-right',
    TOP_CENTER = 'top-center',
    TOP_LEFT = 'top-left',
    TOP_RIGHT = 'top-right',
};

/** Defines notifications plugin with message, toast type and theme. */
export class NotificationsPlugin {
    /** Notifies user. As default type uses error type, and default theme is colored. */
    static notify(message: any, type: DesignTypes = DesignTypes.error, delay: number = NOTFICATION_DELAY) {
        toast[type](message, {
            position: PositionsOnPage.TOP_RIGHT,
            autoClose: delay,
        });
    }
};
