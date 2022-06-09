import {
  Autocomplete,
  AutocompleteChangeDetails,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  UserOrgsResponseDataType,
  UserReposResponseDataType,
  UserResponseDataType,
} from "../../types/Github";
import LoadingSpinner from "../LoadingSpinner";
import useLocalStorage from "../../hooks/useLocalStorage";
import queryParams from "../../util/getQueryParams";
import React from "react";
import { AppDataContext } from "../../AppContext";
import setSelectedRepo from "../../actions/setSelectedRepo";
import ImportRepoLoadingModal from "../ImportRepoLoadingModal";
import setActiveStep from "../../actions/setActiveStep";

export default function ImportRepositoryPage() {
  const [orgs, setOrgs] = useState<UserOrgsResponseDataType>([]);
  const [repos, setRepos] = useState<UserReposResponseDataType>([]);
  const [user, setUser] = useState<UserResponseDataType | null>(null);

  const [selectedOrg, setSelectedOrg] = useState<string | undefined>("");

  const [orgsLoading, setOrgsLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(true);
  const [importInProgress, setImportInProgress] = useState(false);

  const [token, setToken] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRepoLatestCommit, setSelectedRepoLatestCommit] = useState("");

  const [requestCache, setRequestCache] = useLocalStorage("requestCache", {});
  const [githubToken, setGithubToken] = useLocalStorage("githubToken", "");

  const { state, dispatch } = useContext(AppDataContext);

  const fetchGithubData = async (
    url: string,
    setData?: (d: any) => void,
    ignoreCache: boolean = false
  ) => {
    const response =
      requestCache[url] ||
      (await axios.get(url, {
        headers: {
          Authorization: `token ${token}`,
        },
      }));

    if (!ignoreCache) {
      setRequestCache({ ...requestCache, [url]: response });
    }

    if (setData) {
      setData(response.data);
    }

    return response.data;
  };

  const handleSearchInput = (e: any) => {
    setSearchTerm(e?.target.value);
  };

  useEffect(() => {
    async function fetchToken() {
      if (queryParams.code) {
        const response = await axios.post(
          "https://cottage-api.vercel.app/api/github/token",
          {
            code: queryParams.code,
          }
        );
        const { token, scopes } = response.data;

        if (!githubToken) {
          setGithubToken(token);
        }

        setToken(githubToken);
      } else {
        throw new Error("code required as a query param");
      }
    }

    if (!githubToken) {
      fetchToken();
    } else {
      setToken(githubToken);
    }
  }, [githubToken]);

  useEffect(() => {
    async function fetchData() {
      if (token) {
        await fetchGithubData("https://api.github.com/user/orgs", setOrgs);
        await fetchGithubData("https://api.github.com/user/repos", setRepos);
        await fetchGithubData("https://api.github.com/user", setUser);

        setSelectedOrg(user?.login);

        setOrgsLoading(false);
        setReposLoading(false);
      }
    }

    fetchData();
  }, [token]);

  async function handleOrgSelect(org: string) {
    setSelectedOrg(org);
    setReposLoading(true);

    if (user && org === user.login) {
      await fetchGithubData("https://api.github.com/user/repos", setRepos);
    } else {
      await fetchGithubData(
        `https://api.github.com/orgs/${org}/repos`,
        setRepos
      );
    }

    setReposLoading(false);
  }

  const fetchGithubTree = async (
    url: string,
    pathPrefix: string = "",
    filesAndContents: Record<string, string> = {}
  ) => {
    const { tree } = await fetchGithubData(url, undefined, true);

    for (let i = 0; i < tree.length; i++) {
      const item = tree[i];
      if (item.type === "blob") {
        filesAndContents[pathPrefix + item.path] = await fetchGithubData(
          item.url,
          undefined,
          true
        );
      } else if (item.type === "tree") {
        await fetchGithubTree(
          item.url,
          pathPrefix ? `${pathPrefix}${item.path}/` : `${item.path}/`,
          filesAndContents
        );
      }
    }

    return filesAndContents;
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            width: "480px",
            padding: "32px",
          }}
        >
          <Stack>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Import Git Repository
            </Typography>
            <Box>
              {!user || orgsLoading ? (
                <LoadingSpinner />
              ) : (
                <Stack direction="row">
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={[user.login].concat(orgs.map((o) => o.login))}
                    sx={{ width: "70%" }}
                    renderInput={(params) => <TextField {...params} />}
                    renderTags={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <img
                                width="20"
                                height="20"
                                src={
                                  "https://cottage-api.vercel.app/github-logo.svg"
                                }
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    value={selectedOrg}
                    onChange={(e: any, v: string | null) =>
                      v && handleOrgSelect(v)
                    }
                    renderOption={(props, option) => {
                      return (
                        <ListItem {...props}>
                          <IconButton color="primary">
                            <img
                              width="20"
                              height="20"
                              src={
                                "https://cottage-api.vercel.app/github-logo.svg"
                              }
                            />
                          </IconButton>
                          {option}
                        </ListItem>
                      );
                    }}
                  />
                  <TextField
                    placeholder="Search..."
                    type="search"
                    variant="outlined"
                    sx={{ ml: 2, mb: 2 }}
                    value={searchTerm}
                    onChange={handleSearchInput}
                    className="searchField"
                  />
                </Stack>
              )}
            </Box>
            {reposLoading ? (
              <LoadingSpinner />
            ) : (
              <Box sx={{ minHeight: "302px" }}>
                <List>
                  {repos
                    .filter((r) =>
                      searchTerm ? r.name.includes(searchTerm) : true
                    )
                    .slice(0, Math.min(repos.length, 5))
                    .map((r, i) => (
                      <ListItem
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          border: "1px solid #eaeaea",
                          borderBottom:
                            i <
                            Math.min(
                              repos.filter((r) =>
                                searchTerm ? r.name.includes(searchTerm) : true
                              ).length,
                              5
                            ) -
                              1
                              ? "none"
                              : "1px solid #eaeaea",
                          borderTopLeftRadius: i === 0 ? "4px" : "0",
                          borderTopRightRadius: i === 0 ? "4px" : "0",
                          borderBottomLeftRadius:
                            i ===
                            Math.min(
                              repos.filter((r) =>
                                searchTerm ? r.name.includes(searchTerm) : true
                              ).length,
                              5
                            ) -
                              1
                              ? "4px"
                              : "0",
                          borderBottomRightRadius:
                            i ===
                            Math.min(
                              repos.filter((r) =>
                                searchTerm ? r.name.includes(searchTerm) : true
                              ).length,
                              5
                            ) -
                              1
                              ? "4px"
                              : "0",
                        }}
                      >
                        <Typography variant="body1">{r.name}</Typography>
                        <Button
                          variant="contained"
                          onClick={() => {
                            fetchGithubData(
                              `https://api.github.com/repos/${r.full_name}/commits`,
                              (data) =>
                                fetchGithubData(
                                  `https://api.github.com/repos/${r.full_name}/git/commits/${data[0].sha}`,
                                  async (data) => {
                                    setImportInProgress(true);
                                    const filesAndContents =
                                      await fetchGithubTree(
                                        `https://api.github.com/repos/${r.full_name}/git/trees/${data.tree.sha}`
                                      );

                                    dispatch(setSelectedRepo(filesAndContents));
                                    setImportInProgress(false);
                                    dispatch(setActiveStep(3));
                                  }
                                )
                            );
                          }}
                        >
                          Import
                        </Button>
                        {JSON.stringify(state.selectedRepo, null, 2)}
                      </ListItem>
                    ))}
                </List>
              </Box>
            )}
          </Stack>
        </Paper>
      </Container>
      <ImportRepoLoadingModal
        open={importInProgress}
        setOpen={setImportInProgress}
      />
    </Box>
  );
}
