export interface SurveyOption {
  id: string;
  iconName: 'Smartphone' | 'GraduationCap' | 'Clock' | 'Moon' | 'Sun' | 'AlarmClock' | 'Zap' | 'EyeOff' | 'Flame' | 'Sparkles';
  title: string;
  description: string;
  badge: string;
  colorTheme: 'blue' | 'purple' | 'amber' | 'emerald' | 'cyan';
}

export interface SurveyStep {
  step: number;
  questionNumber: string;
  title: string;
  subtitle: string;
  options: SurveyOption[];
}
