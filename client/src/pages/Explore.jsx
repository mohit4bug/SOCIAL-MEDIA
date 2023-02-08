import styled from "styled-components"
import { makeRequest } from "../axios";
import { Box } from "@mui/system";
import { LinearProgress, Skeleton } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";


const Container = styled.div`
      min-height: calc(100vh - 50px);
      width: 100%;
      background: ${props => props.theme.feedBg};
`
const Top = styled.div`
    width: 100%;
    display:flex;
    gap: 10px;
    flex-direction: column;
    align-items: center;
    padding: 30px 0px;
`

const Bottom = styled.div`
    height: calc(100vh - 170px);
    width: 100%;
    padding: 10px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    position: relative;
`

const UserDiv = styled.div`
    min-height: 100px;
    height: 100px;
    width: 300px;
    border-radius: 5px;
    display:flex;
    align-items: center;
    justify-content: center;
    padding: 5px 20px;
    gap: 20px;
    background: ${props => props.theme.searchInpBg};
`
const ProfilePicture = styled.img`
    height: 70px;
    width: 70px;
    border-radius: 50%;
    object-fit: contain;
    border: 2px solid ${props => props.theme.textColor};
`
const Username = styled.p`
    font-size: 20px;
    font-weight: 500;
    color: ${props => props.theme.textColor};
    text-transform: capitalize;
`


const Search = styled.input`
    max-width: 500px;
    width: 300px;
    height: 50px;
    background:transparent;
    border: 1px solid ${props => props.theme.placeHolderColor};
    text-align:center;
    font-size: 16px;
    color: ${props => props.theme.textColor};
`
const VisitButton = styled.button`
    background: ${props => props.theme.primaryBlue};
    height: 35px;
    width: 80px;
    border-radius: 5px;
    border: none;
    font-weight:500;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    color: white;
    cursor: pointer;
    border-radius: 3px;
`

const Explore = () => {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const FetchUser = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await makeRequest.post('/user/fetch', { username: e.target.value })
            setUsers(res.data?.users)
        }
        catch (error) {
            console.log(error.response.data.message)
        }
        setLoading(false)
    }


    console.log(users)

    return (
        <Container>
            <Top>
                <Search placeholder="Search for users..." onChange={FetchUser} />

            </Top>
            <Bottom>
                {
                    users?.map((user) => (
                        <UserDiv key={user?._id}>
                            <ProfilePicture src={`http://localhost:8000/public/images/${user?.avatar}`} />
                            <Username>{user?.username}</Username>
                            <Link to={`/profile/${user?._id}`}>
                                <VisitButton>
                                    Profile
                                </VisitButton>
                            </Link>
                        </UserDiv>
                    ))
                }

            </Bottom>
        </Container>
    )
}

export default Explore