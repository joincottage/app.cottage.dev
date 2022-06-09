import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export type UserReposResponseDataType = GetResponseDataTypeFromEndpointMethod<
  typeof octokit.repos.listForUser
>;
export type UserOrgsResponseDataType = GetResponseDataTypeFromEndpointMethod<
  typeof octokit.orgs.listForUser
>;
export type UserResponseDataType = GetResponseDataTypeFromEndpointMethod<
  typeof octokit.users.getAuthenticated
>;
