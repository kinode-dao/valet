
export interface UserInfo {
  twitterScreenName: string
  twitterUserId: string
  userId: number
}

export const isUserInfoValid = (userInfo: UserInfo | null): userInfo is UserInfo => {
  return userInfo !== null
}

