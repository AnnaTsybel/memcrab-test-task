import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@components/common/Input";
import { Button } from "@components/common/Button";

import { LocalStorageKeys, getLocalStorageItem, setLocalStorageItem } from "@utils/storage";
import { NotificationsPlugin } from "@utils/notifications";

import './index.scss'

const LimitEnter = () => {
    const navigate = useNavigate();

    const [nearestLimit, setNearestLimit] = useState<number>(0);

    const onChangeNearestLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNearestLimit(+e.target.value);
    };

    const applyData = () => {
        const rowsAmountFromStorage = JSON.parse(getLocalStorageItem(LocalStorageKeys.ROWS_AMOUNT)|| '');
        const columnsAmountFromStorage = JSON.parse(getLocalStorageItem(LocalStorageKeys.COLUMNS_AMOUNT) || '');
        const maxAmount = Math.max(rowsAmountFromStorage, columnsAmountFromStorage);
        
        if (nearestLimit <= 0) {
            NotificationsPlugin.notify('Nearest limit must be more than 0.');

            return;
        }

        if (nearestLimit > maxAmount ) {
            NotificationsPlugin.notify(`Nearest limit must be less than maximum from columns or rows amount (${maxAmount}).`);

            return;
        }

        setLocalStorageItem(LocalStorageKeys.NEAREST_LIMIT, JSON.stringify(nearestLimit));
        
        navigate("/matrix");
    }

    return (
        <div className="limits-enter">
            <form className="limits-enter__form">
                <div className="limits-enter__heading">
                    <Button onConfirm={()=>navigate('/')} label="Go back" className="limits-enter__heading__go-back"/>
                    <h1 className="limits-enter__title">Enter Limit</h1>
                </div>
                <Input
                    id="nearest-cells-limit"
                    label="Nearest cells limit"
                    value={nearestLimit}
                    hasNumberValidation={true}
                    onChange={onChangeNearestLimit}
                />
                <Button onConfirm={applyData} label="Apply"/>
            </form>
        </div>
    )
}

export default LimitEnter;
