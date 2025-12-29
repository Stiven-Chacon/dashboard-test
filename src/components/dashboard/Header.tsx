"use client"

export default function Header() {
  return (
    <header className="bg-[#1E1B4D] text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img 
          src="/Blanco.svg" 
          alt="bekind network" 
          className="h-6 md:h-10 w-auto"
        />
      </div>
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm sm:text-base">
        A
      </div>
    </header>
  )
}