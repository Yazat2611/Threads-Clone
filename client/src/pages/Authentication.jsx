import { useRecoilValue } from "recoil"
import authScreenAtom from "../atoms/authAtom"
import LoginCard from "../components/LoginCard"
import SignupCard from "../components/SignUp"
const Authentication = () => {

    const authScreenState = useRecoilValue(authScreenAtom)

  return (
    <>
       {authScreenState==="login"?<LoginCard /> : <SignupCard />}
    </>
  )
}   

export default Authentication
