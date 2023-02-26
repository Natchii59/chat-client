export interface ErrorMessage {
  message?: string
  code: string
}

export interface ErrorOutput {
  statusCode: number
  message: string | ErrorMessage[]
  error?: string
}

export interface User {
  id: string
  username: string
  createdAt: Date
  updatedAt: Date
  conversations: Conversation[]
}

export interface Conversation {
  id: string
  createdAt: Date
  updatedAt: Date
  user1: User
  user2: User
  messages: Message[]
  lastMessage: Message
}

export interface Message {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  conversation: Conversation
  user: User
}

// SignIn
export interface SignInInput {
  username: string
  password: string
}

export interface SignInOutput {
  errors: ErrorOutput[] | null
  data: {
    SignIn: {
      accessToken: string
      refreshToken: string
      user: User
    }
  } | null
}

// Sign Up
export interface SignUpInput {
  username: string
  password: string
}

export interface SignUpOutput {
  errors: ErrorOutput[] | null
  data: {
    SignUp: {
      accessToken: string
      refreshToken: string
      user: User
    }
  }
}

// Authenticate
export interface AuthenticateOutput {
  errors: ErrorOutput[] | null
  data: {
    Profile: User
  }
}

// Refresh Tokens
export interface RefreshTokensOutput {
  errors: ErrorOutput[] | null
  data: {
    RefreshTokens: {
      accessToken: string
      refreshToken: string
    }
  }
}

// Get Conversations
export interface GetConversationsOutput {
  errors: ErrorOutput[] | null
  data: {
    Profile: User
  }
}

// Get Conversation
export interface FindOneConversationOutput {
  errors: ErrorOutput[] | null
  data: {
    FindOneConversation: Conversation
  }
}

export interface FindOneConversationInput {
  id: string
}

// Pagination Messages
export interface PaginationMessageOutput {
  errors: ErrorOutput[] | null
  data: {
    PaginationMessage: {
      totalCount: number
      nodes: Message[]
    }
  }
}

export interface PaginationMessageWhere {
  id?: string
  createdAt?: Date
  updatedAt?: Date
  conversationId?: string
}

export interface PaginationMessageSortBy {
  id?: 'ASC' | 'DESC'
  createdAt?: 'ASC' | 'DESC'
  updatedAt?: 'ASC' | 'DESC'
}

export interface PaginationMessageInput {
  skip: number
  take: number
  where?: PaginationMessageWhere
  sortBy?: PaginationMessageSortBy
}

// Create Message
export interface CreateMessageOutput {
  errors: ErrorOutput[] | null
  data: {
    CreateMessage: Message
  }
}

export interface CreateMessageInput {
  content: string
  conversationId: string
}
