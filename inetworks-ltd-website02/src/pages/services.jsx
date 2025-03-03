import React from 'react';
import ServiceCard from '../components/ServiceCard';
import {
  FaCode,
  FaPaintBrush,
  FaSearch,
  FaMobileAlt,
  FaChartLine,
  FaCloud,
  FaShieldAlt,
  FaCogs,
} from 'react-icons/fa'; // Install react-icons: npm install react-icons
import './Services.css';

const Services = () => {
  return (
    <div className="services-container">
      <h1>Our Services</h1>
      <div className="services-grid">
        <ServiceCard
          title="Web Development"
          description="Custom websites built with the latest tech."
          icon={<FaCode />}
          link="/services/web-development"
        />
        <ServiceCard
          title="UI/UX Design"
          description="Stunning designs for user-friendly interfaces."
          icon={<FaPaintBrush />}
          link="/services/design"
        />
        <ServiceCard
          title="SEO Optimization"
          description="Boost your site’s visibility on search engines."
          icon={<FaSearch />}
          link="/services/seo"
        />
        <ServiceCard
          title="Mobile App Development"
          description="Build high-performance mobile apps for iOS and Android."
          icon={<FaMobileAlt />}
          link="/services/mobile-apps"
        />
        <ServiceCard
          title="Digital Marketing"
          description="Data-driven strategies to grow your business online."
          icon={<FaChartLine />}
          link="/services/digital-marketing"
        />
        <ServiceCard
          title="Cloud Solutions"
          description="Scalable and secure cloud infrastructure for your business."
          icon={<FaCloud />}
          link="/services/cloud-solutions"
        />
        <ServiceCard
          title="Cybersecurity"
          description="Protect your business from online threats and vulnerabilities."
          icon={<FaShieldAlt />}
          link="/services/cybersecurity"
        />
        <ServiceCard
          title="IT Consulting"
          description="Expert advice to optimize your IT infrastructure."
          icon={<FaCogs />}
          link="/services/it-consulting"
        />
      </div>
    </div>
  );
};

export default Services;