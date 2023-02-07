import styled from 'styled-components'
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import { useContext } from 'react';
import { DarkModeContext } from '../context/darkModeContext';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import { AuthContext } from '../context/authContext';

const Nav = styled.nav`
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 30px;
    background: ${props => props.theme.navbg};
    position: sticky;
    top:0px;
    z-index: 3;
`
const Logo = styled.h1`
     color: ${props => props.theme.textColor};
     font-weight: 500;

     ::first-letter{
        color: ${props => props.theme.primaryBlue};
     }
     `
const List = styled.ul`
    list-style: none;
    display: flex;
    gap: 30px;
    `
const Item = styled.li`
    color: ${props => props.theme.iconColor};
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 600;
`


const Navbar = () => {
    const { ToggleDarkMode, darkMode } = useContext(DarkModeContext)
    const { Logout, user } = useContext(AuthContext)
    const username = JSON.parse(user).username
    const userId = JSON.parse(user)._id

    const navigate = useNavigate()
    return (
        <Nav>

            <Logo>MOCIAL</Logo>
            <List>
                <Item onClick={() => navigate('/feed')}>
                    <HomeRoundedIcon />
                </Item>
                <Item onClick={() => navigate('/explore')}>
                    <ExploreRoundedIcon />
                </Item>
                <Item onClick={ToggleDarkMode} >
                    {darkMode === "dark" ? <WbSunnyRoundedIcon /> : <DarkModeRoundedIcon />}
                </Item>
                <Item onClick={() => navigate(`/profile/${userId}`)} style={{ fontSize: "22px" }}>
                    {username[0].toUpperCase()}
                </Item>
            </List>
        </Nav>
    )
}

export default Navbar