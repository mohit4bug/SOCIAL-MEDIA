import { useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { makeRequest } from "../axios"
import { useNavigate } from "react-router-dom"

const Container = styled.div`
    height: 100vh;
    width: 100%;
    background: ${props => props.theme.feedBg};
    display: grid;
    place-items: center;
`
const Form = styled.form`
    width: 350px;
    padding:20px;
    background: ${props => props.theme.postBg};
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 50px;


    @media (max-width:360px) {
        width: 100%;
        background: transparent;
    }

`
const Heading = styled.h1`
    color: ${props => props.theme.textColor};
    font-weight: 500;
`
const Top = styled.div`
    width: 100%;
    display: grid;
    place-items: center;
`
const Mid = styled.div`
    width: 100%;
    display:flex;
    flex-direction: column;
`

const InputSection = styled.div`
    padding: 10px 0px;
    width: 100%;
    display:flex;
    flex-direction: column;
    gap:5px;
`
const Label = styled.label`
    color: ${props => props.theme.textColor};
    text-transform: capitalize;
    font-weight: 500;
    font-size:15px;
`
const Input = styled.input`
    background: ${props => props.theme.searchInpBg};
    height: 40px;
    border: none;
    outline: none;
    color: ${props => props.theme.textColor};
    padding-left: 5px;
    font-size: 16px;
    border-radius: 2px;
    
    &::placeholder{
        color: ${props => props.theme.placeHolderColor};
    }
`

const Button = styled.button`
    background: ${props => props.theme.primaryBlue};
    height: 40px;
    width: 100%;
    border: none;
    font-weight:500;
    font-size: 15px;
    color: ${props => props.theme.textColor};
    cursor: pointer;
    border-radius: 2px;
`

const Bottom = styled.div`
    padding: 10px 0px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`
const Info = styled.p`
    color: ${props => props.theme.textColor};
    font-size: 15px;
    font-weight: 500;
`


const Signup = () => {

    const navigate = useNavigate()
    const [inputs, setInputs] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    })

    const handleChange = e => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await makeRequest.post('/auth/register', inputs)
            alert(res.data.message)
            navigate('/signin')
        }
        catch (error) {
            alert(error.response.data.message)
        }
    }


    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Top>
                    <Heading>SIGN UP</Heading>
                </Top>
                <Mid>
                    <InputSection>
                        <Label htmlFor="username">username</Label>
                        <Input onChange={handleChange} type="text" name="username" id="username" placeholder="choose username" autoComplete="off" />
                    </InputSection>
                    <InputSection>
                        <Label htmlFor="password">password</Label>
                        <Input onChange={handleChange} type="password" name="password" id="password" placeholder="choose password" autoComplete="off" />
                    </InputSection>
                    <InputSection>
                        <Label htmlFor="confirmPassword">retype password</Label>
                        <Input onChange={handleChange} type="password" name="confirmPassword" id="confirmPassword" placeholder="confirm password" autoComplete="off" />
                    </InputSection>
                </Mid>
                <Bottom>
                    <Button type="submit">Signup</Button>
                    <Info>Already have an account? <Link to="/signin">Login</Link></Info>
                </Bottom>
            </Form>
        </Container>

    )
}

export default Signup