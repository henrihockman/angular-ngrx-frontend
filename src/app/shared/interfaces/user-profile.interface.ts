export interface UserProfileInterface {
  id: bigint;
  username: string;
  email: string;
  defaultSite: number;
  selectedSite: number; // Note that this does not exists in JWT payload
  showSiteMenu: boolean;
}
