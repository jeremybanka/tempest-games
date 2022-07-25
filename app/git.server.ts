import { simpleGit } from "simple-git";

const git = simpleGit(`./wayfarer`);

export const getGitStatus = () => {
  const status = git.status();
  return status
}
