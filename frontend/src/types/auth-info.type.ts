import type {UserInfoType} from "./user-info.type";
import {AuthKeysType} from "./auth-keys.type";

export type AuthInfoType = {
    accessTokenKey: string,
    refreshTokenKey: string,
    userInfoKey: UserInfoType | null,
}

export type AuthInfoMap = Record<AuthKeysType, string | null>;