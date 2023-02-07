import styled from "styled-components"
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import { useContext, useEffect, useState } from "react";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { AuthContext } from "../../context/authContext";
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';

const Container = styled.div`
    width: 700px;
    background: ${props => props.theme.postBg};
    border-radius: 10px;

    @media (max-width:710px) {
        width: 100%;
    }
`
const PostMid = styled.div`
    min-height: 400px;
    height: 100%;
`
const PostImg = styled.img`
    height: 500px;
    width: 100%;
    object-fit: cover;
`
const PostBottom = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px;
    color: ${props => props.theme.textColor};
    gap: 20px;
`
const CommentContainer = styled.div`
    overflow: hidden;
    padding: 0px 10px;
    height: ${props => props.comHeight};
`
const CommentTop = styled.div`
    height: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
`
const CommentInput = styled.input`
    height: 100%;
    width: 100%;
    background: transparent;
    border: thin solid ${props => props.theme.placeHolderColor};
    padding-left:10px;
    color: ${props => props.theme.textColor};
    font-size: 15px;
    outline: none;
    border-radius: 2px;
`
const CommentButton = styled.button`
    background: ${props => props.theme.primaryBlue};
    height: 100%;
    width: 100px;
    border: none;
    font-weight:500;
    font-size: 15px;
    color: white;
    cursor: pointer;
    border-radius: 2px;
    
`

const CommentBottom = styled.div`
    padding: 20px 0px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    gap: 20px;
    `
const SingleComment = styled.div`
    height: auto;
    display: flex;
    flex-direction: column;
    gap:5px;
    padding: 0px 5px;
    border-radius: 5px;
`
const CommentCommentTop = styled.div`
    height: fit-content;
    display: flex;
    align-items: center;
    gap: 10px;
`
const CommentProfileImage = styled.img`
    height: 35px;
    width: 35px;
    border-radius: 50%;
    object-fit: cover;
`
const Username = styled.p`
    font-weight: 500;
    font-size: 15px;
    color: ${props => props.theme.textColor};
    text-transform: capitalize;
`
const CommentText = styled.p`
    color: ${props => props.theme.textColor};
    font-size: 14px;
    margin-left: 45px;

    &::first-letter{
        text-transform: uppercase;
    }

`


const PostContainer = styled.div`
    height: auto;
    padding: 10px;
`
const PostTop = styled.div`
    height: 60px;
    display: flex;
    align-items: center;
    gap: 10px;
`
const PostProfileImage = styled.img`
    height: 35px;
    width: 35px;
    border-radius: 50%;
    object-fit: contain;
    border: 2px solid ${props => props.theme.textColor};
`
const PostUsername = styled.p`
    font-weight: 500;
    color: ${props => props.theme.textColor};
    text-transform: capitalize;
`
const Caption = styled.p`
    max-height: 300px;
    color: ${props => props.theme.textColor};
    font-size: 15px;
    overflow: auto;
`
const Post = ({ post }) => {
    const queryClient = useQueryClient();
    const { user } = useContext(AuthContext)
    const userId = JSON.parse(user)._id
    const [content, setContent] = useState("")
    const [showCom, setShowCom] = useState(false)


    // Comment Post
    const mutation = useMutation({
        mutationFn: async () => {
            try {
                const res = await makeRequest.post(`/post/comment/${post?._id}`, { content })
                setContent('')
            }
            catch (error) {
                alert(error.response.data.message)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetchAllPosts'] })
        },
    })

    // Like Post
    const mutationLikes = useMutation({

        mutationFn: async (postId) => {
            try {
                const res = await makeRequest.get(`/post/like/${postId}`)
            }
            catch (error) {
                alert(error.response.data.message)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetchAllPosts'] })
        },
    })

    return (
        <Container>
            <PostContainer>
                <PostTop>
                    {/* // This is temp /// */}
                    <PostProfileImage src={`http://localhost:8000/public/images/${post?.userId?.avatar}`} />
                    <PostUsername>{post?.userId?.username}</PostUsername>
                </PostTop>
                <Caption>
                    {post.caption}
                </Caption>
            </PostContainer>
            <PostMid>
                <PostImg src={`http://localhost:8000/public/images/${post?.postImg}`} />
            </PostMid>
            <PostBottom>
                <span style={{ display: "flex", gap: "5px" }}>
                    <span style={{ cursor: "pointer" }} onClick={() => mutationLikes.mutate(post?._id)}> {post.likes.includes(userId) ? <FavoriteRoundedIcon style={{ color: "#ff0048" }} /> : <FavoriteBorderRoundedIcon />}</span>
                    {post?.likes?.length}
                </span>
                <span style={{ display: "flex", gap: "5px" }}>
                    <span style={{ cursor: "pointer" }}>
                        <CommentRoundedIcon onClick={() => setShowCom(!showCom)} /></span>
                    {post?.comments?.length}
                </span>
            </PostBottom>
            <CommentContainer comHeight={showCom ? "auto" : "0"}>
                <CommentTop>
                    <CommentInput value={content} onChange={e => setContent(e.target.value)} placeholder='Write your comment here' />
                    <CommentButton onClick={() => mutation.mutate()}>Comment</CommentButton>
                </CommentTop>
                <CommentBottom>
                    {
                        post?.comments.map((comment, index) => {
                            return (
                                <SingleComment key={index}>
                                    <CommentCommentTop>
                                        <CommentProfileImage src={`http://localhost:8000/public/images/${comment?.userId?.avatar}`} />
                                        <Username>{comment.userId?.username}</Username>
                                    </CommentCommentTop>
                                    <CommentText>{comment.content}</CommentText>
                                </SingleComment>
                            )
                        }).reverse()
                    }
                </CommentBottom>
            </CommentContainer>
        </Container>
    )
}

export default Post