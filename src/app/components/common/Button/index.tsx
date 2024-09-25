import './index.scss';

type ButtonProps = {
    label: string;
    onConfirm: () => void;
    isDisabled?: boolean;
    className?: string;
};

export const Button: React.FC<ButtonProps> = ({
    label,
    onConfirm,
    isDisabled = false,
    className = ''
}) => <button
    className={`common-button ${className}`}
    disabled={isDisabled}
    onClick={onConfirm}
    aria-label={label}
    type="button"
>
    {label}
</button>;
