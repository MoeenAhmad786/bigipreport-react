import Header from "../components/shared/Header";


const Layout = ({children}) => {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
export default Layout;