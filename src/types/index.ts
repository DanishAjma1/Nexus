export type UserRole = 'entrepreneur' | 'investor' | 'admin';


export interface User {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | File | null;
  location: string;
  bio: string;
  isOnline?: boolean;
}

export interface Entrepreneur extends User {
  startupName: string | undefined;
  pitchSummary: string | undefined;
  fundingNeeded: string | undefined;
  industry: string | undefined;
  foundedYear: number | undefined;
  teamSize: number | undefined;
  revenue:string | undefined;
  profitMargin:number | undefined;
  growthRate:number | undefined;
  marketOpportunity:string | undefined;
  advantage:string | undefined;
}

export interface Investor extends User {
  investmentInterests: string[] | undefined;
  investmentStage: string[] | undefined;
  portfolioCompanies: string[] | undefined;
  totalInvestments: number | undefined;
  minimumInvestment: string | undefined;
  maximumInvestment: string | undefined;
  investmentCriteria: string[] | undefined;
  successfullExits: number | undefined;
  minTimline:number | undefined,
  maxTimline:number | undefined,
}

export interface Message {
  sender: string;
  receiver: string;
  content: string;
  isRead: boolean;
  time:Date,
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface CollaborationRequest {
  inves_id: string;
  enter_id: string;
  message: string;
  requestStatus: "pending" | "accepted" | "rejected";
  time: Date;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  url: string;
  ownerId: string;
}

export interface AuthContextType {
  user: User | null;
  userData: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Socketcontext{
  socket:string | null;
}