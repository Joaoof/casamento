import React from 'react'
import { Heart } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#EAEAEA] bg-white py-10">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Heart size={16} className="text-[#D4AF37]" fill="currentColor" />
          <span className="font-serif text-lg text-black">Luís & Vitória</span>
        </div>
        <p className="text-sm text-black/65">Obrigado por celebrar esse momento conosco.</p>
      </div>
    </footer>
  )
}

export default Footer
