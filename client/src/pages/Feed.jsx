import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import { makeRequest } from '../axios'
import Post from '../components/Post/Post'
import Share from '../components/Share'


const Container = styled.div`
      min-height: calc(100vh - 50px);
      width: 100%;
      background: ${props => props.theme.feedBg};
      display: flex;
      flex-direction: column;
      overflow: auto;
      align-items:center;
      padding: 50px 20px;
      gap: 50px;
`

const Feed = () => {

    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['fetchAllPosts'],
        queryFn: async () => {
            const res = await makeRequest.get('/post/fetch')
            return res.data.posts
        },
    })


    return (
        <Container>
            <Share />
            {
                data?.map((post) => {
                    return <Post post={post} key={post._id} />
                })
            }

        </Container>
    )
}

export default Feed