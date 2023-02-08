import styled from "styled-components"
import FilterHdrIcon from '@mui/icons-material/FilterHdr';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useContext, useEffect, useState } from "react";
import { makeRequest } from "../axios";
import { useParams } from 'react-router-dom'
import { AuthContext } from "../context/authContext";
import { ToastContainer, toast } from 'react-toastify';


const Container = styled.div`
      min-height: calc(100vh - 50px);
      width: 100%;
      background: ${props => props.theme.feedBg};
      display: flex;
      flex-direction: column;
      align-items:center;
      padding: 20px 20px;
      gap: 50px;
      overflow: auto;
`
const CoverPictureDiv = styled.div`
    width: 100%;
    height: 300px;
    border-radius: 30px 30px 0px 0px;
    position: relative;

`
const CoverPicture = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
    filter: brightness(50%);
    transition: all 0.3s ease-in-out;
    border-radius: 30px 30px 0px 0px;

    &:hover{
        filter: brightness(100%);
    }
`
const CoverPictureEditButton = styled.label`
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: ${props => props.theme.primaryBlue};
    color: white;
    display: grid;
    place-items: center;
    cursor: pointer;
`
const CoverPictureSaveButton = styled.p`
   position: absolute;
    top: 10px;
    right: 50px;
    border: none;
    padding: 7px 10px;
    border-radius: 5px;
    background: ${props => props.theme.primaryBlue};
    color: white;
    font-size: 14px;
    display: grid;
    place-items: center;
    cursor: pointer;
`

const ProfilePictureDiv = styled.div`
    height: 200px;
    width: 200px;
    z-index: 1;
    position: absolute;
    bottom: -100px;
    right: 0%;
    left: 0%;
    margin: auto;
    border: 10px solid ${props => props.theme.feedBg};
    border-radius: 50%;
    background: ${props => props.theme.feedBg};

    @media (max-width: 425px) {
        height: 150px;
        width: 150px;
        bottom: -80px;
    }
`
const ProfilePicture = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: contain;
   
   
`
const ProfilePictureEditButton = styled.label`
    position: absolute;
    bottom: 30px;
    right: 20px;
    border: none;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: ${props => props.theme.primaryBlue};
    color: white;
    display: grid;
    place-items: center;
    cursor: pointer;

    
    @media (max-width: 425px) {
        bottom: 20px;
        right: 15px;
    }
`
const ProfilePictureSaveButton = styled.p`
    color: ${props => props.theme.textColor};
    display: flex;
    align-items: center;
    gap:5px;
    padding: 10px 20px;
    background: ${props => props.theme.primaryBlue};
    cursor: pointer;
    border-radius: 5px;
`

const DetailsDiv = styled.div`
    min-height:500px;
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    align-items: center;
    padding-top: 30px;

    @media (max-width: 425px) {
        padding-top: 10px;
    }
    
    
    `
const Username = styled.h1`
    color: ${props => props.theme.textColor};
    font-weight: 500;
    font-size: 30px;
    text-transform: uppercase;
`
const Bio = styled.p`
    display: flex;
    align-items:center;
    max-width: 300px;
    justify-content: center;
    word-break: break-word;
    hyphens:  auto;
    font-size: 16px;
    color: ${props => props.theme.textColor};
`
const BioInput = styled.input`
    height: 40px;
    width: 250px;
    background: transparent;
    border: none;
    outline: none;
    font-size: 15px;
    color: ${props => props.theme.textColor};
    border: thin solid ${props => props.theme.placeHolderColor};
    padding-left: 10px;

    &::placeholder{
        color: ${props => props.theme.placeHolderColor};
    }
`
const BioEditButton = styled.p`
    color: ${props => props.theme.textColor};
    display: flex;
    align-items: center;
    gap:5px;
    

`
const EditSubmitButton = styled.button`
    background: ${props => props.theme.primaryBlue};
    width: 60px;
    border-radius: 5px;
    border: none;
    font-weight:500;
    font-size: 15px;
    color: white;
    cursor: pointer;
    height: 40px;
    border-radius: 2px;
    outline: none;
`
const FlexDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
`
const FlexCol = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap:2px;
    width: 100px;
`
const TitleSmall = styled.p`
    color: gray;
    font-size: 15px;

`
const Value = styled.p`
    font-size: 30px;
    font-weight: 800;
    color: ${props => props.theme.textColor};
`
const FollowButton = styled.button`
    background: ${props => props.theme.primaryBlue};
    height: 35px;
    width: 100px;
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
    border-radius: 2px;
`


