import { useState } from "preact/hooks"
import api from "../api"

export const AddSiteModel = () => {
    const [showModel, setShowModel] = useState(false)
    const [site, setSite] = useState({
        URL: "test"
    })

    const handleInput = (e) => {
        let tmp = { ...site }
        tmp[e.target.id] = e.target.value
        setSite(tmp)
    }

    const handleCheck = (e) => {
        let tmp = { ...site }
        tmp[e.target.id] = e.target.checked
        setSite(tmp)
        console.log(tmp)
    }

    const getSiteData = (url) => {
        site.URL = url
        api.SiteData(site).then(data => {
            console.error('Success:', data);
            if (data.error) {
                console.error('Error:', data.error);
                return;
            }
            setSite(data)
        })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    const indexSite = () => {
        api.IndexSite(site).then(() => {
            setSite({})
            setShowModel(false)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }





    return (
        <div>
            <button onClick={() => setShowModel(true)} className="px-4 py-2 mx-4 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> Add Link </button>
            {showModel && (
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex justify-center min-h-full p-4 text-center items-center">

                            <div className="relative overflow-hidden text-left transition-all transform bg-white dark:bg-slate-900 rounded-lg shadow-xl my-8 lg:max-w-5xl w-full">
                              
                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Add new site
                                    </h3>
                                    <button onClick={() => setShowModel(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="px-4 pt-5 pb-4 bg-white dark:bg-slate-700 sm:p-6 sm:pb-4">
                                    <div>
                                        <div className="mb-2">
                                            <input
                                                type="url"
                                                id="url"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                                placeholder="Enter URl of a website"
                                                onChange={(e) => getSiteData(e.target.value)}
                                            />
                                        </div>
                                        {
                                            site.Title !== undefined && (<>
                                                <div className="flex">
                                                    <div className="w-full py-4 pr-3">
                                                        <span className="flex flex-col items-stretch mb-3">
                                                            <input
                                                                type="text"
                                                                id="Title"
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                                                placeholder="Site Title"
                                                                value={site.Title}
                                                                onKeyUp={handleInput}
                                                                required
                                                            />
                                                        </span>
                                                        <span className="flex flex-col items-stretch mb-4">
                                                            <textarea
                                                                id="Description"
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" style="height: 4.5rem"
                                                                onKeyUp={handleInput}
                                                            >
                                                                {site.Description}
                                                            </textarea>
                                                        </span>
                                                        <TagsEditor site={site} updateSite={setSite} />
                                                    </div>
                                                    
                                                    <div className="py-4 w-36">
                                                        <img className="w-full rounded-lg aspect-square object-cover" src={site.Image} />
                                                        
                                                        <div class="flex items-center mt-5">
                                                            <input 
                                                                checked={site.Public}
                                                                onChange={handleCheck}
                                                                id="Public"
                                                                type="checkbox" 
                                                                class="w-4 h-4 text-green-600 bg-gray-100 rounded border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            />
                                                            <label for="Public" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Share Public</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </>)
                                        }
                                    </div>
                                </div>

                                <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => indexSite()}
                                    >
                                        Add site
                                    </button>
                                    <button
                                        onClick={() => setShowModel(false)}
                                        type="button"
                                        className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


const Tag = ({ name, remove }) => {
    return (
        <span
            className="flex flex-wrap items-center justify-between py-2 pl-4 pr-2 m-1 text-sm font-medium text-gray-200 bg-purple-500 cursor-pointer rounded-xl hover:bg-purple-600 hover:text-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-100">
            {name}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-3 hover:text-gray-300"
                viewBox="0 0 20 20"
                fill="currentColor"
                onClick={() => { remove(name) }}
            >
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
            </svg>
        </span>
    )
}


const TagsEditor = ({ site, updateSite }) => {
    let tag = ""

    const handleInput = (e) => {
        tag = e.target.value
    }

    const addTag = (tag) => {
        console.log("TAG", tag)
        updateSite({ ...site, Tags: [...site.Tags, tag] })
    }

    const deleteTag = (tag) => {
        console.log("TAG", tag)
        updateSite({ ...site, Tags: site.Tags.filter(_tag => { if (_tag !== tag) { return _tag } }) })
    }
    return (
        <>
            <div className='flex flex-wrap px-2 pt-2 mb-3 text-sm text-gray-900 border border-gray-300 rounded-lg pb-11 bg-gray-50 dark:bg-gray-700 dark:border-gray-600  '>
                {site.Tags.map(tag => <Tag name={tag} remove={deleteTag} />)}
            </div>
            <div className="flex flex-col items-center mt-1 text-sm sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:mb-2">
                    <label for="tag">
                        <span className="text-gray-800 ml-2text-sm sm:text-base dark:text-gray-200">Add Additional Keywords?</span>
                        <input
                            id="tag"
                            minlength="5"
                            className="bg-gray-50 border border-gray-300   text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                            type="text"
                            placeholder="Add tag"
                            onChange={handleInput}
                        />
                        <p className="invisible ml-2 text-xs text-pink-700 peer-invalid:visible dark:text-gray-200">less than 5
                            characters</p>
                    </label>
                </div>
                <button
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                        addTag(tag)
                    }}
                >
                    <span>Add</span>
                </button>
            </div>
        </>

    )
}