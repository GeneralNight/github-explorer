import { RepositoryItemProps } from "../types";


export const RepositoryItem = (props:RepositoryItemProps) => {
    return (
        <li>
            <strong>{props.repository?.name ?? 'Default name'}</strong>
            <p>{props.repository?.description ?? 'No description'}</p>
            <a href={props.repository?.html_url} target="_blank">Go to repository</a>
        </li>
    )
}