const Profile = () => {

    const [bio, setBio] = useState("")
    const [toggleBioInput, setToggleBioInput] = useState(false)
    const { user } = useContext(AuthContext)
    const userId = JSON.parse(user)?._id
    const queryClient = useQueryClient()
    let { id } = useParams();


    // fetching user
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['fetchUser'],
        queryFn: async () => {
            const res = await makeRequest.get(`/user/fetch/${id}`)
            return res.data?.user

        },
    })

    // Mutation for edit bio
    const bioMutation = useMutation({

        mutationFn: async (bio) => {
            try {
                const res = await makeRequest.post('/user/bio', { bio })
                setToggleBioInput(false)
                console.log(res.data.message)
            }
            catch (error) {
                console.log(error.response.data.message)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetchUser'] })
        },
    })


    /// mutation for follow unfollow
    const followMutation = useMutation(async (userId) => {
        return makeRequest.get(`/user/follow/${userId}`).then((res) => {
            console.log(res.data.message)
        }).catch((e) => {
            console.log(e.response.data.message)
        })
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(["fetchUser"])
        }
    })




    // Configuration for profile picture
    const [profile, setProfile] = useState()
    const [profilePreview, setProfilePreview] = useState()

    useEffect(() => {
        if (!profile) {
            setProfilePreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(profile)
        setProfilePreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [profile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setProfile(undefined)
            return
        }
        setProfile(e.target.files[0])
    }


    const mutationProfile = useMutation({

        mutationFn: async () => {
            const formData = new FormData();
            formData.append('avatar', profile)
            try {
                const res = await makeRequest.post('/user/profilepicture', formData)
                console.log(res.data.message)
                setProfile('')
            }
            catch (error) {
                alert(error.response.data.message)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetchUser'] })
        },
    })




    // Configuration for profile picture
    const [cover, setCover] = useState()
    const [coverPreview, setCoverPreview] = useState()

    useEffect(() => {
        if (!cover) {
            setCoverPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(cover)
        setCoverPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [cover])

    const onSelectCoverFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setCover(undefined)
            return
        }
        setCover(e.target.files[0])
    }


    const mutationCover = useMutation({

        mutationFn: async () => {
            const formData = new FormData();
            formData.append('cover', cover)
            try {
                const res = await makeRequest.post('/user/coverpicture', formData)
                console.log(res.data.message)
                setCover('')
            }
            catch (error) {
                alert(error.response.data.message)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetchUser'] })
        },
    })




    return (
        <Container>
            {/* cover picture div */}
            <CoverPictureDiv>
                <ProfilePictureDiv>
                    {/* data?.avatar done because this was trying to fetch image earliar so i stopped it to fetch before it actually loads */}
                    <ProfilePicture src={profilePreview ? profilePreview : `http://localhost:8000/public/images/${data?.avatar}`} />
                    <input type="file" name="profilePicture" id="profilePicture" onChange={onSelectFile} style={{ display: "none" }} />
                    {userId === data?._id && <ProfilePictureEditButton htmlFor="profilePicture">
                        <FilterHdrIcon fontSize="small" />
                    </ProfilePictureEditButton>}
                </ProfilePictureDiv>

                {/* profile picture button */}
                <CoverPicture src={coverPreview ? coverPreview : `http://localhost:8000/public/images/${data?.cover}`} alt="profile picture" />

                <input type="file" name="coverPicture" onChange={onSelectCoverFile} id="coverPicture" style={{ display: "none" }} />
                {/* cover picture button */}
                {userId === data?._id && <CoverPictureEditButton htmlFor="coverPicture">
                    <FilterHdrIcon fontSize="small" />
                </CoverPictureEditButton>}
                {cover && <CoverPictureSaveButton onClick={() => mutationCover.mutate()}>Save</CoverPictureSaveButton>}

            </CoverPictureDiv>
            <DetailsDiv>
                {profile && <ProfilePictureSaveButton onClick={() => mutationProfile.mutate()}>Save</ProfilePictureSaveButton>}
                <Username>{data?.username}</Username>
                <div style={{ display: "flex", gap: "5px", alignItems: "center", justifyContent: "center" }}>
                    {
                        toggleBioInput
                            ? <BioInput placeholder="Edit your bio" defaultValue={data?.bio} onChange={e => setBio(e.target.value)} />
                            : <Bio>{data?.bio}</Bio>
                    }
                    {

                        userId === data?._id ? toggleBioInput
                            ? <BioEditButton>
                                <EditSubmitButton onClick={() => bioMutation.mutate(bio)}>Save</EditSubmitButton>
                                <CloseRoundedIcon onClick={() => setToggleBioInput(false)} fontSize="small" style={{ cursor: "pointer" }} />
                            </BioEditButton> :
                            <BioEditButton onClick={() => setToggleBioInput(!toggleBioInput)}>
                                <EditRoundedIcon fontSize="small" style={{ cursor: "pointer" }} />
                            </BioEditButton>
                            : ''}
                </div>
                <FlexDiv>
                    <FlexCol>
                        <TitleSmall>Posts</TitleSmall>
                        <Value>{data?.posts.length}</Value>
                    </FlexCol>
                    <FlexCol>
                        <TitleSmall>Followers</TitleSmall>
                        <Value>{data?.followers.length}</Value>
                    </FlexCol>
                    <FlexCol>
                        <TitleSmall>Following</TitleSmall>
                        <Value>{data?.following.length}</Value>
                    </FlexCol>
                </FlexDiv>
                {
                    userId === data?._id ? '' : <FollowButton onClick={() => followMutation.mutate(id)}><AddRoundedIcon />{data?.followers.includes(userId) ? 'Unfollow' : 'Follow'}</FollowButton>
                }

            </DetailsDiv>
            <ToastContainer />
        </Container>
    )
}

export default Profile