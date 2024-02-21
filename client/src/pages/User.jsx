import React, { useEffect,useState } from 'react'
import UserHeader from '../components/UserHeader'
import { useParams } from 'react-router-dom'
import { Flex, Spinner } from '@chakra-ui/react'
import useShow from '../hooks/useShow'
import Post from "../components/Post"
const User = () => {

  const [user,setUser] = useState(null)
  const {username} =  useParams()
  const showToast = useShow()
  const [Loading,setLoading] = useState(true)
  const [posts,setPosts] = useState([])
  const [fetchingPosts,setFetchingPosts] = useState(true)

  useEffect(() => {
    const getUser = async() => {
      try{
        const res = await fetch(`/api/users/profile/${username}`)
        const  data = await res.json();

        if(data.error)
        {
          showToast("Error",data.error,"error")

          return
        }
        
        setUser(data)
        // console.log(data)
      }
      catch(error){
        showToast("Error",error.message,"error")

      } finally{
        setLoading(false)
      }
    }

    const getPosts = async () => 
    {
      setFetchingPosts(true)
      try{
        const res = await fetch(`/api/posts/user/${username}`)

        const data = await res.json()

        console.log(data) 

        setPosts(data)
      }
      catch(error)
      {
        showToast("Error",error.message,"error")
        setPosts([])
      }finally{
        setFetchingPosts(false)
      }
    }

    getUser()
    getPosts()
  },[username,showToast])

  if(!user && Loading)
  {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl"/>
      </Flex>
    )
  }

  if(!user && !Loading) return <h1>User not Found</h1>
  return (
    <>
    <UserHeader user={user} />
    {!fetchingPosts && posts.length===0 && (
      <h1>Posts will be Visible here once you post something</h1>
    )}

    {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
        <Spinner />
      </Flex>
    )}  

    {posts.map((post)=>(
      <Post key={post._id} post={post} postedBy={post.postedBy}/>
    ))}
    </>
  )
}

export default User
