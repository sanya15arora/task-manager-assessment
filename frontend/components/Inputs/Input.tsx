import { useState, FC, ChangeEvent } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

interface InputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    label: string;
    type: string;
}

const Input: FC<InputProps> = ({ value, onChange, placeholder, label, type }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div>
            <label className="text-sm text-slate-800">{label}</label>
            <div className="input-box flex items-center border border-gray-300 rounded-md px-3 py-2">
                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none"
                    value={value}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        if (e.key === " " && type === 'password') e.preventDefault();
                    }}
                />
                {type === 'password' && (
                    <>
                        {showPassword ? (
                            <FaRegEye
                                size={22}
                                className="text-primary cursor-pointer"
                                onClick={toggleShowPassword}
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={22}
                                className="text-slate-400 cursor-pointer"
                                onClick={toggleShowPassword}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Input;
