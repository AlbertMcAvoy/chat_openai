'use client';

interface Props {
    language: string,
    setLanguage: (hasToBeTraduct: string) => void
}

const traduction = ({language, setLanguage}: Props) => {

    return (
        <div className="flex flex-col align-center mb-6">
            <label className="block text-gray-400 md:text-left mb-2 md:mb-0 pr-4"
                   htmlFor="inline-full-name">
                Choisir une langue de traduction (optionnel)
            </label>
            <div className="md:w-2/3">
                <input
                    className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white`}
                    id="inline-full-name" type="text" placeholder="Français"
                    onChange={e => { setLanguage(e.currentTarget.value); }}
                    value={language} />
            </div>
        </div>
    )
}

export default traduction;