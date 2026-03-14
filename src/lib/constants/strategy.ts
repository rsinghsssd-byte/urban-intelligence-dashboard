import { FileText, Waves, Bus, TreePine } from 'lucide-react';

export const strategies = [
  {
    tag: 'High Priority',
    tagClass: 'bg-orange-100 text-orange-700',
    title: 'East Bangalore – Mobile Clinic Deployment',
    description: 'Deploy 5 mobile health units to high-density labor zones in Whitefield and KR Puram to reduce commute burden on existing facilities and raise primary care coverage by an estimated 22%.',
    impactScore: '8.4',
    info: '3 months deployment',
    image: '/strategies/mobile_clinic_deployment_1773495715887.png',
  },
  {
    tag: 'Incentive Plan',
    tagClass: 'bg-teal-100 text-teal-700',
    title: 'North Bangalore – Pharmacy Incentives',
    description: 'Implement tax breaks for pharmacies operating 24/7 in Hebbal and Yelahanka sectors. Projected to increase night-time pharmacy access by 37% within 6 months, reducing ER visits.',
    impactScore: '7.9',
    info: '12.5% Tax Rebate',
    image: '/strategies/pharmacy_incentives_1773495736334.png',
  },
  {
    tag: 'Infrastructure',
    tagClass: 'bg-blue-100 text-blue-700',
    title: 'South Bangalore – School Bus Network Expansion',
    description: 'Expand dedicated school bus pickup zones in Koramangala and HSR Layout to reduce peak hour traffic congestion by 18% and improve student safety during commutes.',
    impactScore: '8.1',
    info: '15 New Routes',
    image: '/strategies/school_bus_network_1773495753045.png',
  },
  {
    tag: 'Emergency Response',
    tagClass: 'bg-red-100 text-red-700',
    title: 'Peripheral Ring Road – New Fire Station',
    description: 'Construct a modern localized fire and emergency response station near the PRR to cut emergency response times from 25 minutes down to 8 minutes for suburban wards.',
    impactScore: '9.2',
    info: 'Critical Infrastructure',
    image: '/strategies/emergency_response_station_1773495797109.png',
  },
  {
    tag: 'Community Health',
    tagClass: 'bg-green-100 text-green-700',
    title: 'Central Zone – Green UPHC Upgrades',
    description: 'Upgrade 4 existing Urban Primary Health Centres (UPHC) with solar panels and expanded waiting areas to handle 40% more daily outpatient volume efficiently.',
    impactScore: '7.5',
    info: 'Facility Upgrade',
    image: '/strategies/community_health_center_1773495816399.png',
  },
  {
    tag: 'Digital Access',
    tagClass: 'bg-indigo-100 text-indigo-700',
    title: 'Citywide – Telemedicine Kiosk Pilot',
    description: 'Install 25 interactive telemedicine kiosks in major public parks and transit hubs, offering free basic consultations to low-income residents without smartphones.',
    impactScore: '8.8',
    info: 'Digital Inclusion',
    image: '/strategies/telemedicine_kiosk_1773495833379.png',
  }
];

export const impactData = [
  { quarter: 'Q1', value: 38 },
  { quarter: 'Q2', value: 52 },
  { quarter: 'Q3', value: 68 },
  { quarter: 'Q4', value: 84 },
];

export const infraPriorities = [
  { icon: Waves, label: 'Sanitation', pending: 12, score: 9.8, severity: 'CRITICAL', color: 'text-red-500 bg-red-50' },
  { icon: FileText, label: 'Permit Approvals', pending: 34, score: 8.2, severity: 'HIGH', color: 'text-orange-500 bg-orange-50' },
  { icon: Bus, label: 'Transit Routing', pending: 8, score: 6.7, severity: 'MEDIUM', color: 'text-yellow-600 bg-yellow-50' },
  { icon: TreePine, label: 'Green Spaces', pending: 22, score: 5.4, severity: 'LOW', color: 'text-teal-500 bg-teal-50' },
];
