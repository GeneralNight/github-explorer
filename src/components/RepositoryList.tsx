import { RepositoryItem } from "./RepositoryItem";
import '../styles/repositories.scss'
import { useEffect, useRef, useState } from "react";
import { api } from "../services";
import { Repository } from "../types";
import { Loader } from "./Loader";


export const RepositoryList = () => {

    const [repositories,setRepositories] = useState<Repository[]>([])
    const [loadingRepos,setLoadingRepos] = useState<boolean>(false)
    const [errorOnLoadRepos,setErrorOnLoadRepos] = useState<string>('')
    const [githubUser,setGithubUser] = useState<string>('')
    const [repoFilter,setRepoFilter] = useState<string>('')
    const [myTimeout,setMyTimeout] = useState<any>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const inputFilterRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if(githubUser.length) {
            loadRepos(githubUser)
        }
    },[githubUser]);

    const loadRepos = (user:string) => {
        setLoadingRepos(true)
        
        api.getUserRepos(user).then(res => {
            setRepositories(res.data) 
        }).catch(err => {
            const status = err.response.status
            if(status===404) {
                setErrorOnLoadRepos(`There is not a user with this username.`)
            }else {
                setErrorOnLoadRepos(`Error on load repos, try again later.`)
            }
        }).finally(() => {
            setLoadingRepos(false)
        })    
    }

    const searchUser = (e:any) => {
        clearTimeout(myTimeout)
        setMyTimeout(
            setTimeout(() => {
                const text = e.target.value
                setRepositories([])
                setGithubUser(text)
            }, 800)
        )       
    }

    const cleanSearch = () => {
        setGithubUser('')
        setRepositories([])
        setErrorOnLoadRepos('')
        if(inputRef.current ) {
            inputRef.current.value = ''
        }
    }

    return (
        <section className="repoList">
            <h1>
                Repository list {githubUser && ` - ${githubUser}`}
            </h1>

                

                <div className="inputGroup">
                    <label htmlFor="username">Type a github username to explore the repositories</label>
                    <div className="searchBox">
                        <input ref={inputRef} type="text" name="username" id="username" onKeyUp={searchUser} readOnly={loadingRepos}/>                        
                        {loadingRepos ? 
                            <Loader/> : 
                            <button onClick={cleanSearch} className="cleanSearch">X</button>
                        }
                    </div>
                </div>

            {
                !loadingRepos && !errorOnLoadRepos.length && repositories.length ?
                <div className="inputGroup">
                    <label htmlFor="filterRepos">Filter repositories</label>
                    <div className="searchBox">
                        <input ref={inputFilterRef} type="text" name="filterRepos" id="filterRepos" onKeyUp={(e:any)=>setRepoFilter(e.target.value)} readOnly={loadingRepos}/>                        
                        {repoFilter.length ? <button onClick={cleanSearch} className="cleanSearch">X</button> : null}
                    </div>
                </div> : null

            }
            {
                !loadingRepos && !errorOnLoadRepos.length && repositories.filter(repo=>repo.name.toLowerCase().indexOf(repoFilter.toLowerCase())>-1).length  ? <ul>
                    {
                        repositories.filter(repo=>repo.name.toLowerCase().indexOf(repoFilter.toLowerCase())>-1).map((repo) => 
                        <RepositoryItem repository={repo} key={repo.id}/>
                        )
                    }
                </ul> : null
            }

            {
                !loadingRepos && !errorOnLoadRepos.length && !repositories.filter(repo=>repo.name.toLowerCase().indexOf(repoFilter.toLowerCase())>-1).length && githubUser.length ? <p className="loading">No repositories to show.</p> : null
            }

            {
                !loadingRepos && errorOnLoadRepos.length ? <p className="alertMsg">{errorOnLoadRepos}</p> : null
            }
        </section>
    );
}