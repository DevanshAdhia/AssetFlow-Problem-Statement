import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Printer, 
  Download, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2,
  Clock,
  Building,
  FileText
} from 'lucide-react';
import './Terms.css';

const sectionsData = [
  {
    id: "section-1",
    title: "Administrator Responsibilities",
    content: "An Administrator is responsible for maintaining the organization's ERP configuration and ensuring the system is used securely.\n\nResponsibilities include:\n• Managing departments\n• Managing asset categories\n• Managing employee accounts\n• Assigning user roles\n• Monitoring organization-wide activities\n• Maintaining accurate organizational data\n• Ensuring compliance with company policies"
  },
  {
    id: "section-2",
    title: "Role Assignment Policy",
    content: "Only existing employees can be promoted within the AssetFlow system. Administrators are strictly prohibited from creating fake or placeholder users.\n\nRole assignment must follow formal organization approval processes. Self-promotion to higher administrative tiers is prohibited. Only authorized top-level administrators have the clearance to assign privileged roles."
  },
  {
    id: "section-3",
    title: "Department Management Policy",
    content: "The Administrator agrees to create departments responsibly and accurately reflect the organizational structure. Department information must be kept updated.\n\nAdministrators must assign Department Heads correctly. When a department is no longer active, the Administrator must deactivate it rather than deleting historical records to preserve audit trails."
  },
  {
    id: "section-4",
    title: "Employee Management Policy",
    content: "The Administrator agrees to maintain accurate employee records and ensure activation and deactivation of accounts occurs promptly following HR directives.\n\nAdministrators must never attempt to access or reset employee passwords for personal use, and must protect all employee personal information stored within the system."
  },
  {
    id: "section-5",
    title: "Asset Category Policy",
    content: "The Administrator is responsible for creating standardized asset categories that align with the organization's inventory management strategy. Administrators must actively avoid creating duplicate categories and maintain category consistency across all regional deployments."
  },
  {
    id: "section-6",
    title: "Security Responsibilities",
    content: "The Administrator must use a strong, unique password and enable Multi-Factor Authentication (MFA) whenever available.\n\nAdministrators must never share credentials, must always log out from shared computers, and report any suspicious activity immediately. Bypassing security mechanisms for convenience is strictly prohibited."
  },
  {
    id: "section-7",
    title: "Data Integrity Policy",
    content: "The Administrator agrees that all data entered into AssetFlow must be strictly accurate. Historical records should never be modified without formal, documented authorization.\n\nAudit records must remain immutable and unchanged. Deletion of any data must strictly follow the company's data retention and deletion policies."
  },
  {
    id: "section-8",
    title: "Access Control Policy",
    content: "The Administrator acknowledges that every action performed within the system is logged. Login history, including failed login attempts, is continuously monitored.\n\nPermission changes are heavily audited. Any unauthorized access attempts or privilege escalations may result in immediate account suspension pending investigation."
  },
  {
    id: "section-9",
    title: "Audit Compliance",
    content: "The Administrator agrees to fully support organizational audits by maintaining accurate records. Administrators must never attempt to hide missing assets or falsify reports, and must cooperate completely with both internal and external auditors."
  },
  {
    id: "section-10",
    title: "Privacy & Confidentiality",
    content: "The Administrator must rigorously protect employee information, organization data, asset records, maintenance records, booking information, reports, and analytics.\n\nThis confidential information must never be disclosed to unauthorized third parties or external entities without explicit organizational authorization."
  },
  {
    id: "section-11",
    title: "Prohibited Activities",
    content: "The Administrator must NOT:\n• Share admin accounts.\n• Modify audit logs.\n• Delete historical records without approval.\n• Create fake departments or employees.\n• Allocate assets fraudulently.\n• Disable security controls.\n• Upload malicious files.\n• Use the system for personal purposes.\n• Access unauthorized databases."
  },
  {
    id: "section-12",
    title: "System Monitoring",
    content: "The AssetFlow system continuously records and monitors:\n• Login and Logout Times\n• IP Addresses\n• Device and Browser Information\n• Comprehensive Activity Logs\n• Permission and Role Changes"
  },
  {
    id: "section-13",
    title: "Account Suspension",
    content: "Administrator accounts may be suspended without prior notice for:\n• Policy violations\n• Security incidents or breaches\n• Unauthorized data modifications\n• Repeated failed logins\n• Direct request from the Organization's executive board"
  },
  {
    id: "section-14",
    title: "Legal Compliance",
    content: "The Administrator agrees to comply completely with internal organization policies, regional and international data privacy regulations (such as GDPR or CCPA), information security standards, and all internal audit requirements."
  }
];

