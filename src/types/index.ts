export type UserRole = "entrepreneur" | "investor";

export interface User {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
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
  minValuation:string | undefined;
  maxValuation:string | undefined;
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
  id: string;
  investorId: string;
  entrepreneurId: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
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
