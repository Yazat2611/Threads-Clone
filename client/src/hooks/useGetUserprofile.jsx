import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useShow from './useShow'

const useGetUserprofile = () => {
  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(true)
  const {username} = useParams()
  const showToast = useShow()

    useEffect(()=>{
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                setUser(null);
            }
            finally
            {
                setLoading(false)
            }
        };
    
        getUser();
    },[username,showToast])

    return {loading,user}
  
}

export default useGetUserprofile