const Terms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(sectionsData[0].id);
  const [expandedSections, setExpandedSections] = useState(
    sectionsData.reduce((acc, section) => ({ ...acc, [section.id]: true }), {})
  );
  
  const contentRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      // Progress bar
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      // Active TOC section
      const sections = sectionsData.map(s => document.getElementById(s.id));
      const current = sections.find(section => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= 300;
      });

      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredSections = sectionsData.map(section => {
    if (!searchQuery) return section;
    
    const matchTitle = section.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchContent = section.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (matchTitle || matchContent) return section;
    return null;
  }).filter(Boolean);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("Downloading PDF...");
  };

  return (
    <div className="terms-page">
      {/* Top Progress Bar */}
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      <div className="terms-container">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="terms-sidebar">
          <div className="sidebar-brand">
            <ShieldCheck size={28} className="text-primary" />
            <span>AssetFlow</span>
          </div>

          <div className="sidebar-search">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search terms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="toc-wrapper">
            <h3 className="toc-title">Table of Contents</h3>
            <ul className="toc-list">
              {sectionsData.map((section, index) => (
                <li key={section.id}>
                  <a 
                    href={`#${section.id}`} 
                    className={`toc-link ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <span className="toc-number">{index + 1}.</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="terms-content" ref={contentRef}>
          <div className="terms-header">
            <div className="header-badges">
              <span className="badge-version">Version 2.4.0</span>
              <span className="badge-date"><Clock size={14} /> Last Updated: Oct 2026</span>
            </div>
            
            <h1 className="terms-title">Admin Terms & Conditions</h1>
            
            <p className="terms-subtitle">
              These Terms & Conditions define the responsibilities, permissions, security requirements, and acceptable use policies for all Administrator accounts within the AssetFlow ERP platform.
            </p>

            <div className="header-meta">
              <div className="meta-item"><Building size={16} /> Organization: AssetFlow Enterprise</div>
              <div className="meta-item"><FileText size={16} /> Estimated Reading Time: 8 mins</div>
            </div>

            <div className="header-actions">
              <button className="btn btn-outline btn-sm" onClick={handlePrint}>
                <Printer size={16} /> Print
              </button>
              <button className="btn btn-outline btn-sm" onClick={handleDownload}>
                <Download size={16} /> Download PDF
              </button>
            </div>
          </div>

          <div className="terms-sections">
            {filteredSections.length === 0 ? (
              <div className="no-results">No sections found matching "{searchQuery}"</div>
            ) : (
              filteredSections.map((section, index) => (
                <div key={section.id} id={section.id} className="terms-section-card">
                  <div 
                    className="section-card-header" 
                    onClick={() => toggleSection(section.id)}
                  >
                    <h2>
                      <span className="section-number">Section {index + 1}</span>
                      {section.title}
                    </h2>
                    {expandedSections[section.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </div>
                  
                  {expandedSections[section.id] && (
                    <div className="section-card-body">
                      {section.content.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Acceptance Section */}
          <div className="acceptance-card">
            <div className="acceptance-icon">
              <CheckCircle2 size={32} />
            </div>
            <div className="acceptance-content">
              <h3>Administrator Agreement</h3>
              <p>By proceeding, you acknowledge that you have completely read and understood all policies listed above.</p>
              
              <label className="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span className="checkbox-text">
                  I have read, understood, and agree to comply with all Administrator Terms & Conditions.
                </span>
              </label>

              <button 
                className={`btn ${accepted ? 'btn-primary' : 'btn-disabled'}`}
                disabled={!accepted}
                onClick={() => navigate('/dashboard')}
              >
                Continue to Admin Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Terms;
