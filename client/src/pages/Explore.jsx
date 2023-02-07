import styled from "styled-components"
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { makeRequest } from "../axios";
import { AuthContext } from "../context/authContext";
import { ToastContainer, toast } from 'react-toastify';

const Container = styled.div`
      min-height: calc(100vh - 50px);
      width: 100%;
      background: ${props => props.theme.feedBg};
      padding: 10px;
`

const Bottom = styled.div`
    max-height: 100%;
    padding: 50px 0px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 50px;
    justify-content: center;
`

const SingleUser = styled.div`
    width: 100%;
    max-width: 300px;
    height: 100px;
    border-radius: 5px;
    justify-content: space-between;
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 10px;
    background: ${props => props.theme.searchInpBg};
`

const ProfileImage = styled.img`
    height: 70px;
    width: 70px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${props => props.theme.textColor};
`

const Username = styled.p`
    font-weight: 500;
    font-size: 18px;
    color: ${props => props.theme.textColor};
    text-transform: capitalize;
`

const FollowBtn = styled.button`
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: transparent;
    border: none;
    display: grid;
    place-items:center;
    color: ${props => props.theme.textColor};
    cursor: pointer;
`


const Explore = () => {

    const queryClient = useQueryClient();
    const { user } = useContext(AuthContext)
    const currUserId = JSON.parse(user)._id



    const { isLoading, isError, data, error } = useQuery(["fetchAllUsers"], () =>
        makeRequest.get('/user/fetchall').then((res) => {
            return res.data.users
        })

    )

    const mutation = useMutation((userId) => {
        return makeRequest.get(`/user/follow/${userId}`).then((res) => {
        })
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(["fetchAllUsers"])
        }
    })


    return (
        <Container>
            <Bottom>
                {
                    data?.map((user, index) => {
                        return (
                            <SingleUser key={index}>
                                <ProfileImage src={`http://localhost:8000/public/images/${user?.avatar}`} />
                                <Username>{user.username}</Username>

                                {
                                    currUserId !== user._id ? (
                                        <FollowBtn onClick={() => mutation.mutate(user._id)}>
                                            {user.followers.includes(currUserId) ? <PersonRemoveRoundedIcon /> : <PersonAddAltRoundedIcon />}
                                        </FollowBtn>
                                    ) : <span>&nbsp;</span>
                                }


                            </SingleUser>)
                    })
                }

            </Bottom>
            <ToastContainer />
        </Container>
    )
}

export default Explore