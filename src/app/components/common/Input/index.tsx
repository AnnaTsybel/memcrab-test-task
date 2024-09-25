import './index.scss';

type InputProps = {
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    hasNumberValidation?: boolean;
    label: string;
    id: string;
};

export const Input: React.FC<InputProps> = ({
    value,
    onChange,
    placeholder = '',
    className = '',
    hasNumberValidation = false,
    label,
    id
}) => {
    const handleOnChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (hasNumberValidation ) {
            const dynamicPattern = `^([0-9]*)$`;
            const numberPattern = new RegExp(dynamicPattern);
            const amount = e.target.value;

            if (numberPattern.test(amount)) {
                onChange(e);
            }

            return;
        }

        onChange(e);
    };

    return <div className="common-input">
            <label htmlFor={id} className="common-input__label">{label}</label>
            <input
                className={`common-input__input ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={handleOnChangeValue}
                id={id}
            />
        </div>
};
