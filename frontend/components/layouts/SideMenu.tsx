import { FC, useContext } from 'react'
import { SIDE_MENU_DATA } from '@/utils/data';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from "next/navigation";


type SideMenuProps = {
    activeMenu: string;
}

const SideMenu: FC<SideMenuProps> = ({ activeMenu }) => {
    const { user, logout } = useAuth()

    const router = useRouter();

    const handleClick = (route:  string) => {
        if (route === 'logout') {
            handleLogout();
            return;
        }
        router.push(route)
    }

    const handleLogout = () => {
        logout();
        router.push("/auth/login")
    }
    return (
        <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20'>
            <div className='flex flex-col items-center justify-center gap-3 mt-3 mb-7'>
                <h5 className='text-gray-950 font-medium leading-6'>
                    Hi, {user?.name || ""}
                </h5>
            </div>
            {SIDE_MENU_DATA.map((item, index) => (<button key={`menu_${index}`}
                className={`w-full flex items-center gap-4 text-[15px] ${activeMenu == item.label && "text-white bg-primary"} py-3 px-6 rounded-lg mb-3`}
                onClick={() => handleClick(item.path)}>
                <item.icon className='text-xl' />
                {item.label}
            </button>))
            }
        </div >
    )
}

export default SideMenu