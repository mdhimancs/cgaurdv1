export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type ComplianceFramework = 'SOX' | 'ISO 27001' | 'NIST CSF' | 'PCI-DSS' | 'SOC 2' | 'Internal Audit';
export type IssueStatus = 'Open' | 'In Progress' | 'Under Review' | 'Remediated' | 'Overdue';

export interface AuditIssue {
  id: string;
  title: string;
  framework: ComplianceFramework;
  severity: SeverityLevel;
  businessUnit: string;
  buLead: string;
  identifiedDate: string;
  targetDate: string;
  daysOpen: number;
  isOverdue: boolean;
  status: IssueStatus;
  description: string;
  managementActionPlan: string;
  progressPercent: number;
  leadAuditor: string;
}

export interface TechDebtItem {
  id: string;
  systemName: string;
  category: 'Legacy OS' | 'Database' | 'Monolithic App' | 'Hardware/Appliance' | 'Deprecated Protocol';
  businessUnit: string;
  riskScore: number;
  eolDate: string;
  status: 'Critical EOL' | 'Near EOL' | 'Migration Underway' | 'Decommission Scheduled';
  replacementProject: string;
  targetRetirementDate: string;
  affectedEndpoints: number;
  annualMaintenanceCost: number;
  estModernizationBudget: number;
  remediationProgress: number;
}

export interface BUTrainingMetric {
  businessUnit: string;
  buLead: string;
  totalEmployees: number;
  annualTrainingCompleted: number;
  annualTrainingRate: number;
  phishingSimSent: number;
  phishingSimClicked: number;
  phishingClickRate: number;
  phishingReported: number;
  phishingReportRate: number;
  status: 'ON TRACK' | 'ACTION REQ' | 'CRITICAL';
  delinquentStaffCount: number;
  lastSimDate: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  summary: string;
  severity: SeverityLevel;
  businessUnit: string;
  timestamp: string;
  timeAgo: string;
  status: 'Mitigated' | 'Investigating' | 'Remediating' | 'Resolved';
  impact: string;
}

export interface VamPosture {
  totalAssets: number;
  criticalVulns: number;
  highVulns: number;
  averageMttrDays: number;
  complianceScore: number;
}

export interface CloudPosture {
  resourceCount: number;
  misconfigurations: number;
  securityGroupsOpen: number;
  complianceScore: number;
}

export interface CiCdPosture {
  pipelineCount: number;
  secretsDetected: number;
  dependencyVulns: number;
}

export interface PrivilegePosture {
  privilegedUsers: number;
  mfaEnforcedRate: number;
  accessReviewsPending: number;
}

export interface BUPerformance {
  businessUnit: string;
  buLead: string;
  totalVulnerabilities: number;
  overdueVulnerabilities: number;
  mttrDays: number;
  slaComplianceRate: number;
  securityScore: number;
  openAuditCount: number;
  criticalTechDebtCount: number;
  trainingComplianceRate: number;
}

export type ViewType = 
  | 'overview' 
  | 'audit' 
  | 'tech-debt' 
  | 'training' 
  | 'iam'
  | 'ztna'
  | 'nhi-secrets'
  | 'itdr'
  | 'privacy'
  | 'ai-security'
  | 'vam'
  | 'cloud-sec'
  | 'network-sec'
  | 'cicd-sec'
  | 'tprm'
  | 'siem-soar'
  | 'kri-kar'
  | 'boardroom';

export type UserRole = 'SVP_GLOBAL' | 'GROUP_MANAGER' | 'BU_LEAD';

export interface ThirdPartyVendor {
  id: string;
  vendorName: string;
  category: 'Cloud SaaS' | 'Payment Gateway' | 'AI & LLM API' | 'HR & Payroll' | 'Data Infrastructure';
  tier: 'Tier 1 (Critical)' | 'Tier 2 (Important)' | 'Tier 3 (Standard)';
  riskScore: number; // 0-100 (lower is better or risk rating)
  soc2Status: 'Verified Current' | 'Expiring in 30d' | 'Overdue / Missing';
  iso27001: boolean;
  doraCompliant: boolean;
  businessOwner: string;
  fourthPartyCount: number;
  lastAssessmentDate: string;
  dataAccessLevel: 'PII & Financial' | 'Operational Data' | 'None';
}

export interface SiemSoarMetrics {
  siemEventsIngested24h: number;
  activeAlerts: number;
  falsePositiveRate: number;
  soarPlaybooksExecuted24h: number;
  soarAutomationRate: number;
  meanTimeToDetectMinutes: number;
  meanTimeToContainMinutes: number;
  topTriggeredRule: string;
}

export interface KriKarIndicator {
  id: string;
  code: string;
  category: 'KRI (Key Risk)' | 'KAR (Key Assurance)' | 'KPI (Performance)';
  title: string;
  currentValue: string;
  targetThreshold: string;
  status: 'Optimal' | 'Warning' | 'Breached';
  trend: 'Improving' | 'Stable' | 'Degrading';
  businessOwner: string;
  frequency: 'Real-Time' | 'Daily' | 'Monthly' | 'Quarterly';
}

export type PostureDomain = 
  | 'vam' 
  | 'cloud-sec' 
  | 'network-sec' 
  | 'cicd-sec' 
  | 'iam' 
  | 'ztna'
  | 'nhi-secrets'
  | 'itdr'
  | 'privacy' 
  | 'ai-security'
  | 'attack-paths'
  | 'mitre'
  | 'caasm'
  | 'sod';

export interface PostureFinding {
  id: string;
  domain: PostureDomain;
  title: string;
  assetTarget: string;
  cveOrRule?: string;
  severity: SeverityLevel;
  businessUnit: string;
  identifiedDate: string;
  targetDate: string;
  daysOpen: number;
  timeSinceOpenText: string;
  isOverdue: boolean;
  owner: string; // Assigned Engineer / Lead
  accountable: string; // BU Lead / Executive
  status: 'Open' | 'In Progress' | 'Under Review' | 'Remediated' | 'Overdue';
  remediationPlan: string;
  telemetrySource: string;
  complianceImpact?: string;
}

