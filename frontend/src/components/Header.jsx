import { useEffect, useRef, useState } from "preact/hooks"
import { AddSiteModel } from "./AddSiteModel"
import { Avatar } from "./Avatar";
import logo from "../assets/lighthouse.svg"
import useDarkMode from "./useDarkMode";


const DarkModeButton = () => {
    const [colorTheme, setTheme] = useDarkMode();
    const toggleTheme = () => {
        
        if (colorTheme === "light" ){
            setTheme("light")
            console.log("color",colorTheme )
        }else{
            setTheme("dark")
        }
        //colorTheme === "light" ? setTheme("dark") : setTheme("light")
    }
    return (
        <a onClick={()=>toggleTheme()} className="flex px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
            {colorTheme === "light" ? (
                <svg
                    //onClick={() => setTheme("light")}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                </svg>
            )}
            {colorTheme === "light" ? (<p>Light Mode</p>):(<p>Dark Mode</p>)}
        </a>
    )
}

const Menu = () => {
    return (
        <div className="absolute z-10 py-0 mt-1 overflow-hidden bg-white rounded-md shadow-xl left-10 right-10 md:left-auto md:right-0 md:w-56 md:mr-10 dark:bg-gray-800">
            <DarkModeButton />
            <hr className="border-gray-200 dark:border-gray-700 " />
            <a href="/logout" className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                Sign Out
            </a>
        </div>
    )
}


export const Header = () => {
    const [showMenu, setShowMenu] = useState(false)
    const ref = useRef()
    console.log("HEADER")
    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (showMenu && ref.current && !ref.current.contains(e.target)) {
                setShowMenu(false)
            }
        }
        document.addEventListener("mousedown", checkIfClickedOutside)
        return () => { document.removeEventListener("mousedown", checkIfClickedOutside) }
    }, [showMenu])

    return (
        <header className="px-8 lg:px-36 py-4 bg-green-300 dark:bg-">
            <div className="flex justify-between m-auto">
                <div className="flex items-center">
                    <img src={logo} className="h-12 mr-3 sm:h-16" alt="Flowbite Logo" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Beam</span>
                </div>
                <div className="pt-2">
                    <div className="flex">
                        <div className="py-1.5">
                            <AddSiteModel />
                        </div>
                        <button onClick={() => setShowMenu(!showMenu)}>
                            <Avatar/>
                        </button>
                    </div>
                    {showMenu && <div ref={ref} ><Menu /></div>}
                </div>
            </div>
        </header>
    )
}