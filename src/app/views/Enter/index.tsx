import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@components/common/Input";
import { Button } from "@components/common/Button";

import { LocalStorageKeys, setLocalStorageItem } from "@utils/storage";
import { NotificationsPlugin } from "@utils/notifications";

import './index.scss';

const Enter = () => {
    const navigate = useNavigate();

    const [rowsAmount, setRowsAmount] = useState<number>(0);
    const [columnsAmount, setColumnsAmount] = useState<number>(0);

    const onChangeRowsAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsAmount(+e.target.value);
    };

    const onChangeColumnsAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColumnsAmount(+e.target.value);
    };

    const applyData = () => {
        if (rowsAmount <= 0 || rowsAmount > 100  ) {
            NotificationsPlugin.notify("Enter rows amount more than 0 and less than 100.");

            return;
        }

        if (columnsAmount <= 0 || columnsAmount > 100  ) {
            NotificationsPlugin.notify("Enter columns amount more than 0 and less than 100.");

            return;
        }

        setLocalStorageItem(LocalStorageKeys.ROWS_AMOUNT, JSON.stringify(rowsAmount));
        setLocalStorageItem(LocalStorageKeys.COLUMNS_AMOUNT, JSON.stringify(columnsAmount));
        
        navigate("/enter-limit");
    }

    return (
        <div className="enter">
            <form className="enter__form">
                <h1 className="enter__title">Enter matrix rows and columns amount</h1>
                <div className="enter__form__inputs">
                    <Input
                        id="rows-amount"
                        label="Rows amount"
                        value={rowsAmount}
                        hasNumberValidation={true}
                        onChange={onChangeRowsAmount}
                    />
                    <Input
                        id="columns-amount"
                        label="Columns amount"
                        value={columnsAmount}
                        hasNumberValidation={true}
                        onChange={onChangeColumnsAmount}
                    />
                </div>
                <Button onConfirm={applyData} label="Apply"/>
            </form>
        </div>
    )
}

export default Enter;
