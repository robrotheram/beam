import { useEffect, useState } from "preact/hooks"
import api from "../api"


export const Avatar = () => {
    const [avatar, setAvatar] = useState("")
    useEffect(() => {
        api.User().then(data => {
            console.log("AVATAR", data)
            setAvatar(data.avatar)
        })
    },[])
    return (
        <img className="w-12 h-12 rounded" src={avatar} alt="your avatar" />
    )
}