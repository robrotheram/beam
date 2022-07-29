import useDarkMode from "./useDarkMode";

export const ColorToggle = () => {
    const [colorTheme, setTheme] = useDarkMode();
    return (
      
<div className="w-14 h-8">
  <input type="checkbox" id="dark-mode-toggle" className="hidden"  onClick={() => setTheme("light")}/>
  <label for="dark-mode-toggle" className="w-full h-full bg-gray-800 dark:bg-white rounded-full p-1 flex justify-between cursor-pointer">
    <span className="inline dark:hidden">🌞</span>
    <span className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 block float-right dark:float-left"></span>
    <span className="hidden dark:inline">🌛</span>
  </label>
</div>

    )
}