export enum InterestArea {
  EMPLOYEE = 'Ser Funcionário',
  PUBLIC_SERVICE = 'Concurso Público',
  OWN_BUSINESS = 'Negócio Próprio'
}

export interface SurveyResponse {
  id?: string;
  nomeGuerra: string;
  bateria: string;
  whatsapp: string;
  areaInteresse: InterestArea;
  createdAt: any; // Firestore Timestamp
}

export interface DashboardStats {
  total: number;
  counts: Record<InterestArea, number>;
  percentages: Record<InterestArea, number>;
}