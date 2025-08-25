'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage('¡Gracias por suscribirte!');
      setEmail('');
      setIsSubmitting(false);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }, 1000);
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">GRIND</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu spot de confianza para el mejor material de skate.
            </p>
          </div>

          {/* Tienda Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tienda</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tablas" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Tablas
                </Link>
              </li>
              <li>
                <Link href="/ruedas" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Ruedas
                </Link>
              </li>
              <li>
                <Link href="/zapatillas" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Zapatillas
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Ayuda</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/preguntas-frecuentes" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Envíos y Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Únete al Crew</h4>
            <p className="text-gray-400 text-sm mb-4">
              Recibe ofertas y sé el primero en conocer lo nuevo.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 px-4 py-2 rounded-r-md text-sm font-medium transition-colors disabled:cursor-not-allowed"
              >
                {isSubmitting ? '...' : 'OK'}
              </button>
            </form>
            
            {message && (
              <p className="text-green-400 text-xs mt-2">{message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © 2024 GRIND. Todos los derechos reservados.
            </p>
            
            {/* Social Links or Additional Info */}
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <Link href="/privacidad" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}