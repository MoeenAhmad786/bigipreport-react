import Header from "../components/shared/Header.tsx";
import {ReactNode} from "react";


type LayoutProps = {
    children: ReactNode;
};

const Layout = ({children}: LayoutProps) => {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
export default Layout;