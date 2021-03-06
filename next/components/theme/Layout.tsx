import React from "react";
import {styled} from "styletron-react";
import Logo from "./Logo";

const Wrapper = styled("div", {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    height: '100%',
    background: 'transparent linear-gradient(221deg,#F20544 0%,#F00544 2%,#F20544 2%,#F20544 10%,#721542 50%,#012340 100%) 0% 0% no-repeat padding-box;',
});

const ResizedLogo = styled(Logo,  {
    width: '120px',
})

const Layout = (props: {
    children: React.ReactNode
}) => {
    const {children} = props;
    return (
        <Wrapper>
            {children}
        </Wrapper>
    )
}

export default Layout;
