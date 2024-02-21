// import React from 'react'
import { Button, useToast } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShow from '../hooks/useShow'
const LogOutButton = () => {
   const setUser =  useSetRecoilState(userAtom)
   const showToast = useShow()
  const handleLogOut = async () =>{
    try{
       
        const res = await fetch("/api/users/logout",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
        })
        const data = await res.json();
        console.log(data)
        if(data.error)
        {
            showToast("Error",data.error,"error")
        }
        localStorage.removeItem("user-threads")
        setUser(null)
    }
    catch(error)
    {
      showToast("Error",error,"error")
    }
  }
  return (
    <Button
    position={"fixed"}
    top={"30px"}
    right={"30px"}
    size={"sm"}
    onClick={handleLogOut}>
        Logout
    </Button>
  )
}

export default LogOutButton
