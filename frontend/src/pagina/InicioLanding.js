import React from 'react';
import Slider from 'react-slick';
import '../styles/solarPanel.css';
import imagen1 from '../assets/logoEmpresa1.png';
import imagen2 from '../assets/solar2.png';
import imagen3 from '../assets/solar4.png';

function InicioLanding() {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
  };

  return (
    <div className="panel-container">
      <div className="header text-center my-4">
        <h1>Solar Tracker</h1>
        <p>Sistema Inteligente de Energía Renovable</p>
      </div>

      <div className="carrusel-imagenes">
        <Slider {...settings}>
          <div><img className="carrusel-img" src={imagen1} alt="Primera vista" /></div>
          <div><img className="carrusel-img" src={imagen2} alt="Segunda vista" /></div>
          <div><img className="carrusel-img" src={imagen3} alt="Tercera vista" /></div>
        </Slider>
      </div>
      <div className="info-section">
  <div className="info-column">
    <h2>¿Qué es un Solar Tracker?</h2>
    <p>
      Un Solar Tracker es un sistema automatizado que ajusta la posición de los paneles solares a lo largo del día para seguir la trayectoria del sol. A diferencia de los sistemas fijos, los trackers permiten que los paneles siempre estén orientados de forma óptima, mejorando considerablemente la producción energética.
    </p>
    <p>
      Este tipo de tecnología se utiliza tanto en instalaciones residenciales como industriales, donde la eficiencia energética es una prioridad. Existen trackers de un eje (movimiento horizontal) y de dos ejes (movimiento horizontal y vertical).
    </p>
  </div>

  <div className="info-column">
    <h2>¿Para qué sirve?</h2>
    <p>
      Su principal objetivo es maximizar la captación de radiación solar. Gracias al seguimiento solar activo, los paneles pueden generar hasta un 30% más de energía en comparación con sistemas estáticos.
    </p>
    <p>
      Esto lo convierte en una opción ideal para quienes buscan reducir su dependencia de la red eléctrica, optimizar su inversión en paneles solares y aprovechar al máximo cada rayo de sol.
    </p>
  </div>

  <div className="info-column">
    <h2>Ventajas del sistema</h2>
    <ul>
      <li><strong>Mayor producción energética</strong> incluso en días parcialmente nublados.</li>
      <li><strong>Ahorro económico</strong> a mediano y largo plazo.</li>
      <li><strong>Mejor aprovechamiento del espacio</strong> en techos o terrenos.</li>
      <li><strong>Adaptación inteligente</strong> a cambios de posición solar.</li>
      <li><strong>Integración sencilla</strong> con sistemas de monitoreo y control remoto.</li>
    </ul>
  </div>
</div>

    </div>
  );
}

export default InicioLanding;
