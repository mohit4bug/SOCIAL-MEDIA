import { useEffect, useState } from "react"
import styled from "styled-components"
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from '../axios'

const Container = styled.div`
    height: auto;
    width: 700px;
    background: ${props => props.theme.postBg};
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    @media (max-width:710px) {
        width: 100%;
    }
`
const Top = styled.div``
const TextArea = styled.textarea`
    resize: none;
    width: 100%;
    height: 100px;
    background: ${props => props.theme.searchInpBg};
    border: none;
    border-radius: 5px;
    outline: none;
    padding: 10px;
    font-size: 16px;
    color: ${props => props.theme.textColor};
`
const AddButton = styled.label`
    background: ${props => props.theme.primaryBlue};
    border: none;
    font-weight:500;
    width: fit-content;
    height: fit-content;
    display: grid;
    place-items: center;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    font-size: 15px;
    color: ${props => props.theme.textColor};
    cursor: pointer;
`
const ShareButton = styled.button`
    background: ${props => props.theme.primaryBlue};
    border: none;
    font-weight:500;
    width: 100%;
    display: grid;
    place-items: center;
    padding: 8px 20px;
    font-size: 15px;
    color: ${props => props.theme.textColor};
    cursor: pointer;
    border-radius: 2px;
`
const Input = styled.input`
    display: none;
`
const Bottom = styled.div`
    max-height: 400px;
`
const PostImage = styled.img`
    max-height: 400px;
    width: 100%;
    object-fit: cover;
    border-radius: 5px;
    overflow: hidden;
`




const Share = () => {

    const queryClient = useQueryClient();
    const [file, setFile] = useState()
    const [caption, setCaption] = useState()
    const [preview, setPreview] = useState()

    useEffect(() => {
        if (!file) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setFile(undefined)
            return
        }
        setFile(e.target.files[0])
    }


    const mutation = useMutation({

        mutationFn: async (data) => {
            const formData = new FormData();
            formData.append('postImg', data.postImg)
            formData.append('caption', data.caption)
            try {
                const res = await makeRequest.post('/post/create', formData)
                setCaption('')
                setFile('')
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
            <Top>
                <TextArea onChange={e => setCaption(e.target.value)} value={caption} placeholder="What are you thinking?" />
            </Top>
            <AddButton htmlFor="postImg">
                <AddRoundedIcon />
            </AddButton>
            <Input type="file" accept="image/png, image/gif, image/jpeg" onChange={onSelectFile} id="postImg" name="postImg" />
            <Bottom>
                <PostImage src={preview} />
            </Bottom>
            <div>
                {
                    file ? <ShareButton onClick={() => mutation.mutate({ caption: caption, postImg: file })}>
                        <SendRoundedIcon />
                    </ShareButton> : ""
                }
            </div>
        </Container>
    )
}

export default Share