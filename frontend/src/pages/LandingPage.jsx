import { useState } from 'react';
import './LandingPage.css';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    mensaje: ''
  });

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('¡Gracias! Te contactaremos pronto.');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-pro">
        <div className="container-pro">
          <div className="hero-content-pro">
            <div className="hero-badge">🚀 La mejor solución para gestión de herramientas</div>
            <h1>
              Gestiona tus herramientas de forma <span className="gradient-text">inteligente</span>
            </h1>
            <p className="hero-subtitle-pro">
              La forma más fácil de controlar inventario, préstamos y mantenimiento. 
              Ahorra tiempo y reduce pérdidas hasta en un 60%.
            </p>
            <div className="hero-buttons-pro">
              <a href="/registro" className="btn-hero-primary">Empieza gratis →</a>
              <a href="#demo" className="btn-hero-secondary">
                <span className="btn-icon">📞</span>
                Agendar demo
              </a>
            </div>
            <div className="hero-trust">
              <div className="trust-item">
                <span className="trust-icon">⭐</span>
                <span className="trust-text">Calificación 4.9/5</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span className="trust-text">2 meses gratis</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span className="trust-text">100% Seguro</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="dashboard-mockup">
              <div className="mockup-window">
                <div className="window-bar">
                  <span></span><span></span><span></span>
                </div>
                <div className="mockup-content">
                  <div className="mockup-stat">
                    <div className="stat-icon-pro">🔧</div>
                    <div>
                      <div className="stat-value">124</div>
                      <div className="stat-label-pro">Herramientas</div>
                    </div>
                  </div>
                  <div className="mockup-stat">
                    <div className="stat-icon-pro">📦</div>
                    <div>
                      <div className="stat-value">24</div>
                      <div className="stat-label-pro">Préstamos activos</div>
                    </div>
                  </div>
                  <div className="mockup-stat">
                    <div className="stat-icon-pro">⚙️</div>
                    <div>
                      <div className="stat-value">6</div>
                      <div className="stat-label-pro">Mantenimientos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
{/* Quiénes somos */}
      <section id="nosotros" className="about-section">
        <div className="container-pro">
          <div className="about-content">
            <div className="about-text">
              <h2>Quiénes somos</h2>
              <p className="about-intro">
                ToolTrack nace en 2025con una misión clara: transformar la gestión de herramientas 
                en Colombia mediante tecnología simple y efectiva.
              </p>
              <p className="about-description">
                Después de trabajar con empresas del sector azucarero y mantenimiento industrial, 
                identificamos que el 85% perdía entre $8-12 millones anuales por mal control de inventario. 
                Creamos ToolTrack para solucionar este problema de raíz.
              </p>
              <div className="about-stats">
                <div className="stat-item">
                  <div className="stat-number">2025</div>
                  <div className="stat-label">Año de fundación</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">2+</div>
                  <div className="stat-label">Empresas asesoradas</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">60%</div>
                  <div className="stat-label">Reducción de pérdidas</div>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="about-card">
                <h3>Nuestra misión</h3>
                <p>
                  Democratizar el acceso a tecnología de gestión de inventario de clase mundial, 
                  haciendo que sea tan simple como escanear un código QR.
                </p>
              </div>
              <div className="about-card">
                <h3>Nuestra visión</h3>
                <p>
                  Ser la plataforma líder en gestión de herramientas en Latinoamérica, 
                  ayudando a 10,000 empresas a ahorrar tiempo y dinero para 2027.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-pro">
        <div className="container-pro">
          <div className="section-header">
            <h2>Todo lo que necesitas en un solo lugar</h2>
            <p>Potentes funcionalidades diseñadas para empresas como la tuya</p>
          </div>
          <div className="features-grid-pro">
            <div className="feature-card-pro">
              <div className="feature-icon-pro">📱</div>
              <h3>Sistema QR Inteligente</h3>
              <p>Registra préstamos en 8 segundos con códigos QR únicos. Rápido, preciso y sin errores.</p>
            </div>
            <div className="feature-card-pro">
              <div className="feature-icon-pro">📊</div>
              <h3>Dashboard en Tiempo Real</h3>
              <p>Visualiza todo tu inventario al instante. Métricas actualizadas automáticamente.</p>
            </div>
            <div className="feature-card-pro">
              <div className="feature-icon-pro">🔔</div>
              <h3>Alertas Automáticas</h3>
              <p>Recibe notificaciones de mantenimientos y devoluciones pendientes vía email y SMS.</p>
            </div>
            <div className="feature-card-pro">
              <div className="feature-icon-pro">📡</div>
              <h3>Modo Offline</h3>
              <p>Funciona sin internet en obra. Sincronización automática cuando te conectes.</p>
            </div>
            <div className="feature-card-pro">
              <div className="feature-icon-pro">📈</div>
              <h3>Reportes Inteligentes</h3>
              <p>Análisis detallados de uso, costos y rentabilidad por herramienta.</p>
            </div>
            <div className="feature-card-pro">
              <div className="feature-icon-pro">🔐</div>
              <h3>Seguridad Total</h3>
              <p>Encriptación de datos y respaldos automáticos. Tu información siempre protegida.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planes - Estilo Alegra */}
      <section id="planes" className="pricing-pro">
        <div className="container-pro">
          <div className="section-header">
            <h2>Elige tu plan</h2>
            <p>Sin contratos. Sin sorpresas. Cancela cuando quieras.</p>
          </div>
          
          <div className="pricing-cards">
            {/* Plan Básico */}
            <div className="pricing-card-pro">
              <div className="card-header-pro">
                <h3>Básico</h3>
                <div className="price-pro">
                  <span className="currency-pro">$</span>
                  <span className="amount-pro">40,000</span>
                  <span className="period-pro">/mes</span>
                </div>
                <p className="plan-desc">Perfecto para empezar</p>
              </div>
              <a href="/registro" className="btn-comenzar">Empieza gratis</a>
              <ul className="features-list-pro">
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Hasta 20 empleados
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  100 herramientas
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Sistema QR completo
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Dashboard básico
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Soporte por email
                </li>
                <li className="feature-item-pro disabled">
                  <span className="x-icon">✗</span>
                  Reportes avanzados
                </li>
                <li className="feature-item-pro disabled">
                  <span className="x-icon">✗</span>
                  Modo offline
                </li>
              </ul>
            </div>

            {/* Plan Estándar - RECOMENDADO */}
            <div className="pricing-card-pro recommended">
              <div className="badge-recommended">🔥 Recomendado</div>
              <div className="card-header-pro">
                <h3>Estándar</h3>
                <div className="price-pro">
                  <span className="currency-pro">$</span>
                  <span className="amount-pro">65,000</span>
                  <span className="period-pro">/mes</span>
                </div>
                <p className="plan-desc">Ideal para crecer</p>
              </div>
              <button className="btn-plan-pro primary">Empieza gratis</button>
              <ul className="features-list-pro">
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Hasta 35 empleados
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  300 herramientas
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Sistema QR completo
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Dashboard avanzado
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Soporte prioritario
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Reportes avanzados
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Modo offline
                </li>
              </ul>
            </div>

            {/* Plan Avanzado */}
            <div className="pricing-card-pro">
              <div className="card-header-pro">
                <h3>Avanzado</h3>
                <div className="price-pro">
                  <span className="currency-pro">$</span>
                  <span className="amount-pro">90,000</span>
                  <span className="period-pro">/mes</span>
                </div>
                <p className="plan-desc">Para grandes operaciones</p>
              </div>
              <button className="btn-plan-pro">Empieza gratis</button>
              <ul className="features-list-pro">
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Hasta 50 empleados
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Herramientas ilimitadas
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Sistema QR completo
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Dashboard premium
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Soporte 24/7
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  Reportes personalizados
                </li>
                <li className="feature-item-pro">
                  <span className="check-icon">✓</span>
                  API personalizada
                </li>
              </ul>
            </div>
          </div>

          <div className="pricing-note">
            <span className="note-icon">🎁</span>
            <p><strong>Prueba gratis por 2 meses</strong> - Sin tarjeta de crédito requerida</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container-pro">
          <div className="section-header">
            <h2>Preguntas frecuentes sobre nuestros planes</h2>
          </div>
          
          <div className="faq-grid">
            <div className="faq-column">
              <div className={`faq-item ${openFaq === 0 ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(0)}>
                  <span>¿Cómo funciona la prueba gratis de 2 meses?</span>
                  <span className="faq-icon">{openFaq === 0 ? '−' : '+'}</span>
                </button>
                {openFaq === 0 && (
                  <div className="faq-answer">
                    Puedes usar ToolTrack completamente gratis durante 2 meses con todas las funcionalidades del plan que elijas. No necesitas tarjeta de crédito para empezar.
                  </div>
                )}
              </div>

              <div className={`faq-item ${openFaq === 1 ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(1)}>
                  <span>¿Cuándo puedo cancelar mi plan?</span>
                  <span className="faq-icon">{openFaq === 1 ? '−' : '+'}</span>
                </button>
                {openFaq === 1 && (
                  <div className="faq-answer">
                    Puedes cancelar en cualquier momento sin penalidades. No hay contratos de permanencia mínima.
                  </div>
                )}
              </div>

              <div className={`faq-item ${openFaq === 2 ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(2)}>
                  <span>¿Puedo cambiar de plan en cualquier momento?</span>
                  <span className="faq-icon">{openFaq === 2 ? '−' : '+'}</span>
                </button>
                {openFaq === 2 && (
                  <div className="faq-answer">
                    Sí, puedes actualizar o degradar tu plan cuando lo necesites. Los cambios se aplican de forma inmediata.
                  </div>
                )}
              </div>
            </div>

            <div className="faq-column">
              <div className={`faq-item ${openFaq === 3 ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(3)}>
                  <span>¿Qué incluye el soporte técnico?</span>
                  <span className="faq-icon">{openFaq === 3 ? '−' : '+'}</span>
                </button>
                {openFaq === 3 && (
                  <div className="faq-answer">
                    El plan Básico incluye soporte por email. El plan Estándar incluye soporte prioritario. El plan Avanzado incluye soporte 24/7 por WhatsApp, email y llamada.
                  </div>
                )}
              </div>

              <div className={`faq-item ${openFaq === 4 ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(4)}>
                  <span>¿Qué pasa si supero el límite de empleados?</span>
                  <span className="faq-icon">{openFaq === 4 ? '−' : '+'}</span>
                </button>
                {openFaq === 4 && (
                  <div className="faq-answer">
                    Si necesitas agregar más empleados, simplemente actualiza a un plan superior. El cambio es instantáneo y solo pagas la diferencia prorrateada.
                  </div>
                )}
              </div>

              <div className={`faq-item ${openFaq === 5 ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(5)}>
                  <span>¿Los datos están seguros?</span>
                  <span className="faq-icon">{openFaq === 5 ? '−' : '+'}</span>
                </button>
                {openFaq === 5 && (
                  <div className="faq-answer">
                    Absolutamente. Usamos encriptación de nivel bancario y hacemos respaldos automáticos diarios. Tus datos están 100% protegidos.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto - Estilo Alegra */}
      <section id="demo" className="contact-section">
        <div className="container-pro">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Contáctanos a cualquier hora y desde cualquier lugar</h2>
              <p className="contact-subtitle">
                Tienes soporte gratis e ilimitado para comunicarte con nuestro equipo 
                especializado 24/7. ¡Déjanos saber cómo podemos ayudarte!
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">📞</div>
                  <div>
                    <h3>Habla con un asesor</h3>
                    <p>Recibe acompañamiento personalizado</p>
                    <a href="tel:+573107284321" className="method-link">
                      Llama al 323 254 0794
                    </a>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">💬</div>
                  <div>
                    <h3>Chat en vivo</h3>
                    <p>Soluciona tus dudas en segundos</p>
                    <a href="https://wa.me/573107284321" className="method-link" target="_blank" rel="noopener noreferrer">
                      Iniciar chat
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <div className="form-header">
                <h3>¿Prefieres escribirnos? ¡Adelante!</h3>
                <p>Nuestro team especializado te responderá en el menor tiempo posible.</p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form-pro">
                <div className="form-row">
                  <div className="form-field">
                    <label>Nombre completo*</label>
                    <input
                      type="text"
                      placeholder="Juan Pérez"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Correo electrónico*</label>
                    <input
                      type="email"
                      placeholder="juanperez@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Empresa</label>
                  <input
                    type="text"
                    placeholder="Nombre de tu empresa"
                    value={formData.empresa}
                    onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                  />
                </div>

                <div className="form-field">
                  <label>¿En qué podemos ayudarte?*</label>
                  <textarea
                    placeholder="Cuéntanos un poco más, para darte una respuesta más rápida con el equipo especializado"
                    rows="4"
                    value={formData.mensaje}
                    onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                    required
                  ></textarea>
                </div>

                <div className="form-field">
                  <label>Número de teléfono*</label>
                  <div className="phone-input">
                    <select className="country-code">
                      <option value="+57">🇨🇴 Colombia (+57)</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="300 123 4567"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-submit-pro">
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-final">
        <div className="container-pro">
          <h2>¿Listo para transformar tu gestión de herramientas?</h2>
          <p>Únete a las empresas que ya están ahorrando tiempo y dinero con ToolTrack</p>
          <div className="cta-buttons-final">
            <a href="/registro" className="btn-hero-primary">Empieza gratis →</a>
            <a href="#demo" className="btn-cta-secondary">Agendar una demo</a>
          </div>
        </div>
      </section>

      {/* WhatsApp Flotante */}
      <a 
        href="https://wa.me/573232540794?text=Hola,%20quiero%20conocer%20más%20sobre%20ToolTrack" 
        className="whatsapp-float-pro"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 32 32" fill="white" width="24" height="24">
          <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.924 0-7.435 6.052-13.487 13.487-13.487s13.487 6.052 13.487 13.487c0 7.435-6.052 13.487-13.487 13.487zM21.98 18.614c-0.269-0.134-1.586-0.783-1.832-0.873-0.245-0.089-0.424-0.134-0.603 0.134s-0.693 0.873-0.849 1.052c-0.156 0.179-0.313 0.201-0.582 0.067s-1.134-0.417-2.161-1.331c-0.799-0.711-1.338-1.591-1.494-1.86s-0.017-0.413 0.118-0.547c0.121-0.12 0.269-0.313 0.403-0.47s0.179-0.268 0.268-0.447c0.089-0.179 0.045-0.335-0.022-0.47s-0.603-1.453-0.826-1.989c-0.216-0.521-0.437-0.451-0.603-0.459-0.156-0.008-0.335-0.010-0.514-0.010s-0.469 0.067-0.715 0.335c-0.245 0.268-0.937 0.916-0.937 2.234s0.959 2.591 1.093 2.77c0.134 0.179 1.887 2.88 4.573 4.040 0.639 0.277 1.138 0.442 1.527 0.565 0.641 0.204 1.224 0.175 1.686 0.106 0.514-0.077 1.586-0.648 1.809-1.274s0.223-1.162 0.156-1.274c-0.067-0.112-0.245-0.179-0.514-0.313z"/>
        </svg>
      </a>
    </>
  );
}
