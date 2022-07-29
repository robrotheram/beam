const Result = ({site}) => {
    return (
        <a href={site.URL} className=" w-full lg:max-w-full lg:flex m-5 lg:m-0 lg:my-5 hover:shadow-md">
            <img 
                className="h-48 lg:h-auto  w-full sm:lg:w-56 object-cover flex-none object-center bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
                src={site.Image}
            />
            <div
                className="w-full border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white dark:border-blacks-400  dark:bg-blacks-600 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                <div className="mb-8">
                    <div className="text-gray-900 dark:text-white font-bold text-xl mb-2">
                        {site.Title}
                    </div>
                    <p className="text-gray-700 dark:text-white text-base">
                        {site.Description}
                    </p>
                </div>
                <div className="flex flex-col items-center sm:flex-row sm:flex-wrap dark:text-white">
                    {site.Tags.slice(0,10).map( tag => {
                        console.log("TAG", tag, "CHAR", tag.charCodeAt(0), String.fromCharCode(tag.charCodeAt(0)))
                        if (tag !== " "){return(
                        <div className="w-full sm:w-auto text-center m-1 p-0.5 px-3 rounded-full border border-gray-400">
                            {tag}
                        </div>
                    )}})}
                </div>
            </div>
        </a>
    )
}




export const Results = ({results}) => {
    return (
        <main className="px-8 lg:px-36">
            {results.map(site => <Result site={site}/>)}
        </main>
    )
}