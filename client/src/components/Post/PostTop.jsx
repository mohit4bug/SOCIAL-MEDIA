import styled from "styled-components"

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
    object-fit: cover;
    border: 2px solid ${props => props.theme.textColor};
`
const PostUsername = styled.p`
    font-weight: 500;
    color: ${props => props.theme.textColor};
`
const Caption = styled.p`
    max-height: 300px;
    color: ${props => props.theme.textColor};
    font-size: 15px;
    overflow: auto;
`
const PostTop = ({ caption, username }) => {
    return (
        <PostContainer>
            <PostTop>
                <PostProfileImage src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                <PostUsername>{username}</PostUsername>
            </PostTop>
            <Caption>
                {caption}
            </Caption>
        </PostContainer>
    )
}

export default PostTop