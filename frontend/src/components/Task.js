import React from 'react';

export default function Task(props) {
    return(
        <div className="Task">
            <h3>{props.title}</h3>
            <p>{props.task}</p>
            <p>Priority: {props.priority}</p>
            <p>Due Date: {props.due_date}</p>
            <p>Labels: {props.labels.join(', ')}</p>
        </div>
    )
}