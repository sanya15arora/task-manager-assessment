import { FC } from 'react'

interface AlertProps {
    content: string;
    btnText: string;
    onAgree: () => void;
}
const CustomAlert: FC<AlertProps> = ({ content, btnText, onAgree }) => {
    return (
        <div>
            <p className='text-sm text-gray-500'>
                {content}
            </p>
            <div className='flex justify-end mt-6'>
                <button type='button' className='form-btn' onClick={onAgree}>
                    {btnText}
                </button>
            </div>
        </div>
    )
}

export default CustomAlert