import { ReactNode, FC } from "react";
import { IoClose } from "react-icons/io5";


interface ModalProps {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title: string;
}

const Modal: FC<ModalProps> = ({ children, isOpen, onClose, title }) => {

    if (!isOpen) return null;

    return (
        <div className='fixed top-0 right-0 bottom-0 left-0 z-50 w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto 
        overflow-x-hidden bg-black/20 bg-opacity-50 flex items-center justify-center'>
            <div className='relative p-4 w-full max-w-2xl max-h-full'>
                <div className='relative bg-white rounded-lg shadow-sm  p-4'>

                    <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:gray-600 border-gray-200'>

                        <h2 className='text-lg font-medium text-gray-900 '>{title}</h2>
                        <button onClick={onClose} className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center cursor-pointer'>
                            <IoClose className='text-2xl' />
                        </button>
                    </div>
                    <div className='p-4 md:p-5 space-y-4'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal