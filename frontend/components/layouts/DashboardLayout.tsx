import { FC, ReactNode, useContext } from 'react';
import { useAuth } from '@/context/AuthProvider';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

interface DashboardLayoutProps {
    children: ReactNode;
    activeMenu: string;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, activeMenu }) => {
    const { user } = useAuth();

    return (
        <div className=''>
            <Navbar activeMenu={activeMenu}/>
                {user && (
                    <div className='flex'>
                        <div className='max-[1080px]:hidden'>
                            <SideMenu activeMenu={activeMenu} />
                        </div>
                        <div className='grow mx-5'>
                            {children}
                        </div>
                    </div>
                )}

        </div>
    );
};

export default DashboardLayout;