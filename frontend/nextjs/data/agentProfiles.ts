export interface AgentProfileOption {
  id: string;
  category: string;
  mainFocus: string;
  audience: string;
  coverage: string;
  agentName: string;
}

export const AGENT_PROFILES: AgentProfileOption[] = [
  {
    id: 'a_clinic_daily',
    category: 'A. Clinic — Daily Patient Care',
    mainFocus: 'Evidence-based chairside dentistry and clinical workflows.',
    audience: 'Dentists and clinical teams delivering patient care.',
    coverage: 'Procedures, treatment planning, perioperative guidance, chairside tips.',
    agentName: 'Clinic Daily Patient Care Expert'
  },
  {
    id: 'b_practice_management',
    category: 'B. Practice Management',
    mainFocus: 'Operations, finance, compliance, and team coordination for clinics.',
    audience: 'Practice owners, administrators, front-desk leads, and nursing managers.',
    coverage: 'Billing, insurance, scheduling, procurement, staff playbooks, expansion.',
    agentName: 'Dental Practice Operations Strategist'
  },
  {
    id: 'c_education',
    category: 'C. Education — Learning & Careers',
    mainFocus: 'Academic pathways, board preparation, and professional development.',
    audience: 'Dental students, applicants, residents, and continuing-education seekers.',
    coverage: 'Admissions, CVs, personal statements, exam prep, scholarships, licensure.',
    agentName: 'Dental Education & Board Exam Mentor'
  },
  {
    id: 'd_policy_materials',
    category: 'D. Policy & Materials — Science, Safety, Innovation',
    mainFocus: 'Regulation, biomaterials, implantology, and safety frameworks.',
    audience: 'Specialists, researchers, compliance officers, procurement leads.',
    coverage: 'Implants, restorative materials, regulatory updates, risk management.',
    agentName: 'Dental Policy & Materials Science Analyst'
  }
];
