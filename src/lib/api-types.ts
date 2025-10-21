export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface ModifyUserRequest {
  name?: string;
  profile_image?: string;
  is_public?: boolean;
}

export interface CreateMissionsRequest {
  missions: Array<{
    title: string;
    description?: string;
    xpReward: number;
    difficulty?: string;
  }>;
}

export interface CompleteMissionRequest {
  missionId: string;
}
