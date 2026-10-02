export interface PlateOrder {
  id: string;
  serialNumber: string; // e.g. "000001"
  businessName: string;
  category: string;
  googleReviewUrl: string;
  placeId?: string;
  phoneWhatsapp: string;
  contactEmail?: string;
  instagram?: string;
  topCustomText?: string; // Default: "NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE"
  status: 'pending_setup' | 'active' | 'printed' | 'delivered';
  createdAt: string;
  updatedAt: string;
  style: 'google_classic' | 'wiz_dark' | 'clean_white';
  notes?: string;
}

export interface PlateDesignConfig {
  serialNumber: string;
  businessName: string;
  googleReviewUrl: string;
  topText: string;
  style: 'google_classic' | 'wiz_dark' | 'clean_white';
  showCutGuides?: boolean;
  showWizBranding?: boolean;
  sizeDimensionCm?: number; // 12 for 12x12cm (Padrão Wiz Connect)
  resolutionDpi?: number; // 300 for print
}
